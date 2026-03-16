import tw from 'twin.macro';
import { Form } from 'formik';
import { breakpoint } from '@/theme';
import React, { forwardRef } from 'react';
import styled from 'styled-components/macro';
import FlashMessageRender from '@/components/FlashMessageRender';
import GlassCard from '@/components/elements/GlassCard';

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
    bg?: string;
};

const Container = styled.div`
    ${breakpoint('sm')`
        ${tw`w-4/5 mx-auto`}
    `};

    ${breakpoint('md')`
        ${tw`p-10`}
    `};

    ${breakpoint('lg')`
        ${tw`w-3/5`}
    `};

    ${breakpoint('xl')`
        ${tw`w-full`}
        max-width: 700px;
    `};
`;

export default forwardRef<HTMLFormElement, Props>(({ title, bg, ...props }, ref) => (
    <Container className={'relative'}>
        <div css={tw`fixed inset-0 z-0 pointer-events-none overflow-hidden`}>
            <div css={tw`absolute top-0 left-0 w-1/3 h-1/3 bg-blue-500 bg-opacity-10 blur-3xl rounded-full`} />
            <div css={tw`absolute bottom-0 right-0 w-1/3 h-1/3 bg-purple-500 bg-opacity-10 blur-3xl rounded-full`} />
        </div>

        {title && (
            <h2 css={tw`text-4xl text-center text-neutral-100 font-black uppercase tracking-tighter py-8`}>{title}</h2>
        )}
        <FlashMessageRender css={tw`mb-4 px-1`} />
        <Form {...props} ref={ref} css={tw`relative z-10`}>
            <GlassCard $bg={bg} className={'group'} css={tw`w-full p-10`}>
                <div css={tw`flex-1`}>{props.children}</div>
            </GlassCard>
        </Form>
        <div
            css={tw`mt-8 flex flex-col sm:flex-row justify-between items-center text-xs font-black uppercase tracking-wider text-neutral-500 gap-4`}
        >
            <p>
                &copy;{' '}
                <a href={'https://host.trexz.xyz'} css={tw`text-blue-400 hover:text-blue-300 transition-colors`}>
                    Trexzactyl
                </a>
                &nbsp;&bull;&nbsp;
                <a href={'https://github.com/ryanwtf88'} css={tw`hover:text-neutral-400 transition-colors`}>
                    Designed by RY4N
                </a>
            </p>
            <div css={tw`flex gap-4`}>
                <a href={'https://host.trexz.xyz'} css={tw`hover:text-neutral-400 transition-colors`}>
                    {' '}
                    Site{' '}
                </a>
                <span css={tw`opacity-30`}>&bull;</span>
                <a href={'https://github.com/Trexzactyl/Trexzactyl'} css={tw`hover:text-neutral-400 transition-colors`}>
                    {' '}
                    GitHub{' '}
                </a>
            </div>
        </div>
    </Container>
));
