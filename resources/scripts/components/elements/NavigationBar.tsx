import React, { useState } from 'react';
import tw from 'twin.macro';
import http from '@/api/http';
import * as Icon from 'react-feather';
import { useStoreState } from 'easy-peasy';
import { NavLink, Link } from 'react-router-dom';
import ProgressBar from '@/components/elements/ProgressBar';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import SearchContainer from '@/components/dashboard/search/SearchContainer';

export default () => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const logo = useStoreState((state) => state.settings.data?.logo);
    const tickets = useStoreState((state) => state.settings.data?.tickets);
    const store = useStoreState((state) => state.storefront.data?.enabled);
    const rootAdmin = useStoreState((state) => state.user.data?.rootAdmin);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };

    return (
        <nav
            css={tw`fixed top-0 left-0 right-0 z-50 bg-neutral-900 bg-opacity-40 backdrop-blur-xl border-b border-white/5`}
        >
            <ProgressBar />
            <SpinnerOverlay visible={isLoggingOut} />
            <div css={tw`max-w-7xl mx-auto h-16 flex items-center justify-between px-4 sm:px-6`}>
                <div css={tw`flex items-center h-full`}>
                    <Link
                        to={'/'}
                        className={'group'}
                        css={tw`flex items-center transition-transform duration-300 hover:scale-105`}
                    >
                        <img
                            className={'h-8 sm:h-9 w-auto'}
                            src={logo ?? 'https://avatars.githubusercontent.com/u/91636558'}
                            alt={'Logo'}
                        />
                    </Link>

                    <div
                        css={[
                            tw`hidden md:flex items-center space-x-1 h-full ml-8`,
                            `
                            & > a {
                                display: inline-block;
                                padding: 0.75rem 1rem;
                                color: rgb(163 163 163);
                                text-decoration: none;
                                white-space: nowrap;
                                transition: all 300ms;
                                font-weight: 700;
                                font-size: 0.75rem;
                                position: relative;
                            }
                            & > a.active {
                                color: rgb(96 165 250);
                            }
                            & > a.active::after {
                                content: '';
                                position: absolute;
                                bottom: 0;
                                left: 1rem;
                                right: 1rem;
                                height: 0.125rem;
                                background-color: rgb(59 130 246);
                                border-radius: 0.125rem;
                                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                            }
                            `,
                        ]}
                    >
                        <NavLink to={'/'} exact>
                            SERVERS
                        </NavLink>
                        <NavLink to={'/account'}>ACCOUNT</NavLink>
                        {store && <NavLink to={'/store'}>STORE</NavLink>}
                        {tickets && <NavLink to={'/tickets'}>TICKETS</NavLink>}
                        {rootAdmin && <a href={'/admin'}>ADMIN</a>}
                    </div>
                </div>

                <div css={tw`flex items-center space-x-3`}>
                    <div
                        css={tw`p-2.5 transition-all duration-300 cursor-pointer text-neutral-400 hover:text-neutral-100 flex items-center justify-center`}
                    >
                        <SearchContainer size={18} />
                    </div>

                    <button onClick={onTriggerLogout} css={tw`focus:outline-none mr-2 sm:mr-0`}>
                        <Tooltip placement={'bottom'} content={'Logout'}>
                            <div
                                css={tw`p-2.5 transition-all duration-300 cursor-pointer text-red-400 text-opacity-80 hover:text-red-400 flex items-center justify-center`}
                            >
                                <Icon.LogOut size={18} />
                            </div>
                        </Tooltip>
                    </button>

                    {/* Mobile Navigation Icons */}
                    <div css={tw`md:hidden flex items-center space-x-1 border-l border-white/5 pl-2 ml-1`}>
                        <NavLink to={'/'} exact css={tw`text-neutral-400 hover:text-neutral-100 p-2`}>
                            <Icon.Server size={18} />
                        </NavLink>
                        <NavLink to={'/account'} css={tw`text-neutral-400 hover:text-neutral-100 p-2`}>
                            <Icon.User size={18} />
                        </NavLink>
                        {store && (
                            <NavLink to={'/store'} css={tw`text-neutral-400 hover:text-neutral-100 p-2`}>
                                <Icon.ShoppingCart size={18} />
                            </NavLink>
                        )}
                        {tickets && (
                            <NavLink to={'/tickets'} css={tw`text-neutral-400 hover:text-neutral-100 p-2`}>
                                <Icon.MessageSquare size={18} />
                            </NavLink>
                        )}
                        {rootAdmin && (
                            <a href={'/admin'} css={tw`text-neutral-400 hover:text-neutral-100 p-2`}>
                                <Icon.Settings size={18} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
