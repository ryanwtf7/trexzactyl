import React from 'react';
import tw from 'twin.macro';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
    icon: IconProp;
    iconCss?: string;
    children: React.ReactChild[] | React.ReactChild;
}

export default ({ children, icon, iconCss }: Props) => (
    <div
        className={'group'}
        css={tw`bg-neutral-900 bg-opacity-40 backdrop-blur-xl border border-neutral-700 p-4 rounded-sm flex items-center justify-between shadow-lg transition-all duration-300 hover:bg-neutral-900 bg-opacity-60 hover:border-blue-500 border-opacity-30 hover:shadow-lg hover:-translate-y-0.5`}
    >
        <div css={tw`flex items-center overflow-hidden w-full`}>
            <div
                css={tw`bg-blue-600 bg-opacity-10 p-2.5 rounded-sm mr-4 flex items-center justify-center transition-colors duration-300 group-hover:bg-blue-600 bg-opacity-20`}
            >
                <FontAwesomeIcon icon={icon} className={'text-blue-400 ' + iconCss} />
            </div>
            <div css={tw`text-sm tracking-tight text-neutral-300 font-medium truncate w-full`}>{children}</div>
        </div>
    </div>
);
