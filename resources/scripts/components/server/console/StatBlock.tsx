import React from 'react';
import useFitText from 'use-fit-text';
import Icon from '@/components/elements/Icon';
import CopyOnClick from '@/components/elements/CopyOnClick';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components/macro';
import tw from 'twin.macro';

interface Props {
    title?: string | undefined;
    copyOnClick?: string;
    icon: IconDefinition;
    children: React.ReactNode;
    className?: string;
}

const StatCard = styled.div`
    ${tw`relative flex flex-col p-4 rounded-sm border border-neutral-700 bg-neutral-900 bg-opacity-40 backdrop-blur-xl transition-all duration-300`};
    ${tw`hover:border-blue-500 border-opacity-50 hover:shadow-lg hover:-translate-y-0.5`};
`;

const _IconWrapper = styled.div`
    ${tw`absolute top-4 right-4 text-neutral-500 opacity-50`};
`;

export default ({ title, copyOnClick, icon, className, children }: Props) => {
    const { fontSize, ref } = useFitText({ minFontSize: 8, maxFontSize: 24 });

    return (
        <CopyOnClick text={copyOnClick}>
            <StatCard className={className}>
                <div className={'flex items-center justify-between w-full overflow-hidden'}>
                    <div className={'flex items-center gap-3'}>
                        <div className={'text-neutral-500'}>
                            <Icon icon={icon} />
                        </div>
                        {title && (
                            <p className={'text-xs text-neutral-400 font-bold uppercase tracking-wider'}>{title}</p>
                        )}
                    </div>
                    <div
                        ref={ref}
                        className={'font-black text-neutral-100 whitespace-nowrap'}
                        style={{ fontSize: (fontSize as any) > 14 ? fontSize : 14 }}
                    >
                        {children}
                    </div>
                </div>
            </StatCard>
        </CopyOnClick>
    );
};
