import classNames from 'classnames';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import Icon from '@/components/elements/Icon';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface Props {
    className?: string;
    icon?: IconDefinition;
    children: React.ReactNode;
    title: string | React.ReactNode;
}

const TitledGreyBox = ({ icon, title, children, className }: Props) => (
    <div
        className={classNames(
            'shadow-2xl bg-neutral-900 bg-opacity-40 backdrop-blur-xl rounded-sm border border-neutral-700',
            className
        )}
    >
        <div className={'bg-neutral-800 bg-opacity-50 p-3 border-b border-neutral-700 border-opacity-50'}>
            <p className={'font-semibold font-sans line-clamp-1 text-lg'}>
                {icon && <Icon icon={icon} className={'w-4 h-4 mr-2 mb-1'} />}
                {title}
            </p>
        </div>
        <div className={'p-3'}>{children}</div>
    </div>
);

export default memo(TitledGreyBox, isEqual);
