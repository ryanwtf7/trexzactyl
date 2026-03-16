import tw from 'twin.macro';
import * as Icon from 'react-feather';
import { Link } from 'react-router-dom';
import useFlash from '@/plugins/useFlash';
import styled from 'styled-components/macro';
import React, { useState, useEffect } from 'react';
import Spinner from '@/components/elements/Spinner';
import { Dialog } from '@/components/elements/dialog';
import { getCosts, Costs } from '@/api/store/getCosts';
import purchaseResource from '@/api/store/purchaseResource';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import PurchaseBox from '@/components/elements/store/PurchaseBox';
import PageContentBlock from '@/components/elements/PageContentBlock';
import { motion } from 'framer-motion';

const Container = styled.div`
    ${tw`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8`};
`;

export default () => {
    const [open, setOpen] = useState(false);
    const [costs, setCosts] = useState<Costs>();
    const [resource, setResource] = useState('');
    const { addFlash, clearFlashes, clearAndAddHttpError } = useFlash();

    useEffect(() => {
        getCosts().then((costs) => setCosts(costs));
    }, []);

    const purchase = (resource: string) => {
        clearFlashes('store:resources');

        purchaseResource(resource)
            .then(() => {
                setOpen(false);
                addFlash({
                    type: 'success',
                    key: 'store:resources',
                    message: 'Resource has been added to your account.',
                });
            })
            .catch((error) => clearAndAddHttpError({ key: 'store:resources', error }));
    };

    if (!costs) return <Spinner size={'large'} centered />;

    return (
        <PageContentBlock
            title={'Buy Resources'}
            description={'Buy more resources to add to your server.'}
            showFlashKey={'store:resources'}
        >
            <SpinnerOverlay size={'large'} visible={open} />
            <Dialog.Confirm
                open={open}
                onClose={() => setOpen(false)}
                title={'Confirm resource selection'}
                confirm={'Continue'}
                onConfirmed={() => purchase(resource)}
            >
                Are you sure you want to purchase this resource ({resource})? This will take the credits from your
                account and add the resource. This is not a reversible transaction.
            </Dialog.Confirm>

            <Container css={tw`mb-12`}>
                <PurchaseBox
                    type={'CPU'}
                    amount={50}
                    suffix={'%'}
                    cost={costs.cpu}
                    setOpen={setOpen}
                    icon={<Icon.Cpu />}
                    setResource={setResource}
                    description={'Improve server load times and processing performance.'}
                />
                <PurchaseBox
                    type={'Memory'}
                    amount={1}
                    suffix={'GB'}
                    cost={costs.memory}
                    setOpen={setOpen}
                    icon={<Icon.PieChart />}
                    setResource={setResource}
                    description={'Improve overall server stability and memory headroom.'}
                />
                <PurchaseBox
                    type={'Disk'}
                    amount={1}
                    suffix={'GB'}
                    cost={costs.disk}
                    setOpen={setOpen}
                    icon={<Icon.HardDrive />}
                    setResource={setResource}
                    description={'Expand storage capacity for more files and data.'}
                />
                <PurchaseBox
                    type={'Slots'}
                    amount={1}
                    cost={costs.slots}
                    setOpen={setOpen}
                    icon={<Icon.Server />}
                    setResource={setResource}
                    description={'Increase your server slot limit to deploy new instances.'}
                />
            </Container>

            <Container css={tw`mb-12`}>
                <PurchaseBox
                    type={'Ports'}
                    amount={1}
                    cost={costs.ports}
                    setOpen={setOpen}
                    icon={<Icon.Share2 />}
                    setResource={setResource}
                    description={'Add extra network ports for additional services.'}
                />
                <PurchaseBox
                    type={'Backups'}
                    amount={1}
                    cost={costs.backups}
                    setOpen={setOpen}
                    icon={<Icon.Archive />}
                    setResource={setResource}
                    description={'Secure more backup slots to keep your data safe.'}
                />
                <PurchaseBox
                    type={'Databases'}
                    amount={1}
                    cost={costs.databases}
                    setOpen={setOpen}
                    icon={<Icon.Database />}
                    setResource={setResource}
                    description={'Add more MySQL databases for your applications.'}
                />
                <div
                    css={tw`bg-neutral-900 bg-opacity-40 backdrop-blur-xl border border-neutral-700 rounded-sm p-10 relative overflow-hidden flex flex-col justify-center`}
                >
                    <div css={tw`absolute top-0 right-0 w-24 h-24 bg-blue-500 bg-opacity-10 blur-2xl -mr-12 -mt-12`} />
                    <h3 css={tw`text-lg font-bold text-white mb-6 flex items-center`}>
                        <Icon.Info size={20} css={tw`mr-3 text-blue-400`} strokeWidth={2.5} /> Usage Guide
                    </h3>
                    <div css={tw`space-y-6 relative z-10`}>
                        <div>
                            <p css={tw`text-xs font-bold text-blue-400 mb-1.5`}>Server Allocation</p>
                            <p css={tw`text-xs text-neutral-400 leading-relaxed font-bold`}>
                                Navigate to a server&apos;s &apos;Edit&apos; tab to distribute your credits.
                            </p>
                        </div>
                        <div>
                            <p css={tw`text-xs font-bold text-blue-400 mb-1.5`}>Deployment</p>
                            <p css={tw`text-xs text-neutral-400 leading-relaxed font-bold`}>
                                Credits are automatically deducted during the server creation process.
                            </p>
                        </div>
                    </div>
                </div>
            </Container>

            <div css={tw`flex justify-center items-center mt-24 mb-12`}>
                <motion.div
                    className={'group'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    css={tw`w-full max-w-5xl bg-neutral-900 bg-opacity-40 backdrop-blur-xl border border-neutral-700 p-12 rounded-sm text-center relative overflow-hidden shadow-2xl hover:border-blue-500 transition-all duration-500`}
                >
                    <div
                        css={tw`absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 opacity-50`}
                    />
                    <div
                        css={tw`absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500 bg-opacity-10 blur-3xl rounded-full`}
                    />
                    <div css={tw`relative z-10`}>
                        <h1 css={tw`text-5xl md:text-6xl font-black text-white mb-4`}>Deploy Now</h1>
                        <p css={tw`text-neutral-500 font-bold text-xs mb-10`}>
                            Your high-performance instance is just a click away
                        </p>
                        <Link to={'/store/create'}>
                            <button
                                css={tw`px-16 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-5 rounded-sm transition-all shadow-xl hover:shadow-2xl active:scale-95`}
                            >
                                Initialize Instance
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </PageContentBlock>
    );
};
