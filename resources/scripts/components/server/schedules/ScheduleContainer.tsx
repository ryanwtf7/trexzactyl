import tw from 'twin.macro';
import useFlash from '@/plugins/useFlash';
import Can from '@/components/elements/Can';
import { httpErrorToHuman } from '@/api/http';
import { ServerContext } from '@/state/server';
import React, { useEffect, useState } from 'react';
import Spinner from '@/components/elements/Spinner';
import { Button } from '@/components/elements/button/index';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ScheduleRow from '@/components/server/schedules/ScheduleRow';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import getServerSchedules from '@/api/server/schedules/getServerSchedules';
import EditScheduleModal from '@/components/server/schedules/EditScheduleModal';
import styled from 'styled-components/macro';
import * as Icon from 'react-feather';

const ScheduleCard = styled.div`
    ${tw`p-6 rounded-xl border border-neutral-700 bg-neutral-900/50 backdrop-blur-md mb-4 transition-all duration-300`};
    ${tw`hover:border-blue-500/50 hover:shadow-lg`};
`;

export default () => {
    const match = useRouteMatch();
    const history = useHistory();
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const { clearFlashes, addError } = useFlash();
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const schedules = ServerContext.useStoreState((state) => state.schedules.data);
    const setSchedules = ServerContext.useStoreActions((actions) => actions.schedules.setSchedules);

    useEffect(() => {
        clearFlashes('schedules');
        getServerSchedules(uuid)
            .then((schedules) => setSchedules(schedules))
            .catch((error) => {
                addError({ message: httpErrorToHuman(error), key: 'schedules' });
                console.error(error);
            })
            .then(() => setLoading(false));
    }, []);

    return (
        <ServerContentBlock title={'Schedules'}>
            {!schedules.length && loading ? (
                <Spinner size={'large'} centered />
            ) : (
                <>
                    {schedules.length === 0 ? (
                        <div
                            css={tw`p-12 flex flex-col items-center justify-center text-neutral-500 bg-neutral-900/50 backdrop-blur-md rounded-xl border border-neutral-700`}
                        >
                            <Icon.Calendar size={48} css={tw`mb-4 opacity-20`} />
                            <p css={tw`text-sm`}>There are no schedules configured for this server.</p>
                        </div>
                    ) : (
                        schedules.map((schedule) => (
                            <ScheduleCard
                                key={schedule.id}
                                className={'group'}
                                onClick={(e: any) => {
                                    e.preventDefault();
                                    history.push(`${match.url}/${schedule.id}`);
                                }}
                            >
                                <ScheduleRow schedule={schedule} />
                            </ScheduleCard>
                        ))
                    )}
                    <Can action={'schedule.create'}>
                        <div css={tw`mt-8 flex justify-end`}>
                            <EditScheduleModal visible={visible} onModalDismissed={() => setVisible(false)} />
                            <Button css={tw`px-6`} type={'button'} onClick={() => setVisible(true)}>
                                Create Schedule
                            </Button>
                        </div>
                    </Can>
                </>
            )}
        </ServerContentBlock>
    );
};
