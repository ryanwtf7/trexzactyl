import React from 'react';
import tw from 'twin.macro';
import http from '@/api/http';
import * as Icon from 'react-feather';
import { useStoreState } from 'easy-peasy';
import styled from 'styled-components/macro';
import { NavLink, Link } from 'react-router-dom';
import ProgressBar from '@/components/elements/ProgressBar';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import SearchContainer from '@/components/dashboard/search/SearchContainer';

export default () => {
    const logo = useStoreState((state) => state.settings.data?.logo);
    const tickets = useStoreState((state) => state.settings.data!.tickets);
    const store = useStoreState((state) => state.storefront.data!.enabled);
    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);

    const onTriggerLogout = () => {
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };

    const PanelDiv = styled.div`
        ${tw`h-screen sticky bg-neutral-900 bg-opacity-40 backdrop-blur-xl flex flex-col w-24 fixed top-4 left-4 rounded-3xl border border-white/5 shadow-2xl overflow-hidden`};

        & > div {
            ${tw`mx-auto w-full flex flex-col items-center px-4`};

            & > a,
            & > div {
                ${tw`transition-all duration-300`};

                &:hover {
                    ${tw`text-blue-400`};
                }

                &:active,
                &.active {
                    ${tw`text-blue-500`};
                }
            }
        }
    `;

    return (
        <PanelDiv>
            <ProgressBar />
            <Link to={'/'}>
                <img className={'p-2'} src={logo ?? 'https://avatars.githubusercontent.com/u/91636558'} />
            </Link>
            <div css={tw`flex-1 w-full space-y-4 mt-8`}>
                <div className={'navigation-link'}>
                    <div
                        css={tw`bg-white/5 hover:bg-white/10 rounded-2xl p-3 transition-colors flex justify-center items-center`}
                    >
                        <SearchContainer size={24} />
                    </div>
                </div>
                <NavLink to={'/'} className={'navigation-link'} exact>
                    <Tooltip placement={'right'} content={'Servers'}>
                        <div
                            css={tw`bg-white/5 hover:bg-white/10 rounded-2xl p-3 transition-colors flex justify-center items-center`}
                        >
                            <Icon.Server size={24} />
                        </div>
                    </Tooltip>
                </NavLink>
                <NavLink to={'/account'} className={'navigation-link'}>
                    <Tooltip placement={'right'} content={'Account'}>
                        <div
                            css={tw`bg-white/5 hover:bg-white/10 rounded-2xl p-3 transition-colors flex justify-center items-center`}
                        >
                            <Icon.User size={24} />
                        </div>
                    </Tooltip>
                </NavLink>
                {store && (
                    <NavLink to={'/store'} className={'navigation-link'}>
                        <Tooltip placement={'right'} content={'Store'}>
                            <div
                                css={tw`bg-white/5 hover:bg-white/10 rounded-2xl p-3 transition-colors flex justify-center items-center`}
                            >
                                <Icon.ShoppingCart size={24} />
                            </div>
                        </Tooltip>
                    </NavLink>
                )}
                {tickets && (
                    <NavLink to={'/tickets'} className={'navigation-link'}>
                        <Tooltip placement={'right'} content={'Tickets'}>
                            <div
                                css={tw`bg-white/5 hover:bg-white/10 rounded-2xl p-3 transition-colors flex justify-center items-center`}
                            >
                                <Icon.HelpCircle size={24} />
                            </div>
                        </Tooltip>
                    </NavLink>
                )}
                {rootAdmin && (
                    <a href={'/admin'} className={'navigation-link'}>
                        <Tooltip placement={'right'} content={'Admin'}>
                            <div
                                css={tw`bg-white/5 hover:bg-white/10 rounded-2xl p-3 transition-colors flex justify-center items-center`}
                            >
                                <Icon.Settings size={24} />
                            </div>
                        </Tooltip>
                    </a>
                )}
            </div>

            <div css={tw`pb-6 w-full px-4`}>
                <button
                    onClick={onTriggerLogout}
                    css={tw`w-full flex justify-center items-center bg-red-500 bg-opacity-10 hover:bg-red-500 bg-opacity-20 text-red-400 p-3 rounded-2xl transition-all`}
                >
                    <Tooltip placement={'right'} content={'Logout'}>
                        <Icon.LogOut size={24} />
                    </Tooltip>
                </button>
            </div>
        </PanelDiv>
    );
};
