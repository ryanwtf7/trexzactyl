import React from 'react';
import tw from 'twin.macro';
import { breakpoint } from '@/theme';
import styled from 'styled-components/macro';
import { useStoreState } from '@/state/hooks';
import FlashMessageRender from '@/components/FlashMessageRender';
import GlassCard from '@/components/elements/GlassCard';

const Wrapper = styled.div`
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

const DiscordFormContainer = ({ children }: { children: React.ReactNode }) => {
    const name = useStoreState((state) => state.settings.data!.name);

    return (
        <Wrapper className={'relative'}>
            <div css={tw`fixed inset-0 z-0 pointer-events-none overflow-hidden`}>
                <div css={tw`absolute top-0 left-0 w-1/3 h-1/3 bg-blue-500 bg-opacity-10 blur-3xl rounded-full`} />
                <div
                    css={tw`absolute bottom-0 right-0 w-1/3 h-1/3 bg-purple-500 bg-opacity-10 blur-3xl rounded-full`}
                />
            </div>

            <h2 css={tw`text-4xl text-center text-neutral-100 font-black uppercase tracking-tighter py-8`}>
                Login to {name}
            </h2>
            <FlashMessageRender css={tw`mb-4 px-1`} />
            <GlassCard className={'group'} css={tw`w-full p-10 relative z-10`}>
                <div css={tw`flex flex-col md:flex-row items-center gap-10`}>
                    <div css={tw`flex-none select-none`}>
                        <img
                            src={'https://cdn.worldvectorlogo.com/logos/discord-6.svg'}
                            css={tw`block w-24 md:w-32 transition-transform duration-500 group-hover:scale-110`}
                            alt={'Discord'}
                        />
                    </div>
                    <div css={tw`flex-1 w-full`}>{children}</div>
                </div>
            </GlassCard>
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
                    <a
                        href={'https://github.com/Trexzactyl/Trexzactyl'}
                        css={tw`hover:text-neutral-400 transition-colors`}
                    >
                        {' '}
                        GitHub{' '}
                    </a>
                </div>
            </div>
        </Wrapper>
    );
};

export default DiscordFormContainer;
