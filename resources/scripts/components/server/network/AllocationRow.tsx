import tw from 'twin.macro';
import { debounce } from 'debounce';
import { ip } from '@/lib/formatters';
import * as Icon from 'react-feather';
import isEqual from 'react-fast-compare';
import Can from '@/components/elements/Can';
import styled from 'styled-components/macro';
import Code from '@/components/elements/Code';
import { ServerContext } from '@/state/server';
import { useFlashKey } from '@/plugins/useFlash';
import { Allocation } from '@/api/server/getServer';
import { Textarea } from '@/components/elements/Input';
import React, { memo, useCallback, useState } from 'react';
import { Button } from '@/components/elements/button/index';
import CopyOnClick from '@/components/elements/CopyOnClick';
import InputSpinner from '@/components/elements/InputSpinner';
import getServerAllocations from '@/api/swr/getServerAllocations';
import setServerAllocationNotes from '@/api/server/network/setServerAllocationNotes';
import DeleteAllocationButton from '@/components/server/network/DeleteAllocationButton';
import setPrimaryServerAllocation from '@/api/server/network/setPrimaryServerAllocation';

const AllocationCard = styled.div`
    ${tw`flex flex-wrap md:flex-nowrap items-center p-4 rounded-sm border border-neutral-700 bg-neutral-900 bg-opacity-40 backdrop-blur-xl mb-3 transition-all duration-300`};
    ${tw`hover:border-blue-500 border-opacity-50 hover:shadow-lg hover:-translate-y-0.5`};
`;

const Label = styled.label`
    ${tw`uppercase text-xs font-black mt-1 text-neutral-500 block px-1 select-none transition-colors duration-150`};
`;

const StyledTextarea = styled(Textarea)`
    ${tw`bg-neutral-800 bg-opacity-50 border-neutral-700 hover:border-neutral-600 focus:border-blue-500 transition-all duration-200 text-sm`};
`;

const Badge = styled.div`
    ${tw`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider`};
    ${tw`bg-blue-500 bg-opacity-10 text-blue-400 border border-blue-500 border-opacity-20`};
`;

const AllocationRow = ({ allocation }: { allocation: Allocation }) => {
    const [loading, setLoading] = useState(false);
    const { clearFlashes, clearAndAddHttpError } = useFlashKey('server:network');
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const { mutate } = getServerAllocations();

    const onNotesChanged = useCallback((id: number, notes: string) => {
        mutate((data) => data?.map((a) => (a.id === id ? { ...a, notes } : a)), false);
    }, []);

    const setAllocationNotes = debounce((notes: string) => {
        setLoading(true);
        clearFlashes();
        setServerAllocationNotes(uuid, allocation.id, notes)
            .then(() => onNotesChanged(allocation.id, notes))
            .catch((error) => clearAndAddHttpError(error))
            .then(() => setLoading(false));
    }, 750);

    const setPrimaryAllocation = () => {
        clearFlashes();
        mutate((data) => data?.map((a) => ({ ...a, isDefault: a.id === allocation.id })), false);
        setPrimaryServerAllocation(uuid, allocation.id).catch((error) => {
            clearAndAddHttpError(error);
            mutate();
        });
    };

    return (
        <AllocationCard className={'group'}>
            <div css={tw`flex items-center w-full md:w-auto`}>
                <div css={tw`pl-2 pr-6 text-neutral-500 group-hover:text-blue-400 transition-colors duration-200`}>
                    <Icon.Share2 size={20} />
                </div>
                <div css={tw`mr-8 flex-1 md:w-48`}>
                    <CopyOnClick text={allocation.alias || ip(allocation.ip)}>
                        <Code
                            css={tw`bg-neutral-800 bg-opacity-50 text-neutral-100 border-neutral-700 px-2 py-1 rounded-sm w-48 truncate block group-hover:border-blue-500 border-opacity-30 transition-all`}
                        >
                            {allocation.alias || ip(allocation.ip)}
                        </Code>
                    </CopyOnClick>
                    <Label>{allocation.alias ? 'Hostname' : 'IP Address'}</Label>
                </div>
                <div css={tw`w-20 md:w-24 overflow-hidden`}>
                    <Code
                        css={tw`bg-neutral-800 bg-opacity-50 text-neutral-100 border-neutral-700 px-2 py-1 rounded-sm block group-hover:border-blue-500 border-opacity-30 transition-all`}
                    >
                        {allocation.port}
                    </Code>
                    <Label>Port</Label>
                </div>
            </div>

            <div css={tw`mt-4 w-full md:mt-0 md:flex-1 md:mx-8`}>
                <InputSpinner visible={loading}>
                    <StyledTextarea
                        placeholder={'Add notes for this allocation...'}
                        defaultValue={allocation.notes || undefined}
                        onChange={(e) => setAllocationNotes(e.currentTarget.value)}
                        rows={1}
                        css={tw`resize-none overflow-hidden h-10 py-2`}
                    />
                </InputSpinner>
            </div>

            <div css={tw`flex justify-end items-center gap-3 mt-4 w-full md:mt-0 md:w-48`}>
                {allocation.isDefault ? (
                    <Badge>Primary</Badge>
                ) : (
                    <>
                        <Can action={'allocation.delete'}>
                            <DeleteAllocationButton allocation={allocation.id} />
                        </Can>
                        <Can action={'allocation.update'}>
                            <Button.Text css={tw`text-xs`} onClick={setPrimaryAllocation}>
                                Make Primary
                            </Button.Text>
                        </Can>
                    </>
                )}
            </div>
        </AllocationCard>
    );
};

export default memo(AllocationRow, isEqual);
