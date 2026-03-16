import { mutate } from 'swr';
import { useEffect, useRef } from 'react';
import { ServerContext } from '@/state/server';
import { SocketEvent } from '@/components/server/events';
import useWebsocketEvent from '@/plugins/useWebsocketEvent';
import { getDirectorySwrKey } from '@/plugins/useFileManagerSwr';

const InstallListener = () => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const getServer = ServerContext.useStoreActions((actions) => actions.server.getServer);
    const setServerFromState = ServerContext.useStoreActions((actions) => actions.server.setServerFromState);

    // Create refs for callbacks to avoid recreating them
    const backupRestoreCallback = useRef(() => {
        mutate(getDirectorySwrKey(uuid, '/'), undefined);
        setServerFromState((s) => ({ ...s, status: null }));
    });

    const installCompletedCallback = useRef(() => {
        getServer(uuid).catch((error) => console.error(error));
    });

    const installStartedCallback = useRef(() => {
        setServerFromState((s) => ({ ...s, status: 'installing' }));
    });

    // Update refs when dependencies change
    useEffect(() => {
        backupRestoreCallback.current = () => {
            mutate(getDirectorySwrKey(uuid, '/'), undefined);
            setServerFromState((s) => ({ ...s, status: null }));
        };
    }, [uuid, setServerFromState]);

    useEffect(() => {
        installCompletedCallback.current = () => {
            getServer(uuid).catch((error) => console.error(error));
        };
    }, [uuid, getServer]);

    useEffect(() => {
        installStartedCallback.current = () => {
            setServerFromState((s) => ({ ...s, status: 'installing' }));
        };
    }, [setServerFromState]);

    useWebsocketEvent(SocketEvent.BACKUP_RESTORE_COMPLETED, () => backupRestoreCallback.current());

    // Listen for the installation completion event and then fire off a request to fetch the updated
    // server information. This allows the server to automatically become available to the user if they
    // just sit on the page.
    useWebsocketEvent(SocketEvent.INSTALL_COMPLETED, () => installCompletedCallback.current());

    // When we see the install started event immediately update the state to indicate such so that the
    // screens automatically update.
    useWebsocketEvent(SocketEvent.INSTALL_STARTED, () => installStartedCallback.current());

    return null;
};

export default InstallListener;
