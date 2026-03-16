import tw from 'twin.macro';
import * as Icon from 'react-feather';
import { useLocation } from 'react-router';
import { useStoreState } from 'easy-peasy';
import Can from '@/components/elements/Can';
import { httpErrorToHuman } from '@/api/http';
import { ServerContext } from '@/state/server';
import TransitionRouter from '@/TransitionRouter';
import React, { useEffect, useState } from 'react';
import Spinner from '@/components/elements/Spinner';
import { CSSTransition } from 'react-transition-group';
import NavigationBar from '@/components/elements/NavigationBar';
import Suspended from '@/components/elements/Suspended';
import SubNavigation from '@/components/elements/SubNavigation';
import ErrorBoundary from '@/components/elements/ErrorBoundary';
import ExternalConsole from '@/components/server/ExternalConsole';
import InstallListener from '@/components/server/InstallListener';
import ServerRestoreSvg from '@/assets/images/server_restore.svg';
import RequireServerPermission from '@/hoc/RequireServerPermission';
import ServerInstallSvg from '@/assets/images/server_installing.svg';
import { NavLink, Route, Switch, useRouteMatch } from 'react-router-dom';
import ScreenBlock, { NotFound, ServerError } from '@/components/elements/ScreenBlock';

const PluginContainer = React.lazy(() => import('@/components/server/PluginContainer'));
import TransferListener from '@/components/server/TransferListener';
import WebsocketHandler from '@/components/server/WebsocketHandler';
const UsersContainer = React.lazy(() => import('@/components/server/users/UsersContainer'));
const BackupContainer = React.lazy(() => import('@/components/server/backups/BackupContainer'));
const FileEditContainer = React.lazy(() => import('@/components/server/files/FileEditContainer'));
const NetworkContainer = React.lazy(() => import('@/components/server/network/NetworkContainer'));
const StartupContainer = React.lazy(() => import('@/components/server/startup/StartupContainer'));
const SettingsContainer = React.lazy(() => import('@/components/server/settings/SettingsContainer'));
const ScheduleContainer = React.lazy(() => import('@/components/server/schedules/ScheduleContainer'));
const DatabasesContainer = React.lazy(() => import('@/components/server/databases/DatabasesContainer'));
const FileManagerContainer = React.lazy(() => import('@/components/server/files/FileManagerContainer'));
const AnalyticsContainer = React.lazy(() => import('@/components/server/analytics/AnalyticsContainer'));
const ServerConsoleContainer = React.lazy(() => import('@/components/server/console/ServerConsoleContainer'));
const ScheduleEditContainer = React.lazy(() => import('@/components/server/schedules/ScheduleEditContainer'));
const ServerActivityLogContainer = React.lazy(() => import('@/components/server/ServerActivityLogContainer'));

const ConflictStateRenderer = () => {
    const status = ServerContext.useStoreState((state) => state.server.data?.status || null);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data?.isTransferring || false);

    return status === 'installing' || status === 'install_failed' ? (
        <ScreenBlock
            title={'Running Installer'}
            image={ServerInstallSvg}
            message={'Your server should be ready soon, please try again in a few minutes.'}
        />
    ) : status === 'suspended' ? (
        <Suspended />
    ) : (
        <ScreenBlock
            title={isTransferring ? 'Transferring' : 'Restoring from Backup'}
            image={ServerRestoreSvg}
            message={
                isTransferring
                    ? 'Your server is being transfered to a new node, please check back later.'
                    : 'Your server is currently being restored from a backup, please check back in a few minutes.'
            }
        />
    );
};

export default () => {
    const match = useRouteMatch<{ id: string }>();
    const location = useLocation();

    // All refs must be declared first
    const nodeRef = React.useRef(null);

    // Then state hooks
    const [error, setError] = useState('');

    // Then store hooks
    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const databasesEnabled = useStoreState((state) => state.settings.data!.databases);

    const id = ServerContext.useStoreState((state) => state.server.data?.id);
    const uuid = ServerContext.useStoreState((state) => state.server.data?.uuid);
    const serverId = ServerContext.useStoreState((state) => state.server.data?.internalId);
    const getServer = ServerContext.useStoreActions((actions) => actions.server.getServer);
    const eggFeatures = ServerContext.useStoreState((state) => state.server.data?.eggFeatures);
    const inConflictState = ServerContext.useStoreState((state) => state.server.inConflictState);
    const clearServerState = ServerContext.useStoreActions((actions) => actions.clearServerState);

    useEffect(() => {
        clearServerState();
    }, []);

    useEffect(() => {
        setError('');

        getServer(match.params.id).catch((error) => {
            console.error(error);
            setError(httpErrorToHuman(error));
        });

        return () => {
            clearServerState();
        };
    }, [match.params.id]);

    return (
        <div css={tw`pt-20`} key={'server-router'}>
            <NavigationBar />
            {!uuid || !id ? (
                error ? (
                    <ServerError message={error} />
                ) : (
                    <Spinner size={'large'} centered />
                )
            ) : (
                <>
                    <CSSTransition timeout={150} classNames={'fade'} appear in nodeRef={nodeRef}>
                        <SubNavigation className={'j-down'} ref={nodeRef}>
                            <div>
                                <NavLink to={match.url} exact>
                                    <div css={tw`flex items-center justify-between`}>
                                        Console <Icon.Terminal css={tw`ml-1`} size={18} />
                                    </div>
                                </NavLink>
                                <NavLink to={`${match.url}/analytics`} exact>
                                    <div css={tw`flex items-center justify-between`}>
                                        Analytics <Icon.BarChart css={tw`ml-1`} size={18} />
                                    </div>
                                </NavLink>
                                <Can action={'activity.*'}>
                                    <NavLink to={`${match.url}/activity`}>
                                        <div css={tw`flex items-center justify-between`}>
                                            Activity <Icon.Eye css={tw`ml-1`} size={18} />
                                        </div>
                                    </NavLink>
                                </Can>
                                {eggFeatures?.includes('eula') && (
                                    <Can action={'plugin.*'}>
                                        <NavLink to={`${match.url}/plugins`}>
                                            <div css={tw`flex items-center justify-between`}>
                                                Plugins <Icon.Box css={tw`ml-1`} size={18} />
                                            </div>
                                        </NavLink>
                                    </Can>
                                )}
                                <Can action={'file.*'}>
                                    <NavLink to={`${match.url}/files`}>
                                        <div css={tw`flex items-center justify-between`}>
                                            Files <Icon.Folder css={tw`ml-1`} size={18} />
                                        </div>
                                    </NavLink>
                                </Can>
                                {databasesEnabled && (
                                    <Can action={'database.*'}>
                                        <NavLink to={`${match.url}/databases`}>
                                            <div css={tw`flex items-center justify-between`}>
                                                Databases <Icon.Database css={tw`ml-1`} size={18} />
                                            </div>
                                        </NavLink>
                                    </Can>
                                )}
                                <Can action={'schedule.*'}>
                                    <NavLink to={`${match.url}/schedules`}>
                                        <div css={tw`flex items-center justify-between`}>
                                            Tasks <Icon.Clock css={tw`ml-1`} size={18} />
                                        </div>
                                    </NavLink>
                                </Can>
                                <Can action={'user.*'}>
                                    <NavLink to={`${match.url}/users`}>
                                        <div css={tw`flex items-center justify-between`}>
                                            Users <Icon.Users css={tw`ml-1`} size={18} />
                                        </div>
                                    </NavLink>
                                </Can>
                                <Can action={'backup.*'}>
                                    <NavLink to={`${match.url}/backups`}>
                                        <div css={tw`flex items-center justify-between`}>
                                            Backups <Icon.Archive css={tw`ml-1`} size={18} />
                                        </div>
                                    </NavLink>
                                </Can>
                                <Can action={'allocation.*'}>
                                    <NavLink to={`${match.url}/network`}>
                                        <div css={tw`flex items-center justify-between`}>
                                            Network <Icon.Share2 css={tw`ml-1`} size={18} />
                                        </div>
                                    </NavLink>
                                </Can>
                                <Can action={'startup.*'}>
                                    <NavLink to={`${match.url}/startup`}>
                                        <div css={tw`flex items-center justify-between`}>
                                            Startup <Icon.Play css={tw`ml-1`} size={18} />
                                        </div>
                                    </NavLink>
                                </Can>
                                <Can action={['settings.*', 'file.sftp']} matchAny>
                                    <NavLink to={`${match.url}/settings`}>
                                        <div css={tw`flex items-center justify-between`}>
                                            Settings <Icon.Settings css={tw`ml-1`} size={18} />
                                        </div>
                                    </NavLink>
                                </Can>
                                {rootAdmin && (
                                    <a href={'/admin/servers/view/' + serverId} rel='noreferrer' target={'_blank'}>
                                        <div css={tw`flex items-center justify-between`}>
                                            Admin <Icon.ExternalLink css={tw`ml-1`} size={18} />
                                        </div>
                                    </a>
                                )}
                            </div>
                        </SubNavigation>
                    </CSSTransition>
                    <InstallListener />
                    <TransferListener />
                    <WebsocketHandler />
                    {inConflictState && (!rootAdmin || (rootAdmin && !location.pathname.endsWith(`/server/${id}`))) ? (
                        <ConflictStateRenderer />
                    ) : (
                        <ErrorBoundary>
                            <TransitionRouter>
                                <Spinner.Suspense>
                                    <Switch location={location}>
                                        <Route path={`${match.path}`} component={ServerConsoleContainer} exact />
                                        <Route path={`${match.path}/console`} component={ExternalConsole} exact />
                                        <Route path={`${match.path}/analytics`} component={AnalyticsContainer} exact />
                                        <Route path={`${match.path}/activity`} exact>
                                            <RequireServerPermission permissions={'activity.*'}>
                                                <ServerActivityLogContainer />
                                            </RequireServerPermission>
                                        </Route>
                                        {eggFeatures?.includes('eula') && (
                                            <Route path={`${match.path}/plugins`} exact>
                                                <RequireServerPermission permissions={'plugin.*'}>
                                                    <PluginContainer />
                                                </RequireServerPermission>
                                            </Route>
                                        )}
                                        <Route path={`${match.path}/files`} exact>
                                            <RequireServerPermission permissions={'file.*'}>
                                                <FileManagerContainer />
                                            </RequireServerPermission>
                                        </Route>
                                        <Route path={`${match.path}/files/:action(edit|new)`} exact>
                                            <Spinner.Suspense>
                                                <FileEditContainer />
                                            </Spinner.Suspense>
                                        </Route>
                                        {databasesEnabled && (
                                            <Route path={`${match.path}/databases`} exact>
                                                <RequireServerPermission permissions={'database.*'}>
                                                    <DatabasesContainer />
                                                </RequireServerPermission>
                                            </Route>
                                        )}
                                        <Route path={`${match.path}/schedules`} exact>
                                            <RequireServerPermission permissions={'schedule.*'}>
                                                <ScheduleContainer />
                                            </RequireServerPermission>
                                        </Route>
                                        <Route path={`${match.path}/schedules/:id`} exact>
                                            <ScheduleEditContainer />
                                        </Route>
                                        <Route path={`${match.path}/users`} exact>
                                            <RequireServerPermission permissions={'user.*'}>
                                                <UsersContainer />
                                            </RequireServerPermission>
                                        </Route>
                                        <Route path={`${match.path}/backups`} exact>
                                            <RequireServerPermission permissions={'backup.*'}>
                                                <BackupContainer />
                                            </RequireServerPermission>
                                        </Route>
                                        <Route path={`${match.path}/network`} exact>
                                            <RequireServerPermission permissions={'allocation.*'}>
                                                <NetworkContainer />
                                            </RequireServerPermission>
                                        </Route>
                                        <Route path={`${match.path}/startup`} component={StartupContainer} exact />
                                        <Route path={`${match.path}/settings`} component={SettingsContainer} exact />
                                        <Route path={'*'} component={NotFound} />
                                    </Switch>
                                </Spinner.Suspense>
                            </TransitionRouter>
                        </ErrorBoundary>
                    )}
                </>
            )}
        </div>
    );
};
