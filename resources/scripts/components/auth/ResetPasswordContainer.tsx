import tw from 'twin.macro';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { object, ref, string } from 'yup';
import { ApplicationStore } from '@/state';
import { httpErrorToHuman } from '@/api/http';
import { Formik, FormikHelpers } from 'formik';
import Field from '@/components/elements/Field';
import Label from '@/components/elements/Label';
import Input from '@/components/elements/Input';
import { RouteComponentProps } from 'react-router';
import { Actions, useStoreActions } from 'easy-peasy';
import { Button } from '@/components/elements/button/index';
import performPasswordReset from '@/api/auth/performPasswordReset';
import LoginFormContainer from '@/components/auth/LoginFormContainer';

interface Values {
    password: string;
    passwordConfirmation: string;
}

export default ({ match, location }: RouteComponentProps<{ token: string }>) => {
    const [email, setEmail] = useState('');

    const { clearFlashes, addFlash } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const parsed = new URLSearchParams(location.search);
    if (email.length === 0 && parsed.get('email')) {
        setEmail(parsed.get('email') || '');
    }

    const submit = ({ password, passwordConfirmation }: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();
        performPasswordReset(email, { token: match.params.token, password, passwordConfirmation })
            .then(() => {
                // @ts-expect-error this is valid
                window.location = '/';
            })
            .catch((error) => {
                console.error(error);

                setSubmitting(false);
                addFlash({ type: 'danger', title: 'Error', message: httpErrorToHuman(error) });
            });
    };

    return (
        <Formik
            onSubmit={submit}
            initialValues={{
                password: '',
                passwordConfirmation: '',
            }}
            validationSchema={object().shape({
                password: string()
                    .required('A new password is required.')
                    .min(8, 'Your new password should be at least 8 characters in length.'),
                passwordConfirmation: string()
                    .required('Your new password does not match.')
                    // @ts-expect-error this is valid
                    .oneOf([ref('password'), null], 'Your new password does not match.'),
            })}
        >
            {({ isSubmitting }) => (
                <LoginFormContainer title={'Reset Password'} css={tw`w-full flex`}>
                    <div css={tw`mb-4`}>
                        <Label isLight>Email Address</Label>
                        <Input value={email} isLight disabled css={tw`opacity-50 cursor-not-allowed`} />
                    </div>
                    <div css={tw`mt-6`}>
                        <Field
                            light
                            label={'New Password'}
                            name={'password'}
                            type={'password'}
                            description={'Passwords must be at least 8 characters in length.'}
                        />
                    </div>
                    <div css={tw`mt-6`}>
                        <Field light label={'Confirm New Password'} name={'passwordConfirmation'} type={'password'} />
                    </div>
                    <div css={tw`mt-8`}>
                        <Button
                            size={Button.Sizes.Large}
                            css={tw`w-full bg-blue-500 bg-opacity-10 text-blue-400 border border-blue-500 border-opacity-20 hover:bg-blue-500 bg-opacity-20 rounded-2xl transition-all duration-300 font-black uppercase tracking-wider text-xs py-4`}
                            type={'submit'}
                            disabled={isSubmitting}
                        >
                            Reset Password
                        </Button>
                    </div>
                    <div css={tw`mt-10 text-center`}>
                        <Link
                            to={'/auth/login'}
                            css={tw`text-xs text-neutral-500 font-black tracking-wider no-underline uppercase hover:text-neutral-300 transition-colors`}
                        >
                            Return to Login
                        </Link>
                    </div>
                </LoginFormContainer>
            )}
        </Formik>
    );
};
