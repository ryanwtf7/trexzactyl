import tw from 'twin.macro';
import { Button } from '@/components/elements/button';
import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components/macro';
import { motion } from 'framer-motion';

const PremiumPurchaseBoxContainer = styled.div`
    ${tw`relative flex flex-col p-8 rounded-sm border border-neutral-700 bg-neutral-900 bg-opacity-40 backdrop-blur-xl transition-all duration-300 overflow-hidden text-center`};
    ${tw`hover:border-blue-500 border-opacity-50 hover:shadow-2xl`};

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%);
        opacity: 0.5;
        z-index: -1;
    }
`;

const PremiumPurchaseBox = motion(PremiumPurchaseBoxContainer);

const IconWrapper = styled.div`
    ${tw`w-16 h-16 rounded-sm flex items-center justify-center mx-auto mb-6 transition-all duration-500`};
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
    border: 1px solid rgba(59, 130, 246, 0.2);
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.1);

    .group:hover & {
        transform: scale(1.1) rotate(5deg);
        background: rgba(59, 130, 246, 0.2);
        color: #60a5fa;
        box-shadow: 0 0 30px rgba(59, 130, 246, 0.2);
    }
`;

const CostBadge = styled.div`
    ${tw`inline-flex flex-col items-center justify-center p-4 rounded-sm bg-black/40 border border-neutral-700 mb-8 w-full`};

    .label {
        ${tw`text-xs font-bold text-neutral-500 mb-1`};
    }

    .value {
        ${tw`text-2xl font-black text-white tracking-tight`};
        & span {
            ${tw`text-xs text-neutral-500 font-medium ml-1 tracking-normal`};
        }
    }
`;

interface BoxProps {
    type: string;
    icon: React.ReactElement;
    amount: number;
    suffix?: string;
    description: string;
    cost: number;

    setOpen: Dispatch<SetStateAction<boolean>>;
    setResource: Dispatch<SetStateAction<string>>;
}

export default (props: BoxProps) => (
    <PremiumPurchaseBox className={'group'} whileHover={{ translateY: -8 }}>
        <IconWrapper>
            {React.cloneElement(props.icon as React.ReactElement, { size: 32, strokeWidth: 2.5 })}
        </IconWrapper>

        <h2 css={tw`text-2xl font-bold text-white mb-3`}>{props.type}</h2>

        <p css={tw`text-xs text-neutral-400 font-bold leading-relaxed mb-8 h-10 overflow-hidden px-2`}>
            {props.description}
        </p>

        <CostBadge>
            <span className='label'>
                Cost per {props.amount}
                {props.suffix}
            </span>
            <div className='value'>
                {props.cost} <span>Credits</span>
            </div>
        </CostBadge>

        <Button
            css={tw`w-full bg-blue-600 font-bold text-xs py-4 rounded-sm transition-all shadow-lg hover:shadow-xl active:scale-95`}
            onClick={() => {
                props.setOpen(true);
                props.setResource(props.type.toLowerCase());
            }}
        >
            Buy +{props.amount}
            {props.suffix}
        </Button>
    </PremiumPurchaseBox>
);
