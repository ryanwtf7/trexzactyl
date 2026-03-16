import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import Features from '@feature/Features';
import Can from '@/components/elements/Can';
import { ServerContext } from '@/state/server';
import Spinner from '@/components/elements/Spinner';
import { Alert } from '@/components/elements/alert';
import Console from '@/components/server/console/Console';
import PowerButtons from '@/components/server/console/PowerButtons';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import ServerDetailsBlock from '@/components/server/console/ServerDetailsBlock';
import tw from 'twin.macro';
import styled from 'styled-components/macro';

const HeaderCard = styled.div`
    ${tw`p-6 rounded-sm border border-neutral-700 bg-neutral-900 bg-opacity-40 backdrop-blur-xl mb-6 flex flex-col sm:flex-row justify-between items-center gap-4`};
`;

const ServerConsoleContainer = () => {
    const name = ServerContext.useStoreState((state) => state.server.data!.name);
    const isInstalling = ServerContext.useStoreState((state) => state.server.isInstalling);
    const description = ServerContext.useStoreState((state) => state.server.data!.description);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data!.isTransferring);
    const eggFeatures = ServerContext.useStoreState((state) => state.server.data!.eggFeatures, isEqual);
    const isNodeUnderMaintenance = ServerContext.useStoreState((state) => state.server.data!.isNodeUnderMaintenance);

    return (
        <ServerContentBlock title={'Console'} showFlashKey={'console:share'}>
            {(isNodeUnderMaintenance || isInstalling || isTransferring) && (
                <Alert type={'warning'} className={'mb-4'}>
                    {isNodeUnderMaintenance
                        ? 'The node of this server is currently under maintenance and all actions are unavailable.'
                        : isInstalling
                        ? 'This server is currently running its installation process and most actions are unavailable.'
                        : 'This server is currently being transferred to another node and all actions are unavailable.'}
                </Alert>
            )}

            <HeaderCard>
                <div className={'w-full sm:min-w-0'}>
                    <h1 className={'text-3xl font-bold text-neutral-100 truncate'}>{name}</h1>
                    <p className={'text-sm text-neutral-400 mt-1 line-clamp-1'}>
                        {description || 'No description provided.'}
                    </p>
                </div>
                <Can action={['control.start', 'control.stop', 'control.restart']} matchAny>
                    <PowerButtons className={'w-full sm:w-auto'} />
                </Can>
            </HeaderCard>

            <div className={'grid grid-cols-4 gap-6'}>
                <div className={'col-span-4 lg:col-span-3'}>
                    <div className={'rounded-sm'}>
                        <Spinner.Suspense>
                            <Console />
                        </Spinner.Suspense>
                    </div>
                </div>
                <div className={'col-span-4 lg:col-span-1'}>
                    <ServerDetailsBlock />
                </div>
            </div>

            <Features enabled={eggFeatures} />
        </ServerContentBlock>
    );
};

export default memo(ServerConsoleContainer, isEqual);
