import tw from 'twin.macro';
import useFlash from '@/plugins/useFlash';
import Can from '@/components/elements/Can';
import { ServerContext } from '@/state/server';
import Spinner from '@/components/elements/Spinner';
import Pagination from '@/components/elements/Pagination';
import BackupRow from '@/components/server/backups/BackupRow';
import React, { useContext, useEffect, useState } from 'react';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import CreateBackupButton from '@/components/server/backups/CreateBackupButton';
import getServerBackups, { Context as ServerBackupContext } from '@/api/swr/getServerBackups';
import * as Icon from 'react-feather';

const BackupContainer = () => {
    const { page: _page, setPage } = useContext(ServerBackupContext);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { data: backups, error, isValidating } = getServerBackups();
    const backupLimit = ServerContext.useStoreState((state) => state.server.data!.featureLimits.backups);

    useEffect(() => {
        if (!error) {
            clearFlashes('backups');
            return;
        }
        clearAndAddHttpError({ error, key: 'backups' });
    }, [error]);

    if (!backups || (error && isValidating)) {
        return <Spinner size={'large'} centered />;
    }

    return (
        <ServerContentBlock title={'Backups'}>
            <Pagination data={backups} onPageSelect={setPage}>
                {({ items }) =>
                    !items.length ? (
                        backupLimit > 0 ? (
                            <div
                                css={tw`p-12 flex flex-col items-center justify-center text-neutral-500 bg-neutral-900 bg-opacity-40 backdrop-blur-xl rounded-sm border border-neutral-700`}
                            >
                                <Icon.Database size={48} css={tw`mb-4 opacity-20`} />
                                <p css={tw`text-sm`}>
                                    It looks like there are no backups currently stored for this server.
                                </p>
                            </div>
                        ) : null
                    ) : (
                        items.map((backup) => <BackupRow key={backup.uuid} backup={backup} />)
                    )
                }
            </Pagination>
            {backupLimit === 0 && (
                <div
                    css={tw`p-8 rounded-sm bg-red-500 bg-opacity-5 border border-red-500 border-opacity-10 flex items-center gap-4`}
                >
                    <Icon.AlertTriangle css={tw`text-red-400`} />
                    <p css={tw`text-sm text-red-100`}>
                        Backups cannot be created for this server because the backup limit is set to 0.
                    </p>
                </div>
            )}
            <Can action={'backup.create'}>
                <div css={tw`mt-8 flex flex-col sm:flex-row items-center justify-between gap-4`}>
                    {backupLimit > 0 && (
                        <div
                            css={tw`flex items-center gap-3 p-3 rounded-sm bg-neutral-900 bg-opacity-40 border border-neutral-700 backdrop-blur-xl`}
                        >
                            <Icon.PieChart size={16} css={tw`text-blue-400`} />
                            <p css={tw`text-xs text-neutral-400 font-bold uppercase tracking-wider`}>
                                Status:{' '}
                                <span css={tw`text-neutral-100`}>
                                    {backups.backupCount} / {backupLimit} slots used
                                </span>
                            </p>
                        </div>
                    )}
                    {backupLimit > 0 && backupLimit > backups.backupCount && (
                        <CreateBackupButton css={tw`w-full sm:w-auto px-8`} />
                    )}
                </div>
            </Can>
        </ServerContentBlock>
    );
};

export default () => {
    const [_page, setPage] = useState<number>(1);
    return (
        <ServerBackupContext.Provider value={{ page: _page, setPage }}>
            <BackupContainer />
        </ServerBackupContext.Provider>
    );
};
