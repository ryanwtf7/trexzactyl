import tw from 'twin.macro';
import isEqual from 'react-fast-compare';
import useFlash from '@/plugins/useFlash';
import { httpErrorToHuman } from '@/api/http';
import { ServerContext } from '@/state/server';
import Input from '@/components/elements/Input';
import Select from '@/components/elements/Select';
import Spinner from '@/components/elements/Spinner';
import getServerStartup from '@/api/swr/getServerStartup';
import InputSpinner from '@/components/elements/InputSpinner';
import React, { useCallback, useEffect, useState } from 'react';
import { ServerError } from '@/components/elements/ScreenBlock';
import VariableBox from '@/components/server/startup/VariableBox';
import { useDeepCompareEffect } from '@/plugins/useDeepCompareEffect';
import setSelectedDockerImage from '@/api/server/setSelectedDockerImage';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import styled from 'styled-components/macro';
import * as Icon from 'react-feather';

import GlassCard from '@/components/elements/GlassCard';

const InvocationCard = styled(GlassCard)`
    ${tw`p-6 relative overflow-hidden`};
`;

const DockerCard = styled(GlassCard)`
    ${tw`p-6`};
`;

const CodeBlock = styled.p`
    ${tw`font-mono font-bold text-xs bg-black/40 text-blue-300 p-4 rounded-lg border border-white/5 break-all shadow-inner`};
`;

const StartupContainer = () => {
    const [loading, setLoading] = useState(false);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const variables = ServerContext.useStoreState(
        ({ server }) => ({
            variables: server.data!.variables,
            invocation: server.data!.invocation,
            dockerImage: server.data!.dockerImage,
        }),
        isEqual
    );

    const { data, error, isValidating, mutate } = getServerStartup(uuid, {
        ...variables,
        dockerImages: { [variables.dockerImage]: variables.dockerImage },
    });

    const setServerFromState = ServerContext.useStoreActions((actions) => actions.server.setServerFromState);
    const isCustomImage =
        data &&
        !Object.values(data.dockerImages)
            .map((v) => v.toLowerCase())
            .includes(variables.dockerImage.toLowerCase());

    useEffect(() => {
        mutate();
    }, []);

    useDeepCompareEffect(() => {
        if (!data) return;
        setServerFromState((s) => ({
            ...s,
            invocation: data.invocation,
            variables: data.variables,
        }));
    }, [data]);

    const updateSelectedDockerImage = useCallback(
        (v: React.ChangeEvent<HTMLSelectElement>) => {
            setLoading(true);
            clearFlashes('startup:image');
            const image = v.currentTarget.value;
            setSelectedDockerImage(uuid, image)
                .then(() => setServerFromState((s) => ({ ...s, dockerImage: image })))
                .catch((error) => {
                    console.error(error);
                    clearAndAddHttpError({ key: 'startup:image', error });
                })
                .then(() => setLoading(false));
        },
        [uuid]
    );

    return !data ? (
        !error || (error && isValidating) ? (
            <Spinner centered size={Spinner.Size.LARGE} />
        ) : (
            <ServerError title={'Oops!'} message={httpErrorToHuman(error)} onRetry={() => mutate()} />
        )
    ) : (
        <ServerContentBlock title={'Startup'}>
            <div css={tw`grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12`}>
                <InvocationCard css={tw`lg:col-span-2`}>
                    <div css={tw`flex items-center gap-3 mb-4`}>
                        <div css={tw`p-2 rounded-lg bg-blue-500/10 text-blue-400`}>
                            <Icon.Terminal size={18} />
                        </div>
                        <div>
                            <h3 css={tw`text-sm font-black text-neutral-100 uppercase tracking-widest`}>
                                Startup Command
                            </h3>
                            <p css={tw`text-[10px] text-neutral-500 font-bold uppercase`}>
                                Immutable dynamic execution string
                            </p>
                        </div>
                    </div>
                    <CodeBlock>{data.invocation}</CodeBlock>
                    <div css={tw`absolute top-0 right-0 p-4 opacity-5`}>
                        <Icon.Terminal size={120} />
                    </div>
                </InvocationCard>

                <DockerCard>
                    <div css={tw`flex items-center gap-3 mb-4`}>
                        <div css={tw`p-2 rounded-lg bg-blue-500/10 text-blue-400`}>
                            <Icon.Box size={18} />
                        </div>
                        <div>
                            <h3 css={tw`text-sm font-black text-neutral-100 uppercase tracking-widest`}>
                                Docker Image
                            </h3>
                            <p css={tw`text-[10px] text-neutral-500 font-bold uppercase`}>Virtualization environment</p>
                        </div>
                    </div>
                    {Object.keys(data.dockerImages).length > 1 && !isCustomImage ? (
                        <>
                            <InputSpinner visible={loading}>
                                <Select
                                    disabled={Object.keys(data.dockerImages).length < 2}
                                    onChange={updateSelectedDockerImage}
                                    defaultValue={variables.dockerImage}
                                    css={tw`bg-neutral-800/50 border-neutral-700 focus:border-blue-500`}
                                >
                                    {Object.keys(data.dockerImages).map((key) => (
                                        <option key={data.dockerImages[key]} value={data.dockerImages[key]}>
                                            {key}
                                        </option>
                                    ))}
                                </Select>
                            </InputSpinner>
                            <p css={tw`text-[10px] text-neutral-500 mt-3 font-medium leading-relaxed`}>
                                Switch between available docker tags for this egg.
                            </p>
                        </>
                    ) : (
                        <>
                            <Input
                                disabled
                                readOnly
                                value={variables.dockerImage}
                                css={tw`bg-neutral-800/50 border-neutral-700 opacity-50`}
                            />
                            {isCustomImage && (
                                <p css={tw`text-[10px] text-yellow-500/80 mt-3 font-bold uppercase tracking-tight`}>
                                    Locked: Set by Administrator
                                </p>
                            )}
                        </>
                    )}
                </DockerCard>
            </div>

            <div css={tw`flex items-center gap-3 mb-6`}>
                <div
                    css={tw`px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest`}
                >
                    Configuration Variables
                </div>
                <div css={tw`h-px bg-neutral-800 flex-1`} />
            </div>

            <div className={'grid gap-6 md:grid-cols-2 lg:grid-cols-3'}>
                {data.variables.map((variable) => (
                    <VariableBox key={variable.envVariable} variable={variable} />
                ))}
            </div>
        </ServerContentBlock>
    );
};

export default StartupContainer;
