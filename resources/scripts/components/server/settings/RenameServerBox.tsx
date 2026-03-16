import React from 'react';
import tw from 'twin.macro';
import { object, string } from 'yup';
import { ApplicationStore } from '@/state';
import { httpErrorToHuman } from '@/api/http';
import { ServerContext } from '@/state/server';
import Field from '@/components/elements/Field';
import Label from '@/components/elements/Label';
import renameServer from '@/api/server/renameServer';
import { Actions, useStoreActions } from 'easy-peasy';
import { Textarea } from '@/components/elements/Input';
import { Button } from '@/components/elements/button/index';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import FormikFieldWrapper from '@/components/elements/FormikFieldWrapper';
import { Field as FormikField, Form, Formik, FormikHelpers, useFormikContext } from 'formik';
import styled from 'styled-components/macro';
import * as Icon from 'react-feather';

const Card = styled.div`
    ${tw`p-6 rounded-xl border border-neutral-700 bg-neutral-900 bg-opacity-50 backdrop-blur-md relative overflow-hidden`};
`;

const StyledTextarea = styled(Textarea)`
    ${tw`bg-neutral-800 bg-opacity-50 border-neutral-700 focus:border-blue-500 transition-all duration-200 text-sm`};
`;

const RenameServerBox = () => {
    const { isSubmitting } = useFormikContext<Values>();

    return (
        <Card>
            <SpinnerOverlay visible={isSubmitting} />
            <div css={tw`flex items-center gap-3 mb-6`}>
                <div css={tw`p-2 rounded-lg bg-blue-500 bg-opacity-10 text-blue-400`}>
                    <Icon.Edit2 size={18} />
                </div>
                <div>
                    <h3 css={tw`text-sm font-black text-neutral-100 uppercase tracking-wider`}>Update Details</h3>
                    <p css={tw`text-xs text-neutral-500 font-bold uppercase`}>Name and description</p>
                </div>
            </div>

            <Form css={tw`mb-0`}>
                <Field
                    id={'name'}
                    name={'name'}
                    label={'Server Name'}
                    type={'text'}
                    css={tw`bg-neutral-800 bg-opacity-50 border-neutral-700 focus:border-blue-500`}
                />
                <div css={tw`mt-6`}>
                    <Label css={tw`text-xs font-black text-neutral-500 uppercase tracking-wider mb-2 block`}>
                        Server Description
                    </Label>
                    <FormikFieldWrapper name={'description'}>
                        <FormikField
                            as={StyledTextarea}
                            name={'description'}
                            rows={3}
                            placeholder={'Add a description for this server...'}
                        />
                    </FormikFieldWrapper>
                </div>
                <div css={tw`mt-8 flex justify-end`}>
                    <Button type={'submit'} css={tw`px-8`}>
                        Save Changes
                    </Button>
                </div>
            </Form>
        </Card>
    );
};

interface Values {
    name: string;
    description: string;
}

export default () => {
    const server = ServerContext.useStoreState((state) => state.server.data!);
    const setServer = ServerContext.useStoreActions((actions) => actions.server.setServer);
    const { addError, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const submit = ({ name, description }: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes('settings');
        renameServer(server.uuid, name, description)
            .then(() => setServer({ ...server, name, description }))
            .catch((error) => {
                console.error(error);
                addError({ key: 'settings', message: httpErrorToHuman(error) });
            })
            .then(() => setSubmitting(false));
    };

    return (
        <Formik
            onSubmit={submit}
            initialValues={{
                name: server.name ?? '',
                description: server.description ?? '',
            }}
            validationSchema={object().shape({
                name: string().required().min(1),
                description: string().nullable(),
            })}
        >
            <RenameServerBox />
        </Formik>
    );
};
