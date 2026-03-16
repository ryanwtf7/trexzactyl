import React from 'react';
import useSWR from 'swr';
import tw from 'twin.macro';
import { useStoreState } from 'easy-peasy';
import { getResources } from '@/api/store/getResources';
import getLatestActivity from '@/api/account/getLatestActivity';
import { CreditCard, Activity, TrendingUp, AlertTriangle, CheckCircle } from 'react-feather';

const StatItem = ({
    icon: Icon,
    title,
    value,
    color,
    isLast = false,
}: {
    icon: any;
    title: string;
    value: string | number;
    color: string;
    isLast?: boolean;
}) => (
    <div
        css={[tw`flex items-center space-x-3 px-4 py-2`, !isLast && tw`border-r border-neutral-700 border-opacity-50`]}
    >
        <div
            css={[
                tw`p-2 rounded-sm flex items-center justify-center`,
                color === 'blue' && tw`bg-blue-500 bg-opacity-10 text-blue-400`,
                color === 'green' && tw`bg-green-500 bg-opacity-10 text-green-400`,
                color === 'purple' && tw`bg-purple-500 bg-opacity-10 text-purple-400`,
                color === 'orange' && tw`bg-orange-500 bg-opacity-10 text-orange-400`,
            ]}
        >
            <Icon size={16} />
        </div>
        <div css={tw`min-w-0`}>
            <p css={tw`text-xs font-bold uppercase tracking-wider text-neutral-500 leading-none`}>{title}</p>
            <p css={tw`text-sm font-black text-neutral-100 mt-0.5 truncate`}>{value}</p>
        </div>
    </div>
);

export default () => {
    const { data: resources } = useSWR('store:resources', () => getResources());
    const { data: latestActivity } = useSWR('account:activity:latest', () => getLatestActivity());
    const earnRate = useStoreState((state) => state.storefront.data?.earn.amount);
    const useTotp = useStoreState((state) => state.user.data?.useTotp);

    const earningText = earnRate ? `${earnRate}/min` : 'Disabled';
    const securityStatus = useTotp ? 'High' : 'Weak';
    const activityText = latestActivity?.event.replace(':', ' ') || 'No activity';

    return (
        <div css={tw`hidden md:block mb-6`}>
            <div
                css={[
                    tw`flex overflow-x-auto items-center`,
                    tw`bg-neutral-900 bg-opacity-40 backdrop-blur-xl border border-neutral-700 rounded-sm`,
                ]}
            >
                <div css={tw`flex-none flex items-center min-w-full sm:min-w-0`}>
                    <StatItem icon={TrendingUp} title='Earning' value={earningText} color='green' />
                    <StatItem icon={CreditCard} title='Credits' value={resources?.balance || 0} color='blue' />
                    <StatItem
                        icon={useTotp ? CheckCircle : AlertTriangle}
                        title='Security'
                        value={securityStatus}
                        color={useTotp ? 'purple' : 'orange'}
                    />
                    <StatItem icon={Activity} title='Latest' value={activityText} color='blue' isLast />
                </div>
            </div>
        </div>
    );
};
