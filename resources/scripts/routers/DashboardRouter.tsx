import React from 'react';
import tw from 'twin.macro';
import * as Icon from 'react-feather';
import { useStoreState } from 'easy-peasy';
import { useLocation } from 'react-router';
import TransitionRouter from '@/TransitionRouter';
import Spinner from '@/components/elements/Spinner';
import { NavLink, Route, Switch } from 'react-router-dom';
import { NotFound } from '@/components/elements/ScreenBlock';
import SubNavigation from '@/components/elements/SubNavigation';
import NavigationBar from '@/components/elements/NavigationBar';

const ReferralContainer = React.lazy(() => import('@/components/dashboard/ReferralContainer'));
const DashboardContainer = React.lazy(() => import('@/components/dashboard/DashboardContainer'));
const AccountApiContainer = React.lazy(() => import('@/components/dashboard/AccountApiContainer'));
const AccountSSHContainer = React.lazy(() => import('@/components/dashboard/ssh/AccountSSHContainer'));
const AccountOverviewContainer = React.lazy(() => import('@/components/dashboard/AccountOverviewContainer'));
const AccountSecurityContainer = React.lazy(() => import('@/components/dashboard/AccountSecurityContainer'));
const CouponContainer = React.lazy(() => import('@/components/dashboard/CouponContainer'));

export default () => {
    const location = useLocation();
    const coupons = useStoreState((state) => state.settings.data?.coupons);
    const referrals = useStoreState((state) => state.storefront.data?.referrals?.enabled);

    return (
        <div css={tw`pt-20`}>
            <NavigationBar />
            {location.pathname.startsWith('/account') ? (
                <SubNavigation className={'j-down'}>
                    <div>
                        <NavLink to={'/account'} exact>
                            <div css={tw`flex items-center justify-between`}>
                                Account <Icon.User css={tw`ml-1`} size={18} />
                            </div>
                        </NavLink>
                        <NavLink to={'/account/security'}>
                            <div css={tw`flex items-center justify-between`}>
                                Security <Icon.Key css={tw`ml-1`} size={18} />
                            </div>
                        </NavLink>
                        {referrals && (
                            <NavLink to={'/account/referrals'}>
                                <div css={tw`flex items-center justify-between`}>
                                    Referrals <Icon.DollarSign css={tw`ml-1`} size={18} />
                                </div>
                            </NavLink>
                        )}
                        <NavLink to={'/account/api'}>
                            <div css={tw`flex items-center justify-between`}>
                                API <Icon.Code css={tw`ml-1`} size={18} />
                            </div>
                        </NavLink>
                        <NavLink to={'/account/ssh'}>
                            <div css={tw`flex items-center justify-between`}>
                                SSH Keys <Icon.Terminal css={tw`ml-1`} size={18} />
                            </div>
                        </NavLink>
                        {coupons && (
                            <NavLink to={'/account/coupons'}>
                                <div className={'flex items-center justify-between'}>
                                    Coupons <Icon.DollarSign className={'ml-1'} size={18} />
                                </div>
                            </NavLink>
                        )}
                    </div>
                </SubNavigation>
            ) : null}
            <TransitionRouter>
                <Spinner.Suspense>
                    <Switch location={location}>
                        <Route path={'/'} exact>
                            <DashboardContainer />
                        </Route>
                        <Route path={'/account'} exact>
                            <AccountOverviewContainer />
                        </Route>
                        <Route path={'/account/security'} exact>
                            <AccountSecurityContainer />
                        </Route>
                        {referrals && (
                            <Route path={`/account/referrals`} exact>
                                <ReferralContainer />
                            </Route>
                        )}
                        <Route path={'/account/api'} exact>
                            <AccountApiContainer />
                        </Route>
                        <Route path={'/account/ssh'} exact>
                            <AccountSSHContainer />
                        </Route>
                        {coupons && (
                            <Route path={'/account/coupons'} exact>
                                <CouponContainer />
                            </Route>
                        )}
                        <Route path={'*'}>
                            <NotFound />
                        </Route>
                    </Switch>
                </Spinner.Suspense>
            </TransitionRouter>
        </div>
    );
};
