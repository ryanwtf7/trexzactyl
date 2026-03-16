import tw from 'twin.macro';
import * as Icon from 'react-feather';
import React, { useState } from 'react';
import { useStoreState } from 'easy-peasy';
import Can from '@/components/elements/Can';
import { Subuser } from '@/state/server/subusers';
import EditSubuserModal from '@/components/server/users/EditSubuserModal';
import RemoveSubuserButton from '@/components/server/users/RemoveSubuserButton';
import styled from 'styled-components/macro';

const UserCard = styled.div`
    ${tw`flex flex-wrap md:flex-nowrap items-center p-4 rounded-sm border border-neutral-700 bg-neutral-900 bg-opacity-40 backdrop-blur-xl mb-3 transition-all duration-300`};
    ${tw`hover:border-blue-500 border-opacity-50 hover:shadow-lg hover:-translate-y-0.5`};
`;

const Avatar = styled.div`
    ${tw`w-12 h-12 rounded-sm bg-neutral-800 border-2 border-neutral-700 overflow-hidden hidden md:block group-hover:border-blue-500 border-opacity-50 transition-colors duration-200`};
`;

const InfoBlock = styled.div`
    ${tw`flex flex-col ml-4 flex-1 overflow-hidden`};
`;

export default ({ subuser }: { subuser: Subuser }) => {
    const uuid = useStoreState((state) => state.user!.data!.uuid);
    const [visible, setVisible] = useState(false);

    return (
        <UserCard className={'group'}>
            <EditSubuserModal subuser={subuser} visible={visible} onModalDismissed={() => setVisible(false)} />
            <Avatar>
                <img css={tw`w-full h-full object-cover`} src={`${subuser.image}?s=400`} />
            </Avatar>
            <InfoBlock>
                <p
                    css={tw`font-bold text-neutral-100 group-hover:text-blue-400 transition-colors duration-200 truncate`}
                >
                    {subuser.email}
                </p>
                <div css={tw`flex items-center gap-3 mt-1`}>
                    <div css={tw`flex items-center gap-1 text-xs text-neutral-500`}>
                        <Icon.Shield size={10} />
                        {subuser.permissions.filter((permission) => permission !== 'websocket.connect').length}{' '}
                        Permissions
                    </div>
                </div>
            </InfoBlock>

            <div css={tw`ml-4 flex flex-col items-center`}>
                <div
                    css={[
                        tw`p-2 rounded-sm bg-neutral-800 text-neutral-400 group-hover:bg-blue-500 bg-opacity-10 transition-colors duration-200`,
                        subuser.twoFactorEnabled && tw`text-green-400`,
                    ]}
                >
                    {subuser.twoFactorEnabled ? <Icon.Lock size={16} /> : <Icon.Unlock size={16} />}
                </div>
                <p css={tw`text-xs text-neutral-500 uppercase font-black mt-1`}>2FA Security</p>
            </div>

            {subuser.uuid !== uuid && (
                <div css={tw`ml-6 flex items-center gap-2`}>
                    <Can action={'user.update'}>
                        <button
                            type={'button'}
                            css={tw`p-2 rounded-sm bg-blue-500 bg-opacity-10 text-blue-400`}
                            onClick={() => setVisible(true)}
                        >
                            <Icon.Settings size={18} />
                        </button>
                    </Can>
                    <Can action={'user.delete'}>
                        <RemoveSubuserButton subuser={subuser} />
                    </Can>
                </div>
            )}
        </UserCard>
    );
};
