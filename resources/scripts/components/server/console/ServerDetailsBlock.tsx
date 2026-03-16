import classNames from 'classnames';
import { ServerContext } from '@/state/server';
import React, { useEffect, useMemo, useState } from 'react';
import useWebsocketEvent from '@/plugins/useWebsocketEvent';
import ConsoleShareContainer from './ConsoleShareContainer';
import StatBlock from '@/components/server/console/StatBlock';
import UptimeDuration from '@/components/server/UptimeDuration';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import { SocketEvent, SocketRequest } from '@/components/server/events';
import { faClock, faHdd, faMemory, faMicrochip, faScroll, faWifi } from '@fortawesome/free-solid-svg-icons';
import { capitalize } from '@/lib/strings';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import RenewalInfo from './RenewalInfo';
import { useStoreState } from '@/state/hooks';

type Stats = Record<'memory' | 'cpu' | 'disk' | 'uptime', number>;

const LimitText = styled.span`
    ${tw`ml-1 text-neutral-500 text-xs font-bold tracking-wider`};
`;

const _ProgressBar = styled.div<{ $percent: number; $alarm?: boolean }>`
    ${tw`h-1 w-full bg-neutral-800 rounded-full mt-2 overflow-hidden`};
    & .fill {
        width: ${({ $percent }) => $percent}%;
        ${tw`h-full transition-all duration-500 ease-out`};
        ${({ $alarm }) => ($alarm ? tw`bg-red-500` : tw`bg-blue-500`)};
    }
`;

export default ({ className }: { className?: string }) => {
    const [stats, setStats] = useState<Stats>({ memory: 0, cpu: 0, disk: 0, uptime: 0 });

    const status = ServerContext.useStoreState((state) => state.status.value);
    const instance = ServerContext.useStoreState((state) => state.socket.instance);
    const connected = ServerContext.useStoreState((state) => state.socket.connected);
    const limits = ServerContext.useStoreState((state) => state.server.data!.limits);
    const renewable = ServerContext.useStoreState((state) => state.server.data!.renewable);
    const renewalEnabled = useStoreState((state) => state.storefront.data!.renewals);

    const textLimits = useMemo(
        () => ({
            cpu: limits?.cpu ? `${limits.cpu}%` : null,
            memory: limits?.memory ? bytesToString(mbToBytes(limits.memory)) : null,
            disk: limits?.disk ? bytesToString(mbToBytes(limits.disk)) : null,
        }),
        [limits]
    );

    const allocation = ServerContext.useStoreState((state) => {
        const match = state.server.data!.allocations.find((allocation) => allocation.isDefault);
        return !match ? 'n/a' : `${match.alias || ip(match.ip)}:${match.port}`;
    });

    useEffect(() => {
        if (!connected || !instance) return;
        instance.send(SocketRequest.SEND_STATS);
    }, [instance, connected]);

    useWebsocketEvent(SocketEvent.STATS, (data) => {
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
    });

    const _cpuUsed = stats.cpu / (limits.cpu || 100);
    const _diskUsed = (stats.disk / 1024 / 1024 / (limits.disk || 1)) * 100;
    const _memoryUsed = (stats.memory / 1024 / 1024 / (limits.memory || 1)) * 100;

    return (
        <div className={classNames('flex flex-col gap-2', className)}>
            <StatBlock icon={faClock} title={'Uptime'}>
                {status === null ? (
                    'Offline'
                ) : stats.uptime > 0 ? (
                    <UptimeDuration uptime={stats.uptime / 1000} />
                ) : (
                    capitalize(status)
                )}
            </StatBlock>

            <StatBlock icon={faWifi} title={'Address'} copyOnClick={allocation}>
                {allocation}
            </StatBlock>

            <StatBlock icon={faMicrochip} title={'CPU Usage'}>
                <div className={'flex items-center'}>
                    {status === 'offline' ? (
                        <span className={'text-neutral-500'}>Offline</span>
                    ) : (
                        <>
                            {stats.cpu.toFixed(2)}%<LimitText>/ {textLimits.cpu || '∞'}</LimitText>
                        </>
                    )}
                </div>
            </StatBlock>

            <StatBlock icon={faMemory} title={'Memory Usage'}>
                <div className={'flex items-center'}>
                    {status === 'offline' ? (
                        <span className={'text-neutral-500'}>Offline</span>
                    ) : (
                        <>
                            {bytesToString(stats.memory)}
                            <LimitText>/ {textLimits.memory || '∞'}</LimitText>
                        </>
                    )}
                </div>
            </StatBlock>

            <StatBlock icon={faHdd} title={'Disk Usage'}>
                <div className={'flex items-center'}>
                    {bytesToString(stats.disk)}
                    <LimitText>/ {textLimits.disk || '∞'}</LimitText>
                </div>
            </StatBlock>

            <StatBlock icon={faScroll} title={'Console Logs'}>
                <ConsoleShareContainer />
            </StatBlock>

            {renewable && renewalEnabled && (
                <StatBlock icon={faClock} title={'Renewal Info'}>
                    <RenewalInfo />
                </StatBlock>
            )}
        </div>
    );
};
