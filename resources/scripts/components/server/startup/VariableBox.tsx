import tw from 'twin.macro';
import { debounce } from 'debounce';
import isEqual from 'react-fast-compare';
import useFlash from '@/plugins/useFlash';
import React, { memo, useState } from 'react';
import { ServerContext } from '@/state/server';
import Input from '@/components/elements/Input';
import Switch from '@/components/elements/Switch';
import Select from '@/components/elements/Select';
import { ServerEggVariable } from '@/api/server/types';
import { usePermissions } from '@/plugins/usePermissions';
import getServerStartup from '@/api/swr/getServerStartup';
import InputSpinner from '@/components/elements/InputSpinner';
import FlashMessageRender from '@/components/FlashMessageRender';
import updateStartupVariable from '@/api/server/updateStartupVariable';
import styled from 'styled-components/macro';
import * as Icon from 'react-feather';

import GlassCard from '@/components/elements/GlassCard';

const VariableCard = styled(GlassCard)`
    ${tw`p-6 transition-all duration-300`};
`;

const Badge = styled.span`
    ${tw`bg-neutral-800 text-neutral-500 text-xs py-0.5 px-2 rounded-full font-black uppercase tracking-wider mr-2`};
`;

const VariableBox = ({ variable }: { variable: ServerEggVariable }) => {
    const FLASH_KEY = `server:startup:${variable.envVariable}`;
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const [loading, setLoading] = useState(false);
    const [canEdit] = usePermissions(['startup.update']);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { mutate } = getServerStartup(uuid);

    const setVariableValue = debounce((value: string) => {
        setLoading(true);
        clearFlashes(FLASH_KEY);
        updateStartupVariable(uuid, variable.envVariable, value)
            .then(([response, invocation]) =>
                mutate(
                    (data) => ({
                        ...data,
                        invocation,
                        variables: (data.variables || []).map((v) =>
                            v.envVariable === response.envVariable ? response : v
                        ),
                    }),
                    false
                )
            )
            .catch((error) => {
                console.error(error);
                clearAndAddHttpError({ error, key: FLASH_KEY });
            })
            .then(() => setLoading(false));
    }, 500);

    const useSwitch = variable.rules.some(
        (v) => v === 'boolean' || v === 'in:0,1' || v === 'in:1,0' || v === 'in:true,false' || v === 'in:false,true'
    );
    const isStringSwitch = variable.rules.some((v) => v === 'string');
    const selectValues = variable.rules.find((v) => v.startsWith('in:'))?.split(',') || [];

    return (
        <VariableCard className={'group'}>
            <div css={tw`flex items-center justify-between mb-4`}>
                <div css={tw`flex items-center`}>
                    {!variable.isEditable && <Badge>Read Only</Badge>}
                    <h4
                        css={tw`text-xs font-black text-neutral-400 uppercase tracking-wider group-hover:text-blue-400 transition-colors`}
                    >
                        {variable.name}
                    </h4>
                </div>
                <div
                    css={tw`font-mono text-xs text-neutral-600 font-bold bg-neutral-800 bg-opacity-50 px-2 py-0.5 rounded`}
                >
                    {variable.envVariable}
                </div>
            </div>

            <FlashMessageRender byKey={FLASH_KEY} css={tw`mb-4`} />

            <InputSpinner visible={loading}>
                {useSwitch ? (
                    <div css={tw`flex items-center gap-3`}>
                        <Switch
                            readOnly={!canEdit || !variable.isEditable}
                            name={variable.envVariable}
                            defaultChecked={
                                isStringSwitch ? variable.serverValue === 'true' : variable.serverValue === '1'
                            }
                            onChange={() => {
                                if (canEdit && variable.isEditable) {
                                    if (isStringSwitch) {
                                        setVariableValue(variable.serverValue === 'true' ? 'false' : 'true');
                                    } else {
                                        setVariableValue(variable.serverValue === '1' ? '0' : '1');
                                    }
                                }
                            }}
                        />
                        <span css={tw`text-xs text-neutral-500 font-medium`}>
                            {variable.serverValue === '1' || variable.serverValue === 'true' ? 'Enabled' : 'Disabled'}
                        </span>
                    </div>
                ) : (
                    <>
                        {selectValues.length > 0 ? (
                            <Select
                                onChange={(e) => setVariableValue(e.target.value)}
                                name={variable.envVariable}
                                defaultValue={variable.serverValue}
                                disabled={!canEdit || !variable.isEditable}
                                css={tw`bg-neutral-800 bg-opacity-50 border-neutral-700 focus:border-blue-500`}
                            >
                                {selectValues.map((selectValue) => (
                                    <option key={selectValue.replace('in:', '')} value={selectValue.replace('in:', '')}>
                                        {selectValue.replace('in:', '')}
                                    </option>
                                ))}
                            </Select>
                        ) : (
                            <Input
                                onKeyUp={(e) => {
                                    if (canEdit && variable.isEditable) {
                                        setVariableValue(e.currentTarget.value);
                                    }
                                }}
                                readOnly={!canEdit || !variable.isEditable}
                                name={variable.envVariable}
                                defaultValue={variable.serverValue}
                                placeholder={variable.defaultValue}
                                css={tw`bg-neutral-800 bg-opacity-50 border-neutral-700 focus:border-blue-500`}
                            />
                        )}
                    </>
                )}
            </InputSpinner>
            <div css={tw`mt-4 flex gap-2`}>
                <Icon.Info size={12} css={tw`text-neutral-500 mt-0.5 flex-none`} />
                <p css={tw`text-xs text-neutral-500 leading-relaxed`}>{variable.description}</p>
            </div>
        </VariableCard>
    );
};

export default memo(VariableBox, isEqual);
