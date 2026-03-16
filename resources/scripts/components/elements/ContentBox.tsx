import React from 'react';
import tw from 'twin.macro';
import FlashMessageRender from '@/components/FlashMessageRender';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';

type Props = Readonly<
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        title?: string;
        borderColor?: string;
        showFlashes?: string | boolean;
        showLoadingOverlay?: boolean;
        isLight?: boolean;
    }
>;

const ContentBox = ({
    title,
    borderColor,
    showFlashes,
    showLoadingOverlay,
    children,
    isLight: _isLight,
    ...props
}: Props) => (
    <div {...props}>
        {title && <h2 css={tw`text-sm font-bold text-neutral-300 mb-4 px-4`}>{title}</h2>}
        {showFlashes && (
            <FlashMessageRender byKey={typeof showFlashes === 'string' ? showFlashes : undefined} css={tw`mb-4`} />
        )}
        <div
            css={[
                tw`p-6 rounded-sm relative border border-neutral-700 bg-neutral-900 bg-opacity-40 backdrop-blur-xl`,
                !!borderColor && tw`border-t-4`,
            ]}
        >
            <SpinnerOverlay visible={showLoadingOverlay || false} />
            {children}
        </div>
    </div>
);

export default ContentBox;
