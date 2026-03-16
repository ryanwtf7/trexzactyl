import React from 'react';
import tw from 'twin.macro';
import { useLocation } from 'react-router';
import TransitionRouter from '@/TransitionRouter';
import { NotFound } from '@/components/elements/ScreenBlock';
import ViewContainer from '@/components/tickets/ViewContainer';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import NavigationBar from '@/components/elements/NavigationBar';
import OverviewContainer from '@/components/tickets/OverviewContainer';

export default () => {
    const location = useLocation();
    const match = useRouteMatch<{ id: string }>();

    return (
        <div css={tw`pt-20`}>
            <NavigationBar />
            <TransitionRouter>
                <Switch location={location}>
                    <Route path={match.path} exact>
                        <OverviewContainer />
                    </Route>
                    <Route path={`${match.path}/:id`} exact>
                        <ViewContainer />
                    </Route>
                    <Route path={'*'}>
                        <NotFound />
                    </Route>
                </Switch>
            </TransitionRouter>
        </div>
    );
};
