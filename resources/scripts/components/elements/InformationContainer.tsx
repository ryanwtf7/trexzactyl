import useFlash from '@/plugins/useFlash';
import tw from 'twin.macro';
import apiVerify from '@/api/account/verify';
import { useStoreState } from '@/state/hooks';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { getResources } from '@/api/store/getResources';
import Translate from '@/components/elements/Translate';
import getLatestActivity, { Activity } from '@/api/account/getLatestActivity';
import { wrapProperties } from '@/components/elements/activity/ActivityLogEntry';
import * as Icon from 'react-feather';
import { motion } from 'framer-motion';

const PremiumCardContainer = styled.div<{ $color: string }>`
    ${tw`relative p-6 rounded-2xl border border-neutral-700 bg-neutral-900 bg-opacity-50 backdrop-blur-md overflow-hidden transition-all duration-300`};

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: ${({ $color }) => $color};
        opacity: 0.6;
    }

    &::after {
        content: '';
        position: absolute;
        bottom: -20px;
        right: -20px;
        width: 80px;
        height: 80px;
        background: ${({ $color }) => $color};
        opacity: 0.1;
        filter: blur(30px);
        border-radius: 100%;
    }

    &:hover {
        ${tw`border-neutral-500 shadow-xl`};
    }
`;

const PremiumCard = motion(PremiumCardContainer);

const IconWrapper = styled.div<{ $color: string }>`
    ${tw`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-300`};
    background: ${({ $color }) => `${$color}15`};
    color: ${({ $color }) => $color};
    border: 1px solid ${({ $color }) => `${$color}20`};
`;

export default () => {
    const { addFlash } = useFlash();
    const [bal, setBal] = useState(0);
    const [activity, setActivity] = useState<Activity>();
    const properties = wrapProperties(activity?.properties);
    const user = useStoreState((state) => state.user.data);
    const store = useStoreState((state) => state.storefront.data);

    useEffect(() => {
        getResources().then((d) => setBal(d.balance));
        getLatestActivity().then((d) => setActivity(d));
    }, []);

    const verify = () => {
        apiVerify().then((data) => {
            if (data.success)
                addFlash({ type: 'info', key: 'dashboard', message: 'Verification email has been resent.' });
        });
    };

    if (!store || !user) return null;

    return (
        <div css={tw`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full`}>
            {store.earn.enabled ? (
                <PremiumCard
                    $color={'#4ade80'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ y: -4 }}
                >
                    <IconWrapper $color={'#4ade80'}>
                        <Icon.Circle size={18} className='animate-pulse' />
                    </IconWrapper>
                    <div css={tw`flex flex-col`}>
                        <span css={tw`text-xs uppercase font-bold tracking-wider text-neutral-500 mb-1`}>
                            Earning Rate
                        </span>
                        <div css={tw`flex items-baseline`}>
                            <span css={tw`text-2xl font-black text-white mr-1.5`}>{store.earn.amount}</span>
                            <span css={tw`text-neutral-400 text-xs font-bold uppercase`}>CR / MIN</span>
                        </div>
                    </div>
                </PremiumCard>
            ) : (
                <PremiumCard
                    $color={'#f87171'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ y: -4 }}
                >
                    <IconWrapper $color={'#f87171'}>
                        <Icon.AlertCircle size={18} />
                    </IconWrapper>
                    <div css={tw`flex flex-col`}>
                        <span css={tw`text-xs uppercase font-bold tracking-wider text-neutral-500 mb-1`}>
                            Earning Status
                        </span>
                        <span css={tw`text-lg font-black text-red-400 uppercase`}>Disabled</span>
                    </div>
                </PremiumCard>
            )}

            <PremiumCard
                $color={'#fbbf24'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -4 }}
            >
                <IconWrapper $color={'#fbbf24'}>
                    <Icon.DollarSign size={18} />
                </IconWrapper>
                <div css={tw`flex flex-col`}>
                    <span css={tw`text-xs uppercase font-bold tracking-wider text-neutral-500 mb-1`}>
                        Available Credits
                    </span>
                    <div css={tw`flex items-baseline`}>
                        <span css={tw`text-2xl font-black text-white mr-1.5`}>{bal.toLocaleString()}</span>
                        <span css={tw`text-neutral-400 text-xs font-bold uppercase`}>Credits</span>
                    </div>
                </div>
            </PremiumCard>

            <PremiumCard
                $color={'#60a5fa'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ y: -4 }}
            >
                <IconWrapper $color={'#60a5fa'}>
                    <Icon.Lock size={18} />
                </IconWrapper>
                <div css={tw`flex flex-col`}>
                    <span css={tw`text-xs uppercase font-bold tracking-wider text-neutral-500 mb-1`}>
                        Account Security
                    </span>
                    {user.useTotp ? (
                        <span css={tw`text-lg font-black text-green-400 uppercase`}>2FA Active</span>
                    ) : (
                        <span css={tw`text-lg font-black text-yellow-400 uppercase`}>Enable 2FA</span>
                    )}
                </div>
            </PremiumCard>

            {!user.verified ? (
                <PremiumCard
                    $color={'#f43f5e'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ y: -4 }}
                >
                    <IconWrapper $color={'#f43f5e'}>
                        <Icon.XCircle size={18} />
                    </IconWrapper>
                    <div css={tw`flex flex-col`}>
                        <span css={tw`text-xs uppercase font-bold tracking-wider text-neutral-500 mb-1`}>
                            Account Status
                        </span>
                        <span
                            onClick={verify}
                            css={tw`cursor-pointer text-lg font-black text-red-400 hover:text-red-300 transition-colors uppercase`}
                        >
                            Verify Email
                        </span>
                    </div>
                </PremiumCard>
            ) : (
                <PremiumCard
                    $color={'#a78bfa'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ y: -4 }}
                >
                    <IconWrapper $color={'#a78bfa'}>
                        <Icon.FileText size={18} />
                    </IconWrapper>
                    <div css={tw`flex flex-col`}>
                        <span css={tw`text-xs uppercase font-bold tracking-wider text-neutral-500 mb-1`}>
                            Latest Activity
                        </span>
                        <div css={tw`truncate max-w-full text-sm font-bold text-neutral-200 uppercase`}>
                            {activity ? (
                                <Translate
                                    ns={'activity'}
                                    values={properties}
                                    i18nKey={activity.event.replace(':', '.')}
                                />
                            ) : (
                                'No logs recorded'
                            )}
                        </div>
                    </div>
                </PremiumCard>
            )}
        </div>
    );
};
