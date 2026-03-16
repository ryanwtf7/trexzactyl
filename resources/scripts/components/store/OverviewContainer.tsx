import tw from 'twin.macro';
import React from 'react';
import { useStoreState } from 'easy-peasy';
import useWindowDimensions from '@/plugins/useWindowDimensions';
import ResourceBar from '@/components/elements/store/ResourceBar';
import StoreBanner from '@/components/elements/store/StoreBanner';
import PageContentBlock from '@/components/elements/PageContentBlock';

export default () => {
    const { width: _width } = useWindowDimensions();
    const username = useStoreState((state) => state.user.data!.username);

    return (
        <PageContentBlock title={'Storefront Overview'}>
            <div css={tw`flex flex-col lg:flex-row lg:items-end justify-between mt-10 mb-12 gap-8`}>
                <div css={tw`flex-1`}>
                    <h1 css={tw`text-4xl md:text-6xl font-black text-white mr-4`}>
                        Hey, <span css={tw`text-blue-500`}>{username}</span>!
                    </h1>
                    <h3 css={tw`text-lg md:text-2xl mt-2 text-neutral-500 font-bold`}>👋 Welcome to the store</h3>
                </div>
            </div>

            <div css={tw`mb-12`}>
                <ResourceBar />
            </div>
            <StoreBanner
                title={'Want to create a server?'}
                className={'bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20'}
                action={'Create'}
                link={'create'}
            />
            <StoreBanner
                title={'Need more resources?'}
                className={'bg-gradient-to-br from-green-600/20 via-transparent to-green-600/20'}
                action={'Buy Resources'}
                link={'resources'}
            />
            <StoreBanner
                title={'Run out of credits?'}
                className={'bg-gradient-to-br from-yellow-600/20 via-transparent to-orange-600/20'}
                action={'Buy Credits'}
                link={'credits'}
            />
        </PageContentBlock>
    );
};
