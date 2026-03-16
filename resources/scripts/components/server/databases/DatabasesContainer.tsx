import tw from 'twin.macro';
import useFlash from '@/plugins/useFlash';
import Can from '@/components/elements/Can';
import { httpErrorToHuman } from '@/api/http';
import Fade from '@/components/elements/Fade';
import { ServerContext } from '@/state/server';
import React, { useEffect, useState } from 'react';
import Spinner from '@/components/elements/Spinner';
import { useDeepMemoize } from '@/plugins/useDeepMemoize';
import DatabaseRow from '@/components/server/databases/DatabaseRow';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import getServerDatabases from '@/api/server/databases/getServerDatabases';
import CreateDatabaseButton from '@/components/server/databases/CreateDatabaseButton';
import * as Icon from 'react-feather';

export default () => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const databaseLimit = ServerContext.useStoreState((state) => state.server.data!.featureLimits.databases);
    const { addError, clearFlashes } = useFlash();
    const [loading, setLoading] = useState(true);
    const databases = useDeepMemoize(ServerContext.useStoreState((state) => state.databases.data));
    const setDatabases = ServerContext.useStoreActions((state) => state.databases.setDatabases);

    useEffect(() => {
        setLoading(!databases.length);
        clearFlashes('databases');
        getServerDatabases(uuid)
            .then((databases) => setDatabases(databases))
            .catch((error) => {
                console.error(error);
                addError({ key: 'databases', message: httpErrorToHuman(error) });
            })
            .then(() => setLoading(false));
    }, []);

    return (
        <ServerContentBlock title={'Databases'}>
            {!databases.length && loading ? (
                <Spinner size={'large'} centered />
            ) : (
                <Fade timeout={150}>
                    <>
                        {databases.length > 0 ? (
                            databases.map((database) => <DatabaseRow key={database.id} database={database} />)
                        ) : (
                            <div
                                css={tw`p-12 text-center bg-neutral-900 bg-opacity-40 backdrop-blur-xl rounded-sm border border-neutral-700`}
                            >
                                <Icon.Database size={48} css={tw`mx-auto mb-4 opacity-10 text-neutral-100`} />
                                <p className={'text-sm font-bold text-neutral-500 uppercase tracking-wider'}>
                                    {databaseLimit > 0
                                        ? 'It looks like you have no databases.'
                                        : 'Databases cannot be created for this server.'}
                                </p>
                            </div>
                        )}
                        <Can action={'database.create'}>
                            <div
                                css={tw`mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-sm border border-neutral-700 bg-neutral-900 bg-opacity-40 backdrop-blur-xl`}
                            >
                                <div css={tw`flex items-center gap-3`}>
                                    <Icon.Activity size={18} css={tw`text-blue-400`} />
                                    <p css={tw`text-sm text-neutral-400 font-bold uppercase tracking-wider`}>
                                        Usage:{' '}
                                        <span css={tw`text-neutral-100 ml-1`}>
                                            {databases.length} / {databaseLimit} allocated
                                        </span>
                                    </p>
                                </div>
                                {databaseLimit > 0 && databaseLimit !== databases.length && <CreateDatabaseButton />}
                            </div>
                        </Can>
                    </>
                </Fade>
            )}
        </ServerContentBlock>
    );
};
