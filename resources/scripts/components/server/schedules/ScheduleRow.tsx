import React from 'react';
import tw from 'twin.macro';
import { format } from 'date-fns';
import * as Icon from 'react-feather';
import { Schedule } from '@/api/server/schedules/getServerSchedules';
import ScheduleCronRow from '@/components/server/schedules/ScheduleCronRow';
import styled from 'styled-components/macro';

const StatusBadge = styled.p<{ $active?: boolean; $processing?: boolean }>`
    ${tw`py-1 px-3 rounded-full text-xs uppercase font-bold tracking-wider`};
    ${({ $active, $processing }) =>
        $processing
            ? tw`bg-yellow-500 bg-opacity-10 text-yellow-400 border border-yellow-500 border-opacity-20`
            : $active
            ? tw`bg-green-500 bg-opacity-10 text-green-400 border border-green-500 border-opacity-20`
            : tw`bg-neutral-500 bg-opacity-10 text-neutral-400 border border-neutral-500 border-opacity-20`};
`;

export default ({ schedule }: { schedule: Schedule }) => (
    <>
        <div
            css={tw`hidden md:flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500 bg-opacity-10 text-blue-400`}
        >
            <Icon.Calendar size={20} />
        </div>
        <div css={tw`flex-1 md:ml-4`}>
            <p css={tw`font-bold text-neutral-100 group-hover:text-blue-400 transition-colors duration-200`}>
                {schedule.name}
            </p>
            <p css={tw`text-xs text-neutral-500 mt-1`}>
                Last run: {schedule.lastRunAt ? format(schedule.lastRunAt, "MMM do 'at' h:mma") : 'Never'}
            </p>
        </div>
        <div css={tw`flex items-center gap-4`}>
            <ScheduleCronRow cron={schedule.cron} css={tw`hidden sm:block text-xs font-mono text-neutral-400`} />
            <StatusBadge $active={schedule.isActive} $processing={schedule.isProcessing}>
                {schedule.isProcessing ? 'Processing' : schedule.isActive ? 'Active' : 'Inactive'}
            </StatusBadge>
        </div>
    </>
);
