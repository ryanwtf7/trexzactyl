import tw from 'twin.macro';
import * as Icon from 'react-feather';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { Server } from '@/api/server/getServer';
import Spinner from '@/components/elements/Spinner';
import { bytesToString, ip } from '@/lib/formatters';
import React, { useEffect, useRef, useState } from 'react';
import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';
import { motion } from 'framer-motion';

const isAlarmState = (current: number, limit: number): boolean => limit > 0 && current / (limit * 1024 * 1024) >= 0.9;

const ServerCardContainer = styled.div<{ $bg?: string }>`
    ${tw`relative flex flex-col px-4 py-1.5 sm:py-2.5 rounded-sm border border-neutral-700 bg-neutral-900 bg-opacity-40 backdrop-blur-xl transition-all duration-300 overflow-hidden`};
    ${tw`hover:border-blue-500 border-opacity-50 hover:shadow-2xl`};

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        ${({ $bg }) =>
            $bg
                ? `background-image: url("${$bg}");`
                : 'background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%);'}
        background-position: center;
        background-size: cover;
        opacity: 0.2;
        z-index: -1;
        transition: opacity 0.3s ease;
    }

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    &:hover::after {
        opacity: 1;
    }

    &:hover::before {
        opacity: 0.35;
    }
`;

const ServerCardMotion = motion(ServerCardContainer);

const StatusIndicator = styled.div<{ $status: ServerPowerState | undefined }>`
    ${tw`flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-bold tracking-wide border transition-all duration-300`};
    ${({ $status }) =>
        !$status || $status === 'offline'
            ? `background-color: rgba(239, 68, 68, 0.1); color: rgb(248, 113, 113); border-color: rgba(239, 68, 68, 0.2);`
            : $status === 'running'
            ? `background-color: rgba(34, 197, 94, 0.1); color: rgb(74, 222, 128); border-color: rgba(34, 197, 94, 0.2);`
            : `background-color: rgba(234, 179, 8, 0.1); color: rgb(250, 204, 21); border-color: rgba(234, 179, 8, 0.2);`};

    & .dot {
        ${tw`w-1.5 h-1.5 rounded-full`};
        ${({ $status }) =>
            !$status || $status === 'offline'
                ? tw`bg-red-500`
                : $status === 'running'
                ? tw`bg-green-500 animate-pulse`
                : tw`bg-yellow-500 animate-pulse`};
    }
`;

const ResourceSection = styled.div`
    ${tw`grid grid-cols-3 gap-2 mt-4`};
`;

const ProgressBar = styled.div<{ $percent: number; $alarm?: boolean }>`
    ${tw`h-0.5 w-full bg-neutral-800 bg-opacity-50 rounded-sm mt-3 overflow-hidden transition-all duration-300`};
    & .fill {
        width: ${({ $percent }) => $percent}%;
        ${tw`h-full transition-all duration-700 ease-in-out`};
        ${({ $alarm }) =>
            $alarm
                ? `background: linear-gradient(90deg, #ef4444, #f87171);`
                : `background: linear-gradient(90deg, #3b82f6, #60a5fa);`};
        box-shadow: 0 0 8px ${({ $alarm }) => ($alarm ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)')};
    }
`;

const Label = styled.div`
    ${tw`text-xs text-neutral-500 font-bold tracking-wide flex items-center gap-1.5 mb-1`};
`;

const Value = styled.div<{ $alarm?: boolean }>`
    ${tw`text-sm font-black transition-colors duration-300`};
    ${({ $alarm }) => ($alarm ? tw`text-red-400` : tw`text-neutral-100`)};
`;

type Timer = ReturnType<typeof setInterval>;

const ServerRow = ({ server, className }: { server: Server; className?: string }) => {
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
    const [stats, setStats] = useState<ServerStats | null>(null);

    const getStats = () =>
        getServerResourceUsage(server.uuid)
            .then((data) => setStats(data))
            .catch((error) => console.error(error));

    useEffect(() => {
        setIsSuspended(stats?.isSuspended || server.status === 'suspended');
    }, [stats?.isSuspended, server.status]);

    useEffect(() => {
        if (isSuspended) return;
        getStats().then(() => {
            interval.current = setInterval(() => getStats(), 30000);
        });
        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [isSuspended]);

    const alarms = { cpu: false, memory: false, disk: false };
    if (stats) {
        alarms.cpu = server.limits.cpu === 0 ? false : stats.cpuUsagePercent >= server.limits.cpu * 0.9;
        alarms.memory = isAlarmState(stats.memoryUsageInBytes, server.limits.memory);
    }

    const cpuPercent = stats ? Math.min((stats.cpuUsagePercent / (server.limits.cpu || 100)) * 100, 100) : 0;
    const memPercent = stats
        ? Math.min((stats.memoryUsageInBytes / (server.limits.memory * 1024 * 1024)) * 100, 100)
        : 0;

    return (
        <Link to={`/server/${server.uuid}`} className={`${className || ''} group`} css={tw`block mb-4 md:mb-0 lg:mx-1`}>
            <ServerCardMotion
                $bg={server.bg}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                <div css={tw`flex justify-between items-start mb-2`}>
                    <div css={tw`flex-1 min-w-0 pr-4`}>
                        <h4
                            css={tw`text-xl font-black text-white truncate group-hover:text-blue-400 transition-colors tracking-tight`}
                        >
                            {server.name}
                        </h4>
                        <div css={tw`flex items-center gap-1.5 text-neutral-500 text-xs font-bold mt-1.5`}>
                            <Icon.MapPin size={10} className='text-blue-500' />
                            <span css={tw`truncate`}>
                                {server.allocations
                                    .filter((alloc) => alloc.isDefault)
                                    .map((allocation) => (
                                        <React.Fragment key={allocation.ip + allocation.port.toString()}>
                                            {allocation.alias || ip(allocation.ip)}:{allocation.port}
                                        </React.Fragment>
                                    ))}
                            </span>
                        </div>
                    </div>

                    <StatusIndicator $status={stats?.status}>
                        <div className='dot' />
                        {isSuspended ? 'Suspended' : stats?.status || server.status || 'Offline'}
                    </StatusIndicator>
                </div>

                <div css={tw`flex-1 h-16`}>
                    {!stats && !isSuspended && !server.isTransferring && server.status !== 'installing' ? (
                        <div css={tw`flex items-center justify-center h-full pt-4`}>
                            <Spinner size={'small'} />
                        </div>
                    ) : (
                        <ResourceSection>
                            <div>
                                <Label>
                                    <Icon.Cpu size={10} className='text-blue-400' /> CPU
                                </Label>
                                <Value $alarm={alarms.cpu}>
                                    {isSuspended ? '0%' : `${stats?.cpuUsagePercent.toFixed(1)}%`}
                                </Value>
                                <ProgressBar $percent={isSuspended ? 0 : cpuPercent} $alarm={alarms.cpu}>
                                    <div className='fill' />
                                </ProgressBar>
                            </div>
                            <div>
                                <Label>
                                    <Icon.Activity size={10} className='text-purple-400' /> RAM
                                </Label>
                                <Value $alarm={alarms.memory}>
                                    {isSuspended ? '0 B' : bytesToString(stats?.memoryUsageInBytes || 0)}
                                </Value>
                                <ProgressBar $percent={isSuspended ? 0 : memPercent} $alarm={alarms.memory}>
                                    <div className='fill' />
                                </ProgressBar>
                            </div>
                            <div>
                                <Label>
                                    <Icon.Database size={10} className='text-cyan-400' /> DISK
                                </Label>
                                <Value>{bytesToString(stats?.diskUsageInBytes || 0)}</Value>
                                <ProgressBar
                                    $percent={
                                        stats
                                            ? Math.min(
                                                  (stats.diskUsageInBytes / (server.limits.disk * 1024 * 1024 || 1)) *
                                                      100,
                                                  100
                                              )
                                            : 0
                                    }
                                >
                                    <div className='fill' />
                                </ProgressBar>
                            </div>
                        </ResourceSection>
                    )}
                </div>
            </ServerCardMotion>
        </Link>
    );
};

export default ServerRow;
