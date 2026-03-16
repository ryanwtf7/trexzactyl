import React from 'react';
import tw from 'twin.macro';
import * as Icon from 'react-feather';
import Can from '@/components/elements/Can';
import { bytesToString } from '@/lib/formatters';
import { ServerBackup } from '@/api/server/types';
import Spinner from '@/components/elements/Spinner';
import { format, formatDistanceToNow } from 'date-fns';
import { SocketEvent } from '@/components/server/events';
import getServerBackups from '@/api/swr/getServerBackups';
import useWebsocketEvent from '@/plugins/useWebsocketEvent';
import BackupContextMenu from '@/components/server/backups/BackupContextMenu';
import styled from 'styled-components/macro';

const BackupCard = styled.div`
    ${tw`flex flex-wrap md:flex-nowrap items-center p-4 rounded-sm border border-neutral-700 bg-neutral-900 bg-opacity-40 backdrop-blur-xl mb-3 transition-all duration-300`};
    ${tw`hover:border-blue-500 border-opacity-50 hover:shadow-lg hover:-translate-y-0.5`};
`;

const LockIcon = styled.div<{ $locked?: boolean }>`
    ${tw`flex-none p-2 rounded-sm transition-colors duration-200`};
    ${({ $locked }) =>
        $locked
            ? tw`bg-yellow-500 bg-opacity-10 text-yellow-500`
            : tw`bg-neutral-800 text-neutral-500 group-hover:bg-blue-500 bg-opacity-10 group-hover:text-blue-400`};
`;

export default ({ backup, className }: { backup: ServerBackup; className?: string }) => {
    const { mutate } = getServerBackups();

    useWebsocketEvent(`${SocketEvent.BACKUP_COMPLETED}:${backup.uuid}` as SocketEvent, (data) => {
        try {
            const parsed = JSON.parse(data);
            mutate(
                (data) => ({
                    ...data,
                    items: data.items.map((b) =>
                        b.uuid !== backup.uuid
                            ? b
                            : {
                                  ...b,
                                  isSuccessful: parsed.is_successful || true,
                                  checksum: (parsed.checksum_type || '') + ':' + (parsed.checksum || ''),
                                  bytes: parsed.file_size || 0,
                                  completedAt: new Date(),
                              }
                    ),
                }),
                false
            );
        } catch (e) {
            console.warn(e);
        }
    });

    return (
        <BackupCard className={`group ${className || ''}`}>
            <div css={tw`flex items-center truncate w-full md:flex-1`}>
                <LockIcon $locked={backup.isLocked}>
                    {backup.completedAt !== null ? (
                        backup.isLocked ? (
                            <Icon.Lock size={18} />
                        ) : (
                            <Icon.Unlock size={18} />
                        )
                    ) : (
                        <Spinner size={'small'} />
                    )}
                </LockIcon>
                <div css={tw`flex flex-col truncate ml-4`}>
                    <div css={tw`flex items-center text-sm mb-1`}>
                        {backup.completedAt !== null && !backup.isSuccessful && (
                            <span
                                css={tw`bg-red-500 bg-opacity-10 text-red-400 py-0.5 px-2 rounded-sm text-xs font-bold uppercase border border-red-500 border-opacity-20 mr-2`}
                            >
                                Failed
                            </span>
                        )}
                        <p
                            css={tw`font-bold text-neutral-100 group-hover:text-blue-400 transition-colors duration-200 truncate`}
                        >
                            {backup.name}
                        </p>
                        {backup.completedAt !== null && backup.isSuccessful && (
                            <span css={tw`ml-3 text-neutral-500 text-xs font-medium`}>
                                {bytesToString(backup.bytes)}
                            </span>
                        )}
                    </div>
                    <p css={tw`text-xs text-neutral-600 font-mono truncate tracking-tight uppercase`}>
                        {backup.checksum}
                    </p>
                </div>
            </div>

            <div css={tw`flex items-center gap-6 mt-4 md:mt-0 md:ml-8`}>
                <div css={tw`text-right`}>
                    <p
                        title={format(backup.createdAt, 'eee, MMMM do, yyyy HH:mm:ss')}
                        css={tw`text-sm text-neutral-100 font-semibold uppercase tracking-tight`}
                    >
                        {formatDistanceToNow(backup.createdAt, { addSuffix: true })}
                    </p>
                    <p css={tw`text-xs text-neutral-500 uppercase font-black`}>Archived</p>
                </div>

                <Can action={['backup.download', 'backup.restore', 'backup.delete']} matchAny>
                    <div css={tw`ml-2`}>
                        {!backup.completedAt ? (
                            <div css={tw`p-2 opacity-0 hover:opacity-100 transition-opacity`}>
                                <Icon.MoreVertical size={18} />
                            </div>
                        ) : (
                            <BackupContextMenu backup={backup} />
                        )}
                    </div>
                </Can>
            </div>
        </BackupCard>
    );
};
