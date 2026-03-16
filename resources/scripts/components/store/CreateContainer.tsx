import tw from 'twin.macro';
import * as Icon from 'react-feather';
import { Form, Formik } from 'formik';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { number, object, string } from 'yup';
import Field from '@/components/elements/Field';
import Select from '@/components/elements/Select';
import { Egg, getEggs } from '@/api/store/getEggs';
import createServer from '@/api/store/createServer';
import Spinner from '@/components/elements/Spinner';
import { getNodes, Node } from '@/api/store/getNodes';
import { getNests, Nest } from '@/api/store/getNests';
import { Button } from '@/components/elements/button';
import InputSpinner from '@/components/elements/InputSpinner';
import StoreError from '@/components/elements/store/StoreError';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { getResources, Resources } from '@/api/store/getResources';
import PageContentBlock from '@/components/elements/PageContentBlock';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const PremiumBox = styled(motion.div)`
    ${tw`bg-neutral-900 bg-opacity-40 backdrop-blur-xl border border-neutral-700 p-8 rounded-sm relative overflow-hidden transition-all duration-300`};
    ${tw`hover:border-blue-500 hover:bg-neutral-900 bg-opacity-60`};
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent);
        opacity: 0.6;
    }
`;

const IconWrapper = styled.div`
    ${tw`bg-blue-600 bg-opacity-10 p-3 rounded-sm border border-blue-500 border-opacity-20 mr-4 transition-transform duration-500`};
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const InputLabel = styled.h3`
    ${tw`text-xs font-bold text-neutral-500 mb-2 ml-1`};
`;

const PoolInfo = styled.div`
    ${tw`mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-4 text-xs font-bold text-neutral-500`};
    & span {
        ${tw`bg-neutral-800 bg-opacity-50 px-2 py-1 rounded border border-white/5`};
    }
    & b {
        ${tw`text-blue-400 font-black`};
    }
`;

interface CreateValues {
    name: string;
    description: string | null;
    cpu: number;
    memory: number;
    disk: number;
    ports: number;
    backups: number | null;
    databases: number | null;

    egg: number;
    nest: number;
    node: number;
}

export default () => {
    const [loading, setLoading] = useState(false);
    const [resources, setResources] = useState<Resources>();

    const user = useStoreState((state) => state.user.data!);
    const { clearFlashes, clearAndAddHttpError } = useFlash();

    const [egg, setEgg] = useState<number>(0);
    const [eggs, setEggs] = useState<Egg[]>();
    const [nest, setNest] = useState<number>(0);
    const [nests, setNests] = useState<Nest[]>();
    const [node, setNode] = useState<number>(0);
    const [nodes, setNodes] = useState<Node[]>();

    useEffect(() => {
        clearFlashes();

        getResources().then((resources) => setResources(resources));

        getEggs().then((eggs) => {
            setEggs(eggs);
            if (eggs.length > 0) setEgg(eggs[0].id);
        });

        getNests().then((nests) => {
            setNests(nests);
            if (nests.length > 0) setNest(nests[0].id);
        });

        getNodes().then((nodes) => {
            setNodes(nodes);
            if (nodes.length > 0) setNode(nodes[0].id);
        });
    }, []);

    const changeNest = (e: ChangeEvent<HTMLSelectElement>) => {
        setNest(parseInt(e.target.value));

        getEggs(parseInt(e.target.value)).then((eggs) => {
            setEggs(eggs);
            setEgg(eggs[0].id);
        });
    };

    const submit = (values: CreateValues) => {
        setLoading(true);
        clearFlashes('store:create');

        createServer(values, egg, nest, node)
            .then((data) => {
                if (!data.id) return;

                setLoading(false);
                clearFlashes('store:create');
                // @ts-expect-error this is valid
                window.location = `/server/${data.id}`;
            })
            .catch((error) => {
                setLoading(false);
                clearAndAddHttpError({ key: 'store:create', error });
            });
    };

    if (!resources) return <Spinner size={'large'} centered />;

    if (!nodes) {
        return (
            <StoreError
                message={'No nodes are available for deployment. Try again later.'}
                admin={'Ensure you have at least one node that can be deployed to.'}
            />
        );
    }

    if (!nests || !eggs) {
        return (
            <StoreError
                message={'No server types are available for deployment. Try again later.'}
                admin={'Ensure you have at least one egg which is in a public nest.'}
            />
        );
    }

    return (
        <PageContentBlock title={'Create Server'} showFlashKey={'store:create'}>
            <Formik
                onSubmit={submit}
                initialValues={{
                    name: `${user.username}'s server`,
                    description: 'Write a server description here.',
                    cpu: resources.cpu,
                    memory: resources.memory,
                    disk: resources.disk,
                    ports: resources.ports,
                    backups: resources.backups,
                    databases: resources.databases,
                    nest: nest || 1,
                    egg: egg || 1,
                    node: node || 1,
                }}
                validationSchema={object().shape({
                    name: string().required().min(3),
                    description: string().optional().min(3).max(191),

                    cpu: number().required().min(25).max(resources.cpu),
                    memory: number().required().min(256).max(resources.memory),
                    disk: number().required().min(256).max(resources.disk),

                    ports: number().required().min(1).max(resources.ports),
                    backups: number().optional().max(resources.backups),
                    databases: number().optional().max(resources.databases),

                    node: number().required().default(node),
                    nest: number().required().default(nest),
                    egg: number().required().default(egg),
                })}
            >
                <Form css={tw`space-y-8`}>
                    <div css={tw`grid grid-cols-1 lg:grid-cols-2 gap-8`}>
                        <PremiumBox
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div css={tw`flex items-center mb-8`}>
                                <IconWrapper>
                                    <Icon.Tag size={24} css={tw`text-blue-400`} strokeWidth={2.5} />
                                </IconWrapper>
                                <div>
                                    <h2 css={tw`text-lg font-bold text-white`}>Identity</h2>
                                    <p css={tw`text-xs text-neutral-500 font-bold`}>Basic identification details</p>
                                </div>
                            </div>
                            <div css={tw`space-y-6`}>
                                <div>
                                    <InputLabel>Server Name</InputLabel>
                                    <Field
                                        name={'name'}
                                        css={tw`bg-neutral-900 bg-opacity-50 border-neutral-700 focus:border-blue-500 rounded-sm h-12 text-sm px-4 font-bold tracking-wide`}
                                    />
                                </div>
                                <div>
                                    <InputLabel>Description</InputLabel>
                                    <Field
                                        name={'description'}
                                        css={tw`bg-neutral-900 bg-opacity-50 border-neutral-700 focus:border-blue-500 rounded-sm h-12 text-sm px-4 font-bold tracking-wide`}
                                    />
                                </div>
                            </div>
                        </PremiumBox>

                        <PremiumBox
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <div css={tw`flex items-center mb-8`}>
                                <IconWrapper>
                                    <Icon.Cpu size={24} css={tw`text-blue-400`} strokeWidth={2.5} />
                                </IconWrapper>
                                <div>
                                    <h2 css={tw`text-lg font-bold text-white`}>Core Power</h2>
                                    <p css={tw`text-xs text-neutral-500 font-bold`}>Resource allocation pool</p>
                                </div>
                            </div>
                            <div css={tw`grid grid-cols-3 gap-4`}>
                                <div>
                                    <InputLabel>CPU (%)</InputLabel>
                                    <Field
                                        name={'cpu'}
                                        type={'number'}
                                        css={tw`bg-neutral-900 bg-opacity-50 border-neutral-700 focus:border-blue-500 rounded-sm h-12 text-sm px-4 font-black tabular-nums tracking-tighter`}
                                    />
                                </div>
                                <div>
                                    <InputLabel>RAM (MB)</InputLabel>
                                    <Field
                                        name={'memory'}
                                        type={'number'}
                                        css={tw`bg-neutral-900 bg-opacity-50 border-neutral-700 focus:border-blue-500 rounded-sm h-12 text-sm px-4 font-black tabular-nums tracking-tighter`}
                                    />
                                </div>
                                <div>
                                    <InputLabel>Disk (MB)</InputLabel>
                                    <Field
                                        name={'disk'}
                                        type={'number'}
                                        css={tw`bg-neutral-900 bg-opacity-50 border-neutral-700 focus:border-blue-500 rounded-sm h-12 text-sm px-4 font-black tabular-nums tracking-tighter`}
                                    />
                                </div>
                            </div>
                            <PoolInfo>
                                <span>
                                    Available: <b>{resources.cpu}%</b> CPU
                                </span>
                                <span>
                                    Available: <b>{resources.memory}MB</b> RAM
                                </span>
                                <span>
                                    Available: <b>{resources.disk}MB</b> Disk
                                </span>
                            </PoolInfo>
                        </PremiumBox>
                    </div>

                    <div css={tw`grid grid-cols-1 lg:grid-cols-2 gap-8`}>
                        <PremiumBox
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <div css={tw`flex items-center mb-8`}>
                                <IconWrapper>
                                    <Icon.Layers size={24} css={tw`text-blue-400`} strokeWidth={2.5} />
                                </IconWrapper>
                                <div>
                                    <h2 css={tw`text-lg font-bold text-white`}>Capabilities</h2>
                                    <p css={tw`text-xs text-neutral-500 font-bold`}>Feature set allocation</p>
                                </div>
                            </div>
                            <div css={tw`grid grid-cols-3 gap-4`}>
                                <div>
                                    <InputLabel>Ports</InputLabel>
                                    <Field
                                        name={'ports'}
                                        type={'number'}
                                        css={tw`bg-neutral-900 bg-opacity-50 border-neutral-700 focus:border-blue-500 rounded-sm h-12 text-sm px-4 font-black tabular-nums`}
                                    />
                                </div>
                                <div>
                                    <InputLabel>DBs</InputLabel>
                                    <Field
                                        name={'databases'}
                                        type={'number'}
                                        css={tw`bg-neutral-900 bg-opacity-50 border-neutral-700 focus:border-blue-500 rounded-sm h-12 text-sm px-4 font-black tabular-nums`}
                                    />
                                </div>
                                <div>
                                    <InputLabel>Backups</InputLabel>
                                    <Field
                                        name={'backups'}
                                        type={'number'}
                                        css={tw`bg-neutral-900 bg-opacity-50 border-neutral-700 focus:border-blue-500 rounded-sm h-12 text-sm px-4 font-black tabular-nums`}
                                    />
                                </div>
                            </div>
                            <PoolInfo>
                                <span>
                                    Available: <b>{resources.ports}</b> Ports
                                </span>
                                <span>
                                    Available: <b>{resources.databases}</b> DBs
                                </span>
                                <span>
                                    Available: <b>{resources.backups}</b> Backups
                                </span>
                            </PoolInfo>
                        </PremiumBox>

                        <PremiumBox
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                        >
                            <div css={tw`flex items-center mb-8`}>
                                <IconWrapper>
                                    <Icon.Grid size={24} css={tw`text-blue-400`} strokeWidth={2.5} />
                                </IconWrapper>
                                <div>
                                    <h2 css={tw`text-lg font-bold text-white`}>Infrastructure</h2>
                                    <p css={tw`text-xs text-neutral-500 font-bold`}>Deployment location & type</p>
                                </div>
                            </div>
                            <div css={tw`grid grid-cols-2 gap-4 mb-4`}>
                                <div>
                                    <InputLabel>Target Node</InputLabel>
                                    <Select
                                        name={'node'}
                                        onChange={(e) => setNode(parseInt(e.target.value))}
                                        css={tw`bg-neutral-900 bg-opacity-50 border-neutral-700 focus:border-blue-500 rounded-sm h-12 text-xs px-4 font-bold`}
                                    >
                                        {!node && <option>Select a node...</option>}
                                        {nodes.map((n) => (
                                            <option key={n.id} value={n.id}>
                                                {n.name} | {100 - parseInt(((n?.used / n?.total) * 100).toFixed(0))}%
                                                FREE
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                                <div>
                                    <InputLabel>Environment</InputLabel>
                                    <Select
                                        name={'nest'}
                                        onChange={(e) => changeNest(e)}
                                        css={tw`bg-neutral-900 bg-opacity-50 border-neutral-700 focus:border-blue-500 rounded-sm h-12 text-xs px-4 font-bold`}
                                    >
                                        {!nest && <option>Select a nest...</option>}
                                        {nests.map((n) => (
                                            <option key={n.id} value={n.id}>
                                                {n.name}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            <div css={tw`w-full grid grid-cols-1 sm:grid-cols-2 gap-4`}>
                                <div>
                                    <InputLabel>Application</InputLabel>
                                    <Select
                                        name={'egg'}
                                        onChange={(e) => setEgg(parseInt(e.target.value))}
                                        css={tw`bg-neutral-900 bg-opacity-50 border-neutral-700 focus:border-blue-500 rounded-sm h-12 text-xs px-4 font-bold uppercase tracking-wider`}
                                    >
                                        {!egg && <option>Select an egg...</option>}
                                        {eggs.map((e) => (
                                            <option key={e.id} value={e.id}>
                                                {e.name}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                                <div>
                                    <InputLabel>Deployment Fee</InputLabel>
                                    <div
                                        css={tw`bg-neutral-900 bg-opacity-50 border border-neutral-700 rounded-sm h-12 flex items-center px-4 font-black text-blue-400 text-sm`}
                                    >
                                        <Icon.CreditCard size={14} css={tw`mr-2 text-neutral-500`} />
                                        {nodes?.find((n) => n.id === node)?.deployFee || 0} Credits
                                    </div>
                                </div>
                            </div>
                        </PremiumBox>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        css={tw`bg-blue-600 bg-opacity-5 backdrop-blur-xl border border-blue-500 border-opacity-50 p-10 rounded-sm flex flex-col lg:flex-row items-center justify-between mt-12 relative overflow-hidden`}
                    >
                        <div
                            css={tw`absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500 bg-opacity-10 blur-3xl rounded-full`}
                        />
                        <div css={tw`mb-8 lg:mb-0 text-center lg:text-left relative z-10`}>
                            <h2 css={tw`text-3xl font-black text-white mb-2`}>Ready for Launch</h2>
                            <p css={tw`text-neutral-500 text-xs font-bold`}>
                                Initialize your high-performance environment now
                                {nodes?.find((n) => n.id === node)?.deployFee ? (
                                    <span css={tw`text-blue-400 ml-2 animate-pulse`}>
                                        (Fee: {nodes?.find((n) => n.id === node)?.deployFee} credits)
                                    </span>
                                ) : null}
                            </p>
                        </div>
                        <div css={tw`w-full lg:w-auto relative z-10`}>
                            <InputSpinner visible={loading}>
                                <Button
                                    type={'submit'}
                                    css={tw`w-full lg:px-20 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-5 rounded-sm transition-all shadow-xl active:scale-95`}
                                    size={Button.Sizes.Large}
                                    disabled={loading}
                                >
                                    <Icon.Zap size={18} css={tw`mr-3`} strokeWidth={3} /> Initialize Instance
                                </Button>
                            </InputSpinner>
                        </div>
                    </motion.div>
                </Form>
            </Formik>
        </PageContentBlock>
    );
};
