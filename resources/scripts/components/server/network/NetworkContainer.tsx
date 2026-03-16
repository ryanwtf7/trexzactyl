import tw from 'twin.macro';
import isEqual from 'react-fast-compare';
import Can from '@/components/elements/Can';
import { ServerContext } from '@/state/server';
import { useFlashKey } from '@/plugins/useFlash';
import React, { useEffect, useState } from 'react';
import Spinner from '@/components/elements/Spinner';
import { Button } from '@/components/elements/button/index';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import getServerAllocations from '@/api/swr/getServerAllocations';
import AllocationRow from '@/components/server/network/AllocationRow';
import { useDeepCompareEffect } from '@/plugins/useDeepCompareEffect';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import createServerAllocation from '@/api/server/network/createServerAllocation';
import * as Icon from 'react-feather';

const NetworkContainer = () => {
    const [loading, setLoading] = useState(false);
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const allocationLimit = ServerContext.useStoreState((state) => state.server.data!.featureLimits.allocations);
    const allocations = ServerContext.useStoreState((state) => state.server.data!.allocations, isEqual);
    const setServerFromState = ServerContext.useStoreActions((actions) => actions.server.setServerFromState);

    const { clearFlashes, clearAndAddHttpError } = useFlashKey('server:network');
    const { data, error, mutate } = getServerAllocations();

    useEffect(() => {
        mutate(allocations);
    }, []);

    useEffect(() => {
        clearAndAddHttpError(error);
    }, [error]);

    useDeepCompareEffect(() => {
        if (!data) return;
        setServerFromState((state) => ({ ...state, allocations: data }));
    }, [data]);

    const onCreateAllocation = () => {
        clearFlashes();
        setLoading(true);
        createServerAllocation(uuid)
            .then((allocation) => {
                setServerFromState((s) => ({ ...s, allocations: s.allocations.concat(allocation) }));
                return mutate(data?.concat(allocation), false);
            })
            .catch((error) => clearAndAddHttpError(error))
            .then(() => setLoading(false));
    };

    return (
        <ServerContentBlock title={'Network'}>
            {!data ? (
                <Spinner size={'large'} centered />
            ) : (
                <>
                    <div css={tw`grid grid-cols-1 gap-3`}>
                        {data.map((allocation) => (
                            <AllocationRow key={`${allocation.ip}:${allocation.port}`} allocation={allocation} />
                        ))}
                    </div>
                    {allocationLimit > 0 && (
                        <Can action={'allocation.create'}>
                            <SpinnerOverlay visible={loading} />
                            <div
                                css={tw`mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-sm border border-neutral-700 bg-neutral-900 bg-opacity-40 backdrop-blur-xl`}
                            >
                                <div css={tw`flex items-center gap-3`}>
                                    <Icon.Activity size={18} css={tw`text-blue-400`} />
                                    <p css={tw`text-sm text-neutral-400 font-bold uppercase tracking-wider`}>
                                        Allocations:{' '}
                                        <span css={tw`text-neutral-100 ml-1`}>
                                            {data.length} / {allocationLimit} used
                                        </span>
                                    </p>
                                </div>
                                {allocationLimit > data.length && (
                                    <Button css={tw`w-full sm:w-auto px-8`} onClick={onCreateAllocation}>
                                        Create Allocation
                                    </Button>
                                )}
                            </div>
                        </Can>
                    )}
                </>
            )}
        </ServerContentBlock>
    );
};

export default NetworkContainer;
