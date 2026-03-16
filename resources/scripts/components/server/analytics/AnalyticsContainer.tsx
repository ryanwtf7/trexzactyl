import Can from '@/components/elements/Can';
import { ServerContext } from '@/state/server';
import React, { useEffect, useState } from 'react';
import { getMessages, Message } from '@/api/server/analytics';
import StatGraphs from '@/components/server/console/StatGraphs';
import PowerButtons from '@/components/server/console/PowerButtons';
import UsageMetrics from '@/components/server/analytics/UsageMetrics';
import { SocketEvent, SocketRequest } from '@/components/server/events';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import * as Icon from 'react-feather';

import GlassCard from '@/components/elements/GlassCard';

type Stats = Record<'memory' | 'cpu' | 'disk' | 'uptime', number>;

const AnalyticsCard = styled(GlassCard)`
    ${tw`p-6 h-full`};
`;

const UsageItem = styled.div`
    ${tw`flex items-center gap-4 p-4 rounded-lg bg-neutral-800/30 border border-neutral-700/50 mb-3 transition-all hover:bg-neutral-800/50 hover:border-blue-500/30`};
`;

const StatIcon = styled.div<{ color: string }>`
    ${tw`p-2.5 rounded-xl bg-opacity-10 flex items-center justify-center`};
    background-color: ${(props) => props.color}1a;
    color: ${(props) => props.color};
`;

const ProgressBar = styled.div<{ progress: number; color: string }>`
    ${tw`h-1.5 w-full bg-neutral-800 rounded-full mt-2 overflow-hidden relative`};
    &::after {
        content: '';
        ${tw`absolute left-0 top-0 h-full rounded-full transition-all duration-1000`};
        width: ${(props) => Math.min(props.progress, 100)}%;
        background-color: ${(props) => props.color};
        box-shadow: 0 0 10px ${(props) => props.color}80;
    }
`;

export default () => {
    const [messages, setMessages] = useState<Message[]>();
    const [stats, setStats] = useState<Stats>({ memory: 0, cpu: 0, disk: 0, uptime: 0 });

    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const instance = ServerContext.useStoreState((state) => state.socket.instance);
    const connected = ServerContext.useStoreState((state) => state.socket.connected);
    const limits = ServerContext.useStoreState((state) => state.server.data!.limits);

    const cpuUsed = parseFloat(((stats.cpu / limits.cpu) * 100).toFixed(2));
    const diskUsed = parseFloat(((stats.disk / 1024 / 1024 / limits.disk) * 100).toFixed(2));
    const memoryUsed = parseFloat(((stats.memory / 1024 / 1024 / limits.memory) * 100).toFixed(2));

    const statsListener = (data: string) => {
        let stats: any = {};
        try {
            stats = JSON.parse(data);
        } catch (e) {
            return;
        }
        setStats({
            memory: stats.memory_bytes,
            cpu: stats.cpu_absolute,
            disk: stats.disk_bytes,
            uptime: stats.uptime || 0,
        });
    };

    useEffect(() => {
        getMessages(uuid).then(setMessages);
        if (!connected || !instance) return;
        instance.addListener(SocketEvent.STATS, statsListener);
        instance.send(SocketRequest.SEND_STATS);
        return () => {
            instance.removeListener(SocketEvent.STATS, statsListener);
        };
    }, [instance, connected]);

    return (
        <ServerContentBlock title={'Analytics'}>
            <div className={'grid grid-cols-1 lg:grid-cols-3 gap-6'}>
                <div className={'lg:col-span-2 space-y-6'}>
                    <AnalyticsCard>
                        <div css={tw`flex items-center gap-3 mb-6`}>
                            <div css={tw`p-2 rounded-lg bg-blue-500/10 text-blue-400`}>
                                <Icon.Activity size={18} />
                            </div>
                            <h3 css={tw`text-sm font-black text-neutral-100 uppercase tracking-widest`}>
                                Resource History
                            </h3>
                        </div>
                        <UsageMetrics />
                        <div css={tw`mt-6`}>
                            <StatGraphs />
                        </div>
                    </AnalyticsCard>
                </div>

                <div className={'space-y-6'}>
                    <AnalyticsCard>
                        <div css={tw`flex items-center justify-between mb-8`}>
                            <div css={tw`flex items-center gap-3`}>
                                <div css={tw`p-2 rounded-lg bg-blue-500/10 text-blue-400`}>
                                    <Icon.PieChart size={18} />
                                </div>
                                <h3 css={tw`text-sm font-black text-neutral-100 uppercase tracking-widest`}>
                                    Current Usage
                                </h3>
                            </div>
                        </div>

                        <div className={'space-y-4'}>
                            <UsageItem>
                                <StatIcon color={'#3b82f6'}>
                                    <Icon.Cpu size={20} />
                                </StatIcon>
                                <div className={'flex-1'}>
                                    <div className={'flex items-center justify-between'}>
                                        <p className={'text-xs font-black text-neutral-400 uppercase tracking-widest'}>
                                            PROCESSOR LOAD
                                        </p>
                                        <p className={'text-sm font-black text-blue-400'}>{cpuUsed}%</p>
                                    </div>
                                    <ProgressBar progress={cpuUsed} color={'#3b82f6'} />
                                </div>
                            </UsageItem>

                            <UsageItem>
                                <StatIcon color={'#a855f7'}>
                                    <Icon.Database size={20} />
                                </StatIcon>
                                <div className={'flex-1'}>
                                    <div className={'flex items-center justify-between'}>
                                        <p className={'text-xs font-black text-neutral-400 uppercase tracking-widest'}>
                                            MEMORY USAGE
                                        </p>
                                        <p className={'text-sm font-black text-purple-400'}>{memoryUsed}%</p>
                                    </div>
                                    <ProgressBar progress={memoryUsed} color={'#a855f7'} />
                                </div>
                            </UsageItem>

                            <UsageItem>
                                <StatIcon color={'#ef4444'}>
                                    <Icon.HardDrive size={20} />
                                </StatIcon>
                                <div className={'flex-1'}>
                                    <div className={'flex items-center justify-between'}>
                                        <p className={'text-xs font-black text-neutral-400 uppercase tracking-widest'}>
                                            STORAGE SPACE
                                        </p>
                                        <p className={'text-sm font-black text-red-500'}>{diskUsed}%</p>
                                    </div>
                                    <ProgressBar progress={diskUsed} color={'#ef4444'} />
                                </div>
                            </UsageItem>
                        </div>

                        <Can action={['control.start', 'control.stop', 'control.restart']} matchAny>
                            <div css={tw`mt-8 pt-6 border-t border-neutral-700/50`}>
                                <PowerButtons />
                            </div>
                        </Can>
                    </AnalyticsCard>

                    <AnalyticsCard>
                        <div css={tw`flex items-center gap-3 mb-6`}>
                            <div css={tw`p-2 rounded-lg bg-blue-500/10 text-blue-400`}>
                                <Icon.Info size={18} />
                            </div>
                            <h3 css={tw`text-sm font-black text-neutral-100 uppercase tracking-widest`}>
                                Performance Logs
                            </h3>
                        </div>
                        <div className={'space-y-3'}>
                            {!messages || messages.length < 1 ? (
                                <div
                                    className={
                                        'p-8 text-center bg-neutral-800/20 rounded-lg border border-neutral-700/30'
                                    }
                                >
                                    <Icon.Inbox size={32} css={tw`mx-auto mb-2 opacity-10 text-neutral-100`} />
                                    <p className={'text-xs font-bold text-neutral-500 uppercase tracking-widest'}>
                                        No logs available
                                    </p>
                                </div>
                            ) : (
                                messages.slice(0, 5).map((message) => (
                                    <div
                                        key={message.id}
                                        className={'p-3 rounded-lg bg-neutral-800/30 border border-neutral-700/50'}
                                    >
                                        <div className={'flex items-center justify-between mb-1'}>
                                            <p
                                                className={
                                                    'text-[10px] font-black uppercase tracking-wider text-blue-400'
                                                }
                                            >
                                                {message.title}
                                            </p>
                                            <span className={'text-[8px] font-bold text-neutral-500 uppercase'}>
                                                {message.createdAt}
                                            </span>
                                        </div>
                                        <p className={'text-[10px] text-neutral-400 leading-tight'}>
                                            {message.content}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </AnalyticsCard>
                </div>
            </div>
        </ServerContentBlock>
    );
};
