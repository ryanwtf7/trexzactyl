import tw from 'twin.macro';
import classNames from 'classnames';
import { object, string } from 'yup';
import * as Icon from 'react-feather';
import React, { useState } from 'react';
import useFlash from '@/plugins/useFlash';
import Can from '@/components/elements/Can';
import { httpErrorToHuman } from '@/api/http';
import { ServerContext } from '@/state/server';
import Modal from '@/components/elements/Modal';
import Field from '@/components/elements/Field';
import Label from '@/components/elements/Label';
import Input from '@/components/elements/Input';
import { Form, Formik, FormikHelpers } from 'formik';
import { Button } from '@/components/elements/button/index';
import CopyOnClick from '@/components/elements/CopyOnClick';
import FlashMessageRender from '@/components/FlashMessageRender';
import { ServerDatabase } from '@/api/server/databases/getServerDatabases';
import deleteServerDatabase from '@/api/server/databases/deleteServerDatabase';
import RotatePasswordButton from '@/components/server/databases/RotatePasswordButton';
import styled from 'styled-components/macro';

const DatabaseCard = styled.div`
    ${tw`flex flex-wrap md:flex-nowrap items-center p-4 rounded-sm border border-neutral-700 bg-neutral-900 bg-opacity-40 backdrop-blur-xl mb-3 transition-all duration-300`};
    ${tw`hover:border-blue-500 border-opacity-50 hover:shadow-lg hover:-translate-y-0.5`};
`;

const IconWrapper = styled.div`
    ${tw`flex-none p-2.5 rounded-sm bg-blue-500 bg-opacity-10 text-blue-400 transition-colors group-hover:bg-blue-500 group-hover:text-white`};
`;

const StatBlock = styled.div`
    ${tw`ml-8 text-center hidden md:block`};
`;

const DetailText = styled.p`
    ${tw`text-xs font-bold text-neutral-100 font-mono tracking-tight`};
`;

const DetailLabel = styled.p`
    ${tw`mt-1 text-xs text-neutral-500 uppercase font-black tracking-wider select-none`};
`;

const DatabaseRow = ({ database, className }: { database: ServerDatabase; className?: string }) => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const { addError, clearFlashes } = useFlash();
    const [visible, setVisible] = useState(false);
    const [connectionVisible, setConnectionVisible] = useState(false);
    const appendDatabase = ServerContext.useStoreActions((actions) => actions.databases.appendDatabase);
    const removeDatabase = ServerContext.useStoreActions((actions) => actions.databases.removeDatabase);

    const jdbcConnectionString = `jdbc:mysql://${database.username}${
        database.password ? `:${encodeURIComponent(database.password)}` : ''
    }@${database.connectionString}/${database.name}`;

    const schema = object().shape({
        confirm: string()
            .required()
            .oneOf([database.name.split('_', 2)[1], database.name]),
    });

    const submit = (values: { confirm: string }, { setSubmitting }: FormikHelpers<{ confirm: string }>) => {
        clearFlashes();
        deleteServerDatabase(uuid, database.id)
            .then(() => {
                setVisible(false);
                setTimeout(() => removeDatabase(database.id), 150);
            })
            .catch((error) => {
                console.error(error);
                setSubmitting(false);
                addError({ key: 'database:delete', message: httpErrorToHuman(error) });
            });
    };

    return (
        <>
            <Formik onSubmit={submit} initialValues={{ confirm: '' }} validationSchema={schema} isInitialValid={false}>
                {({ isSubmitting, isValid, resetForm }) => (
                    <Modal
                        visible={visible}
                        dismissable={!isSubmitting}
                        showSpinnerOverlay={isSubmitting}
                        onDismissed={() => {
                            setVisible(false);
                            resetForm();
                        }}
                    >
                        <FlashMessageRender byKey={'database:delete'} css={tw`mb-6`} />
                        <h2 css={tw`text-2xl mb-6`}>Confirm database deletion</h2>
                        <p css={tw`text-sm`}>
                            Deleting a database is a permanent action, it cannot be undone. This will permanently delete
                            the <strong>{database.name}</strong> database and remove all associated data.
                        </p>
                        <Form css={tw`m-0 mt-6`}>
                            <Field
                                type={'text'}
                                id={'confirm_name'}
                                name={'confirm'}
                                label={'Confirm Database Name'}
                                description={'Enter the database name to confirm deletion.'}
                            />
                            <div css={tw`mt-6 text-right`}>
                                <Button
                                    type={'button'}
                                    variant={Button.Variants.Secondary}
                                    css={tw`mr-2`}
                                    onClick={() => setVisible(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type={'submit'} color={'red'} disabled={!isValid}>
                                    Delete Database
                                </Button>
                            </div>
                        </Form>
                    </Modal>
                )}
            </Formik>

            <Modal visible={connectionVisible} onDismissed={() => setConnectionVisible(false)}>
                <div css={tw`flex items-center gap-3 mb-6`}>
                    <div css={tw`p-2 rounded-sm bg-blue-500 bg-opacity-10 text-blue-400`}>
                        <Icon.Terminal size={18} />
                    </div>
                    <h3 css={tw`text-xl font-black text-neutral-100 uppercase tracking-wider`}>Connection Details</h3>
                </div>
                <div className={'space-y-6'}>
                    <div>
                        <Label>Endpoint</Label>
                        <CopyOnClick text={database.connectionString}>
                            <Input
                                type={'text'}
                                readOnly
                                value={database.connectionString}
                                css={tw`bg-neutral-800 bg-opacity-50 border-neutral-700`}
                            />
                        </CopyOnClick>
                    </div>
                    <div>
                        <Label>Username</Label>
                        <CopyOnClick text={database.username}>
                            <Input
                                type={'text'}
                                readOnly
                                value={database.username}
                                css={tw`bg-neutral-800 bg-opacity-50 border-neutral-700`}
                            />
                        </CopyOnClick>
                    </div>
                    <Can action={'database.view_password'}>
                        <div>
                            <Label>Password</Label>
                            <CopyOnClick text={database.password}>
                                <Input
                                    type={'text'}
                                    readOnly
                                    value={database.password}
                                    css={tw`bg-neutral-800 bg-opacity-50 border-neutral-700`}
                                />
                            </CopyOnClick>
                        </div>
                    </Can>
                    <div>
                        <Label>JDBC Connection String</Label>
                        <CopyOnClick text={jdbcConnectionString}>
                            <Input
                                type={'text'}
                                readOnly
                                value={jdbcConnectionString}
                                css={tw`bg-neutral-800 bg-opacity-50 border-neutral-700 font-mono text-xs`}
                            />
                        </CopyOnClick>
                    </div>
                </div>
                <div css={tw`mt-8 flex justify-end gap-3`}>
                    <Can action={'database.update'}>
                        <RotatePasswordButton databaseId={database.id} onUpdate={appendDatabase} />
                    </Can>
                    <Button variant={Button.Variants.Secondary} onClick={() => setConnectionVisible(false)}>
                        Close
                    </Button>
                </div>
            </Modal>

            <DatabaseCard className={classNames('group', className)}>
                <IconWrapper>
                    <Icon.Database size={18} />
                </IconWrapper>
                <div css={tw`flex-1 ml-4`}>
                    <CopyOnClick text={database.name}>
                        <p
                            css={tw`text-sm font-black text-neutral-100 uppercase tracking-wider group-hover:text-blue-400 transition-colors`}
                        >
                            {database.name}
                        </p>
                    </CopyOnClick>
                    <p css={tw`text-xs text-neutral-500 font-bold uppercase tracking-tight`}>
                        {database.connectionString}
                    </p>
                </div>

                <StatBlock>
                    <DetailText>{database.username}</DetailText>
                    <DetailLabel>Username</DetailLabel>
                </StatBlock>

                <div css={tw`ml-8 flex items-center gap-2`}>
                    <Button
                        variant={Button.Variants.Secondary}
                        css={tw`px-3 bg-neutral-800 bg-opacity-50 border-neutral-700`}
                        onClick={() => setConnectionVisible(true)}
                    >
                        <Icon.Eye size={16} />
                    </Button>
                    <Can action={'database.delete'}>
                        <Button.Danger
                            variant={Button.Variants.Secondary}
                            css={tw`px-3 bg-red-500 bg-opacity-10 border-red-500 border-opacity-20 text-red-400`}
                            onClick={() => setVisible(true)}
                        >
                            <Icon.Trash size={16} />
                        </Button.Danger>
                    </Can>
                </div>
            </DatabaseCard>
        </>
    );
};

export default DatabaseRow;
