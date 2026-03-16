import tw from 'twin.macro';
import * as Icon from 'react-feather';
import React, { useState } from 'react';
import useFlash from '@/plugins/useFlash';
import styled from 'styled-components/macro';
import { ServerContext } from '@/state/server';
import editServer from '@/api/server/editServer';
import { Dialog } from '@/components/elements/dialog';
import { Button } from '@/components/elements/button/index';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import ServerContentBlock from '@/components/elements/ServerContentBlock';

import GlassCard from '@/components/elements/GlassCard';

const ResourceCard = styled(GlassCard)`
    ${tw`p-6 flex flex-col items-center`};
`;

const IconWrapper = styled.div`
    ${tw`p-4 rounded-2xl bg-blue-500/10 text-blue-400 mb-6 transition-transform group-hover:scale-110`};
`;

const EditContainer = () => {
    const [visible, setVisible] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [resource, setResource] = useState('');
    const [amount, setAmount] = useState(0);

    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const { clearFlashes, addFlash, clearAndAddHttpError } = useFlash();

    const edit = (resource: string, amount: number) => {
        clearFlashes('server:edit');
        setSubmitting(true);
        setVisible(false);

        editServer(uuid, resource, amount)
            .then(() => {
                setSubmitting(false);
                addFlash({
                    key: 'server:edit',
                    type: 'success',
                    message: 'Server resources have been edited successfully.',
                });
            })
            .catch((error) => {
                setSubmitting(false);
                clearAndAddHttpError({ key: 'server:edit', error });
            });
    };

    const ResourceItem = ({ icon: IconEl, title, res, add, sub, desc, limit }: any) => (
        <ResourceCard className={'group'}>
            <IconWrapper>
                <IconEl size={32} />
            </IconWrapper>
            <h3 css={tw`text-sm font-black text-neutral-100 uppercase tracking-widest mb-2`}>{title}</h3>
            <p css={tw`text-[10px] text-neutral-500 font-bold uppercase mb-6 text-center leading-relaxed h-8`}>
                {desc}
                <br />
                {limit}
            </p>

            <div css={tw`flex items-center gap-3 w-full`}>
                <Button.Danger
                    css={tw`flex-1 py-3`}
                    onClick={() => {
                        setResource(res);
                        setAmount(sub);
                        setVisible(true);
                    }}
                >
                    <Icon.Minus size={16} />
                </Button.Danger>
                <Button.Success
                    css={tw`flex-1 py-3`}
                    onClick={() => {
                        setResource(res);
                        setAmount(add);
                        setVisible(true);
                    }}
                >
                    <Icon.Plus size={16} />
                </Button.Success>
            </div>
        </ResourceCard>
    );

    return (
        <ServerContentBlock title={'Edit Resources'}>
            <SpinnerOverlay size={'large'} visible={submitting} />
            <Dialog.Confirm
                open={visible}
                onClose={() => setVisible(false)}
                title={'Confirm resource edit'}
                onConfirmed={() => edit(resource, amount)}
            >
                This will move resources between your account and the server. Are you sure you want to continue?
            </Dialog.Confirm>

            <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
                <ResourceItem
                    icon={Icon.Cpu}
                    title={'CPU Limit'}
                    res={'cpu'}
                    add={50}
                    sub={-50}
                    desc={'Add or remove CPU cores.'}
                    limit={'Min: 50%'}
                />
                <ResourceItem
                    icon={Icon.PieChart}
                    title={'Memory Limit'}
                    res={'memory'}
                    add={1024}
                    sub={-1024}
                    desc={'Add or remove RAM.'}
                    limit={'Min: 1GB'}
                />
                <ResourceItem
                    icon={Icon.HardDrive}
                    title={'Storage Limit'}
                    res={'disk'}
                    add={1024}
                    sub={-1024}
                    desc={'Add or remove disk space.'}
                    limit={'Min: 1GB'}
                />
                <ResourceItem
                    icon={Icon.Share2}
                    title={'Port Quantity'}
                    res={'allocation_limit'}
                    add={1}
                    sub={-1}
                    desc={'Change available ports.'}
                    limit={'Min: 1'}
                />
                <ResourceItem
                    icon={Icon.Archive}
                    title={'Backup Limit'}
                    res={'backup_limit'}
                    add={1}
                    sub={-1}
                    desc={'Change backup slots.'}
                    limit={''}
                />
                <ResourceItem
                    icon={Icon.Database}
                    title={'Database Limit'}
                    res={'database_limit'}
                    add={1}
                    sub={-1}
                    desc={'Change database slots.'}
                    limit={''}
                />
            </div>
        </ServerContentBlock>
    );
};

export default EditContainer;
