import tw from 'twin.macro';
import * as Icon from 'react-feather';
import { Link } from 'react-router-dom';
import { useFlashKey } from '@/plugins/useFlash';
import React, { useEffect, useState } from 'react';
import Spinner from '@/components/elements/Spinner';
import useLocationHash from '@/plugins/useLocationHash';
import { useActivityLogs } from '@/api/server/activity';
import { ActivityLogFilters } from '@/api/account/activity';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import PaginationFooter from '@/components/elements/table/PaginationFooter';
import ActivityLogEntry from '@/components/elements/activity/ActivityLogEntry';
import styled from 'styled-components/macro';

import GlassCard from '@/components/elements/GlassCard';

const ActivityContainer = styled(GlassCard)`
    ${tw`overflow-hidden`};
`;

const FilterPill = styled(Link)`
    ${tw`flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-xs font-bold uppercase tracking-wider mb-4 inline-flex`};
`;

export default () => {
    const { hash } = useLocationHash();
    const { clearAndAddHttpError } = useFlashKey('server:activity');
    const [filters, setFilters] = useState<ActivityLogFilters>({ page: 1, sorts: { timestamp: -1 } });
    const { data, isValidating, error } = useActivityLogs(filters, {
        revalidateOnMount: true,
        revalidateOnFocus: false,
    });

    useEffect(() => {
        setFilters((value) => ({ ...value, filters: { ip: hash.ip, event: hash.event } }));
    }, [hash]);

    useEffect(() => {
        clearAndAddHttpError(error);
    }, [error]);

    return (
        <ServerContentBlock title={'Activity'}>
            {(filters.filters?.event || filters.filters?.ip) && (
                <div className={'flex justify-end'}>
                    <FilterPill to={'#'} onClick={() => setFilters((value) => ({ ...value, filters: {} }))}>
                        Clear Filters <Icon.XCircle size={14} />
                    </FilterPill>
                </div>
            )}

            {!data && isValidating ? (
                <Spinner centered />
            ) : !data?.items.length ? (
                <div css={tw`p-12 text-center bg-neutral-900/50 backdrop-blur-md rounded-xl border border-neutral-700`}>
                    <Icon.List size={48} css={tw`mx-auto mb-4 opacity-10 text-neutral-100`} />
                    <p className={'text-sm font-bold text-neutral-500 uppercase tracking-widest'}>
                        No activity logs available
                    </p>
                </div>
            ) : (
                <ActivityContainer className={'j-up'}>
                    <div css={tw`divide-y divide-neutral-800/50`}>
                        {data?.items.map((activity) => (
                            <ActivityLogEntry key={activity.id} activity={activity}>
                                <span />
                            </ActivityLogEntry>
                        ))}
                    </div>
                </ActivityContainer>
            )}

            {data && (
                <div css={tw`mt-6`}>
                    <PaginationFooter
                        pagination={data.pagination}
                        onPageSelect={(page) => setFilters((value) => ({ ...value, page }))}
                    />
                </div>
            )}
        </ServerContentBlock>
    );
};
