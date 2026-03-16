import React from 'react';
import tw from 'twin.macro';
import Can from '@/components/elements/Can';
import { ServerContext } from '@/state/server';
import CopyOnClick from '@/components/elements/CopyOnClick';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import RenameServerBox from '@/components/server/settings/RenameServerBox';
import DeleteServerBox from '@/components/server/settings/DeleteServerBox';
import ReinstallServerBox from '@/components/server/settings/ReinstallServerBox';
import ChangeBackgroundBox from '@/components/server/settings/ChangeBackgroundBox';
import { useStoreState } from 'easy-peasy';
import styled from 'styled-components/macro';
import * as Icon from 'react-feather';

import GlassCard from '@/components/elements/GlassCard';

const DebugCard = styled(GlassCard)`
    ${tw`p-6 mb-6`};
`;

const InfoRow = styled.div`
    ${tw`flex items-center justify-between p-3 rounded-lg bg-neutral-800/50 border border-neutral-700/50 mb-3 last:mb-0 cursor-pointer hover:border-blue-500/30 transition-all`};
`;

const SettingsContainer = () => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const node = ServerContext.useStoreState((state) => state.server.data!.node);
    const deletion = useStoreState((state) => state.storefront.data!.deletion.enabled);

    return (
        <ServerContentBlock title={'Settings'}>
            <div className={'grid grid-cols-1 lg:grid-cols-2 gap-8'}>
                <div>
                    <DebugCard>
                        <div css={tw`flex items-center gap-3 mb-6`}>
                            <div css={tw`p-2 rounded-lg bg-blue-500/10 text-blue-400`}>
                                <Icon.Code size={18} />
                            </div>
                            <div>
                                <h3 css={tw`text-sm font-black text-neutral-100 uppercase tracking-widest`}>
                                    Debug Info
                                </h3>
                                <p css={tw`text-[10px] text-neutral-500 font-bold uppercase`}>System identifiers</p>
                            </div>
                        </div>

                        <InfoRow className={'group'}>
                            <div css={tw`flex items-center gap-3`}>
                                <Icon.Server size={14} css={tw`text-neutral-500`} />
                                <span css={tw`text-xs font-bold text-neutral-400 uppercase tracking-wider`}>Node</span>
                            </div>
                            <code css={tw`font-mono text-xs text-blue-300 font-bold`}>{node}</code>
                        </InfoRow>

                        <CopyOnClick text={uuid}>
                            <InfoRow className={'group'}>
                                <div css={tw`flex items-center gap-3`}>
                                    <Icon.Hash size={14} css={tw`text-neutral-500`} />
                                    <span css={tw`text-xs font-bold text-neutral-400 uppercase tracking-wider`}>
                                        Server ID
                                    </span>
                                </div>
                                <code css={tw`font-mono text-xs text-blue-300 font-bold truncate max-w-[180px]`}>
                                    {uuid}
                                </code>
                            </InfoRow>
                        </CopyOnClick>
                    </DebugCard>

                    {deletion && (
                        <div css={tw`mb-6`}>
                            <DeleteServerBox />
                        </div>
                    )}
                    <ChangeBackgroundBox />
                </div>

                <div className={'space-y-6'}>
                    <Can action={'settings.rename'}>
                        <RenameServerBox />
                    </Can>
                    <Can action={'settings.reinstall'}>
                        <ReinstallServerBox />
                    </Can>
                </div>
            </div>
        </ServerContentBlock>
    );
};

export default SettingsContainer;
