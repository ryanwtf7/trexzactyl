import useSWR from 'swr';
import tw from 'twin.macro';
import getServers from '@/api/getServers';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { PaginatedResult } from '@/api/http';
import { useLocation } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import Switch from '@/components/elements/Switch';
import React, { useEffect, useState } from 'react';
import Spinner from '@/components/elements/Spinner';
import ServerRow from '@/components/dashboard/ServerRow';
import Pagination from '@/components/elements/Pagination';
import { usePersistedState } from '@/plugins/usePersistedState';
import PageContentBlock from '@/components/elements/PageContentBlock';
import OverviewStats from '@/components/dashboard/OverviewStats';

export default () => {
    const { search } = useLocation();
    const defaultPage = Number(new URLSearchParams(search).get('page') || '1');

    const [page, setPage] = useState(!isNaN(defaultPage) && defaultPage > 0 ? defaultPage : 1);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const uuid = useStoreState((state) => state.user.data?.uuid);
    const username = useStoreState((state) => state.user.data?.username);
    const firstName = useStoreState((state) => state.user.data?.name_first);
    const rootAdmin = useStoreState((state) => state.user.data?.rootAdmin);
    const [showOnlyAdmin, setShowOnlyAdmin] = usePersistedState(`${uuid}:show_all_servers`, false);

    const { data: servers, error } = useSWR<PaginatedResult<Server>>(
        ['/api/client/servers', showOnlyAdmin && rootAdmin, page],
        () => getServers({ page, type: showOnlyAdmin && rootAdmin ? 'admin' : undefined })
    );

    useEffect(() => {
        if (!servers) return;
        if (servers.pagination.currentPage > 1 && !servers.items.length) {
            setPage(1);
        }
    }, [servers?.pagination.currentPage]);

    useEffect(() => {
        // Don't use react-router to handle changing this part of the URL, otherwise it
        // triggers a needless re-render. We just want to track this in the URL incase the
        // user refreshes the page.
        window.history.replaceState(null, document.title, `/${page <= 1 ? '' : `?page=${page}`}`);
    }, [page]);

    useEffect(() => {
        if (error) clearAndAddHttpError({ key: 'dashboard', error });
        if (!error) clearFlashes('dashboard');
    }, [error]);

    return (
        <PageContentBlock title={'Dashboard'} css={tw`-mt-5 md:mt-10`} showFlashKey={'dashboard'}>
            <OverviewStats />
            <div
                css={tw`mb-10 px-8 py-5 md:py-7 rounded-sm border border-neutral-700 bg-neutral-900 bg-opacity-40 backdrop-blur-xl flex justify-between items-center relative overflow-hidden mt-8 md:mt-0`}
            >
                <div css={tw`absolute top-0 right-0 w-32 h-32 bg-blue-500 bg-opacity-10 blur-3xl -mr-16 -mt-16`} />
                <div css={tw`absolute bottom-0 left-0 w-24 h-24 bg-purple-500 bg-opacity-10 blur-3xl -ml-12 -mb-12`} />

                {rootAdmin ? (
                    <>
                        <div css={tw`relative z-10`}>
                            <h1 className={'text-4xl font-black tracking-tight text-neutral-100 uppercase'}>
                                {showOnlyAdmin ? 'ADMIN OVERVIEW' : 'MY SERVERS'}
                            </h1>
                            <h3 className={'text-lg mt-1 text-neutral-400 font-medium'}>
                                {showOnlyAdmin
                                    ? 'Viewing all managed instances across the platform.'
                                    : 'Directly manage your active server instances.'}
                            </h3>
                        </div>
                        <div css={tw`relative z-10`}>
                            <Switch
                                name={'show_all_servers'}
                                defaultChecked={showOnlyAdmin}
                                onChange={() => setShowOnlyAdmin((s) => !s)}
                            />
                        </div>
                    </>
                ) : (
                    <div css={tw`relative z-10`}>
                        <h1 className={'text-4xl font-black tracking-tight text-neutral-100 uppercase'}>
                            Welcome back,{' '}
                            <span css={tw`text-blue-400 border-b-2 border-blue-500 border-opacity-30 pb-0.5`}>
                                {firstName || username}
                            </span>
                            !
                        </h1>
                        <h3 className={'text-lg mt-2 text-neutral-400 font-medium'}>
                            Your dashboard is ready. Select an instance below to start managing.
                        </h3>
                    </div>
                )}
            </div>
            {!servers ? (
                <Spinner centered size={'large'} />
            ) : (
                <Pagination data={servers} onPageSelect={setPage}>
                    {({ items }) =>
                        items.length > 0 ? (
                            <div className={'lg:grid lg:grid-cols-2 gap-1'}>
                                <>
                                    {items.map((server) => (
                                        <ServerRow
                                            key={server.uuid}
                                            server={server}
                                            className={'j-up'}
                                            css={tw`mt-7 md:mt-2`}
                                        />
                                    ))}
                                </>
                            </div>
                        ) : (
                            <p className={'text-gray-400 text-lg font-semibold text-center'}>
                                Doesn&apos;t look like you have any servers here.
                            </p>
                        )
                    }
                </Pagination>
            )}
        </PageContentBlock>
    );
};
