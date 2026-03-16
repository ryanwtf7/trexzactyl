import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import { ServerContext } from '@/state/server';
export type PowerAction = 'start' | 'stop' | 'restart' | 'kill';
import { Dialog } from '@/components/elements/dialog';
import renewServer from '@/api/server/renewServer';
import useFlash from '@/plugins/useFlash';
import { httpErrorToHuman } from '@/api/http';
import { useStoreState } from '@/state/hooks';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { usePermissions } from '@/plugins/usePermissions';

interface PowerButtonProps {
    className?: string;
}

const ButtonGroup = styled.div`
    ${tw`flex items-center gap-2`};
`;

const PowerButton = styled.button<{ $variant: 'start' | 'restart' | 'stop' | 'kill' | 'renew'; $isSmall?: boolean }>`
    ${tw`flex-1 px-6 py-2.5 rounded-sm font-black uppercase tracking-wider text-sm transition-all duration-200 border`};
    ${tw`disabled:opacity-50 disabled:cursor-not-allowed`};

    ${({ $isSmall }) => $isSmall && tw`sm:px-6 sm:py-2.5 px-2 py-2 text-xs`};

    ${({ $variant }) =>
        $variant === 'start'
            ? tw`bg-green-600 bg-opacity-10 text-green-400 border-green-500 border-opacity-30 hover:bg-green-600 bg-opacity-20 hover:border-green-500 border-opacity-60`
            : $variant === 'restart'
            ? tw`bg-blue-600 bg-opacity-10 text-blue-400 border-blue-500 border-opacity-30 hover:bg-blue-600 bg-opacity-20 hover:border-blue-500 border-opacity-60`
            : $variant === 'renew'
            ? tw`bg-cyan-600 bg-opacity-10 text-cyan-400 border-cyan-500 border-opacity-30 hover:bg-cyan-600 bg-opacity-20 hover:border-cyan-500 border-opacity-60`
            : tw`bg-red-600 bg-opacity-10 text-red-400 border-red-500 border-opacity-30 hover:bg-red-600 bg-opacity-20 hover:border-red-500 border-opacity-60`};
`;

export default ({ className }: PowerButtonProps) => {
    const [open, setOpen] = useState(false);
    const [renewOpen, setRenewOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { addFlash, clearFlashes } = useFlash();

    const status = ServerContext.useStoreState((state) => state.status.value);
    const instance = ServerContext.useStoreState((state) => state.socket.instance);
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const renewable = ServerContext.useStoreState((state) => state.server.data!.renewable);
    const store = useStoreState((state) => state.storefront.data?.renewals);

    const killable = status === 'stopping';
    const onButtonClick = (
        action: PowerAction | 'kill-confirmed',
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): void => {
        e.preventDefault();
        if (action === 'kill') return setOpen(true);
        if (instance) {
            setOpen(false);
            instance.send('set state', action === 'kill-confirmed' ? 'kill' : action);
        }
    };

    const doRenewal = () => {
        setLoading(true);
        clearFlashes('console:share');

        renewServer(uuid)
            .then(() => {
                setRenewOpen(false);
                setLoading(false);
                addFlash({
                    key: 'console:share',
                    type: 'success',
                    message: 'Server has been renewed.',
                });
            })
            .catch((error) => {
                setRenewOpen(false);
                setLoading(false);
                addFlash({
                    key: 'console:share',
                    type: 'danger',
                    message: 'Unable to renew your server. Are you sure you have enough credits?',
                });
                console.error(httpErrorToHuman(error));
            });
    };

    useEffect(() => {
        if (status === 'offline') setOpen(false);
    }, [status]);

    const canStart = usePermissions(['control.start'])[0];
    const canRestart = usePermissions(['control.restart'])[0];
    const canStop = usePermissions(['control.stop'])[0];
    const hasRenew = renewable && !!store;

    const buttonCount = [hasRenew, canStart, canRestart, canStop].filter(Boolean).length;
    const isSmall = buttonCount >= 4;

    return (
        <ButtonGroup className={className}>
            <Dialog.Confirm
                open={open}
                hideCloseIcon
                onClose={() => setOpen(false)}
                title={'Forcibly Stop Process'}
                confirm={'Continue'}
                onConfirmed={onButtonClick.bind(this, 'kill-confirmed')}
            >
                Forcibly stopping a server can lead to data corruption.
            </Dialog.Confirm>

            <Dialog.Confirm
                open={renewOpen}
                onClose={() => setRenewOpen(false)}
                title={'Confirm server renewal'}
                onConfirmed={() => doRenewal()}
            >
                <SpinnerOverlay visible={loading} />
                {store && (
                    <>
                        You will be charged {store.cost} credits to add {store.days} days until your next renewal is
                        due.
                    </>
                )}
            </Dialog.Confirm>

            {hasRenew && (
                <PowerButton $variant={'renew'} $isSmall={isSmall} onClick={() => setRenewOpen(true)}>
                    Renew
                </PowerButton>
            )}

            {canStart && (
                <PowerButton
                    $variant={'start'}
                    $isSmall={isSmall}
                    disabled={status !== 'offline'}
                    onClick={onButtonClick.bind(this, 'start')}
                >
                    Start
                </PowerButton>
            )}

            {canRestart && (
                <PowerButton
                    $variant={'restart'}
                    $isSmall={isSmall}
                    disabled={!status}
                    onClick={onButtonClick.bind(this, 'restart')}
                >
                    Restart
                </PowerButton>
            )}

            {canStop && (
                <PowerButton
                    $variant={killable ? 'kill' : 'stop'}
                    $isSmall={isSmall}
                    disabled={status === 'offline'}
                    onClick={onButtonClick.bind(this, killable ? 'kill' : 'stop')}
                >
                    {killable ? 'Kill' : 'Stop'}
                </PowerButton>
            )}
        </ButtonGroup>
    );
};
