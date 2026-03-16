import tw from 'twin.macro';
import * as Icon from 'react-feather';
import styled from 'styled-components/macro';
import { megabytesToHuman } from '@/helpers';
import React, { useState, useEffect } from 'react';
import Spinner from '@/components/elements/Spinner';
import StoreContainer from '@/components/elements/StoreContainer';
import { getResources, Resources } from '@/api/store/getResources';
import { motion } from 'framer-motion';

const PremiumBoxContainer = styled.div<{ $color: string }>`
    ${tw`relative flex flex-col p-5 rounded-sm border border-neutral-700 bg-neutral-900 bg-opacity-40 backdrop-blur-xl transition-all duration-300 overflow-hidden`};
    ${tw`hover:border-blue-500 border-opacity-50 hover:shadow-2xl`};

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
        width: 60px;
        height: 60px;
        background: ${({ $color }) => $color};
        opacity: 0.05;
        filter: blur(25px);
        border-radius: 100%;
    }
`;

const PremiumBox = motion(PremiumBoxContainer);

const IconWrapper = styled.div<{ $color: string }>`
    ${tw`w-9 h-9 rounded-sm flex items-center justify-center mb-4 transition-all duration-300`};
    background: ${({ $color }) => `${$color}10`};
    color: ${({ $color }) => $color};
    border: 1px solid ${({ $color }) => `${$color}20`};
`;

const ResourceTitle = styled.h4`
    ${tw`text-xs font-black uppercase tracking-wider text-neutral-500 mb-1 leading-none`};
`;

const ResourceValue = styled.div`
    ${tw`flex items-baseline mt-1 flex-wrap`};
    & .amount {
        ${tw`text-xl sm:text-2xl font-black text-white tabular-nums tracking-tighter break-all`};
        word-break: break-word;
        max-width: 100%;
    }
    & .suffix {
        ${tw`text-xs text-neutral-500 font-black ml-1 uppercase whitespace-nowrap`};
    }
`;

interface BoxProps {
    title: string;
    icon: React.ReactElement;
    amount: number;
    toHuman?: boolean;
    suffix?: string;
    color: string;
    delay: number;
}

const ResourceCard = ({ title, icon, amount, toHuman, suffix, color, delay }: BoxProps) => (
    <PremiumBox
        $color={color}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.3 }}
        whileHover={{ translateY: -4 }}
    >
        <IconWrapper $color={color}>{React.cloneElement(icon, { size: 18, strokeWidth: 2.5 })}</IconWrapper>
        <ResourceTitle>{title}</ResourceTitle>
        <ResourceValue>
            <span className='amount'>{toHuman ? megabytesToHuman(amount) : amount.toLocaleString()}</span>
            {suffix && <span className='suffix'>{suffix}</span>}
        </ResourceValue>
    </PremiumBox>
);

export default () => {
    const [resources, setResources] = useState<Resources>();

    useEffect(() => {
        getResources().then((resources) => setResources(resources));
    }, []);

    if (!resources)
        return (
            <div css={tw`w-full flex justify-center py-10`}>
                <Spinner size={'large'} />
            </div>
        );

    return (
        <StoreContainer css={tw`grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4 w-full`}>
            <ResourceCard
                title={'Credits'}
                icon={<Icon.DollarSign />}
                amount={resources.balance}
                color={'#fbbf24'}
                delay={0.05}
            />
            <ResourceCard
                title={'CPU'}
                icon={<Icon.Cpu />}
                amount={resources.cpu}
                suffix={'%'}
                color={'#3b82f6'}
                delay={0.1}
            />
            <ResourceCard
                title={'Memory'}
                icon={<Icon.PieChart />}
                amount={resources.memory}
                toHuman
                color={'#a78bfa'}
                delay={0.15}
            />
            <ResourceCard
                title={'Disk'}
                icon={<Icon.HardDrive />}
                amount={resources.disk}
                toHuman
                color={'#22d3ee'}
                delay={0.2}
            />
            <ResourceCard
                title={'Slots'}
                icon={<Icon.Server />}
                amount={resources.slots}
                color={'#f472b6'}
                delay={0.25}
            />
            <ResourceCard
                title={'Ports'}
                icon={<Icon.Share2 />}
                amount={resources.ports}
                color={'#4ade80'}
                delay={0.3}
            />
            <ResourceCard
                title={'Backups'}
                icon={<Icon.Archive />}
                amount={resources.backups}
                color={'#fb923c'}
                delay={0.35}
            />
            <ResourceCard
                title={'Databases'}
                icon={<Icon.Database />}
                amount={resources.databases}
                color={'#94a3b8'}
                delay={0.4}
            />
        </StoreContainer>
    );
};
