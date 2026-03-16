import tw from 'twin.macro';
import React, { useEffect } from 'react';
import { useStoreState } from '@/state/hooks';
import { Alert } from '@/components/elements/alert';
import { CSSTransition } from 'react-transition-group';
import FlashMessageRender from '@/components/FlashMessageRender';
import ContentContainer from '@/components/elements/ContentContainer';

export interface PageContentBlockProps {
    title?: string;
    description?: string | null;
    className?: string;
    showFlashKey?: string;
    children?: React.ReactNode;
}

const PageContentBlock: React.FC<PageContentBlockProps> = ({
    title,
    description,
    showFlashKey,
    className,
    children,
}) => {
    const alert = useStoreState((state) => state.settings.data!.alert);
    const nodeRef = React.useRef(null);

    useEffect(() => {
        if (title) {
            document.title = title;
        }
    }, [title]);

    return (
        <CSSTransition timeout={150} classNames={'fade'} appear in nodeRef={nodeRef}>
            <div css={tw`my-4 md:mt-10`} ref={nodeRef}>
                <ContentContainer className={className}>
                    {alert.message && (
                        <Alert type={alert.type} className={'my-4'}>
                            {alert.message}
                        </Alert>
                    )}
                    {showFlashKey && <FlashMessageRender byKey={showFlashKey} css={tw`mb-4 mt-7 md:mt-4`} />}
                    {description && (
                        <div className={'my-10 j-left'}>
                            <h1 className={'text-5xl'}>{title}</h1>
                            <h3 className={'text-2xl text-neutral-500'}>{description}</h3>
                        </div>
                    )}
                    {children}
                </ContentContainer>
                <ContentContainer css={tw`text-sm text-center my-4 pb-8`}>
                    <p css={tw`text-neutral-500 sm:float-left`}>
                        &copy; <a href={'https://host.trexz.xyz'}>Trexzactyl</a>
                        &nbsp;&bull;&nbsp;
                        <a href={'https://github.com/ryanwtf88'}>Designed by RY4N</a>
                    </p>
                    <p css={tw`text-neutral-500 sm:float-right`}>
                        <a href={'https://host.trexz.xyz'}> Site </a>
                        &bull;
                        <a href={'https://github.com/Trexzactyl/Trexzactyl'}> GitHub </a>
                    </p>
                </ContentContainer>
            </div>
        </CSSTransition>
    );
};

export default PageContentBlock;
