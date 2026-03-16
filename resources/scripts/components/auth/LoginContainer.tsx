import tw from 'twin.macro';
import Reaptcha from 'reaptcha';
import login from '@/api/auth/login';
import { Mail, MessageSquare } from 'react-feather';
import { object, string } from 'yup';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { Formik, FormikHelpers } from 'formik';
import Field from '@/components/elements/Field';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/elements/button/index';
import { Link, RouteComponentProps } from 'react-router-dom';
import FlashMessageRender from '@/components/FlashMessageRender';
import LoginFormContainer from '@/components/auth/LoginFormContainer';

interface Values {
    username: string;
    password: string;
}

const LoginContainer = ({ history, location }: RouteComponentProps) => {
    const ref = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');
    const name = useStoreState((state) => state.settings.data?.name);
    const { clearFlashes, addFlash, clearAndAddHttpError } = useFlash();
    const { email, discord } = useStoreState(
        (state) => state.settings.data?.registration || { email: false, discord: false }
    );
    const { enabled: recaptchaEnabled, siteKey } = useStoreState(
        (state) => state.settings.data?.recaptcha || { enabled: false, siteKey: '' }
    );

    useEffect(() => {
        clearFlashes();

        const state = (location.state as any) || {};

        if (state.invalidToken) {
            addFlash({
                type: 'danger',
                message: 'The token provided is invalid or has expired. Please try logging in again.',
            });
        }
    }, [location]);

    const onSubmit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();

        // If there is no token in the state yet, request the token and then abort this submit request
        // since it will be re-submitted when the recaptcha data is returned by the component.
        if (recaptchaEnabled && !token) {
            ref.current!.execute().catch((error) => {
                console.error(error);

                setSubmitting(false);
                clearAndAddHttpError({ error });
            });

            return;
        }

        login({ username: values.username, password: values.password, recaptchaData: token })
            .then((response) => {
                if (response.complete) {
                    // @ts-expect-error this is valid
                    window.location = response.intended || '/';
                    return;
                }

                history.replace('/auth/login/checkpoint', { token: response.confirmationToken });
            })
            .catch((error) => {
                console.error(error);

                setToken('');
                if (ref.current) ref.current.reset();

                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
    };

    return (
        <Formik
            onSubmit={onSubmit}
            initialValues={{ username: '', password: '' }}
            validationSchema={object().shape({
                username: string().required('A username or email address must be provided.'),
                password: string().required('Please enter your account password.'),
            })}
        >
            {({ isSubmitting, setSubmitting, submitForm }) => (
                <LoginFormContainer title={'Login to ' + name} css={tw`w-full flex`}>
                    <FlashMessageRender css={tw`mb-4`} />
                    <Field light type={'text'} label={'Username or Email'} name={'username'} disabled={isSubmitting} />
                    <div css={tw`mt-6`}>
                        <Field light type={'password'} label={'Password'} name={'password'} disabled={isSubmitting} />
                    </div>
                    <div css={tw`flex flex-row-reverse items-center justify-between mt-8`}>
                        <Button
                            type={'submit'}
                            size={Button.Sizes.Large}
                            css={tw`w-1/3 bg-blue-500 bg-opacity-10 text-blue-400 border border-blue-500 border-opacity-20 hover:bg-blue-500 bg-opacity-20 rounded-xl transition-all font-black uppercase tracking-wider text-xs py-3`}
                            disabled={isSubmitting}
                        >
                            Login
                        </Button>
                        <Link
                            to={'/auth/password'}
                            css={tw`text-xs text-neutral-500 font-bold uppercase tracking-wider hover:text-neutral-400 transition-colors`}
                        >
                            Forgot password?
                        </Link>
                    </div>
                    {recaptchaEnabled && (
                        <Reaptcha
                            ref={ref}
                            size={'invisible'}
                            sitekey={siteKey || '_invalid_key'}
                            onVerify={(response) => {
                                setToken(response);
                                submitForm();
                            }}
                            onExpire={() => {
                                setSubmitting(false);
                                setToken('');
                            }}
                        />
                    )}
                    {(email || discord) && (
                        <div css={tw`mt-8 pt-8 border-t border-neutral-700 border-opacity-50 flex flex-col gap-4`}>
                            {email && (
                                <Link
                                    to={'/auth/register'}
                                    css={tw`flex items-center justify-center gap-3 bg-blue-500 bg-opacity-10 text-blue-400 border border-blue-500 border-opacity-20 py-4 rounded-2xl hover:bg-blue-500 bg-opacity-20 transition-all font-black text-xs uppercase tracking-wider`}
                                >
                                    <Mail size={18} />
                                    Signup with Email
                                </Link>
                            )}
                            {discord && (
                                <Link
                                    to={'/auth/discord'}
                                    css={tw`flex items-center justify-center gap-3 bg-indigo-500 bg-opacity-10 text-indigo-400 border border-indigo-500 border-opacity-20 py-4 rounded-2xl hover:bg-indigo-500 bg-opacity-20 transition-all font-black text-xs uppercase tracking-wider`}
                                >
                                    <MessageSquare size={18} />
                                    Login with Discord
                                </Link>
                            )}
                        </div>
                    )}
                </LoginFormContainer>
            )}
        </Formik>
    );
};

export default LoginContainer;
