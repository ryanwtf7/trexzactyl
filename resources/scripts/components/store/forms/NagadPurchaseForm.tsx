import React, { useState } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { object, string, number } from 'yup';
import tw from 'twin.macro';
import * as Icon from 'react-feather';

import Field from '@/components/elements/Field';
import Select from '@/components/elements/Select';
import { Button } from '@/components/elements/button/index';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import FlashMessageRender from '@/components/FlashMessageRender';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import useFlash from '@/plugins/useFlash';
import { submitNagadPayment } from '@/api/store/gateways/nagad';
import { useStoreState } from '@/state/hooks';

interface Values {
    amount: number;
    transaction_id: string;
    sender_number: string;
}

export default function NagadPurchaseForm() {
    const { clearAndAddHttpError } = useFlash();
    const [submitting, setSubmitting] = useState(false);
    const storefront = useStoreState((state) => state.storefront.data);

    const submit = (values: Values, { resetForm }: FormikHelpers<Values>) => {
        setSubmitting(true);

        submitNagadPayment(values)
            .then(() => {
                setSubmitting(false);
                resetForm();
            })
            .catch((error) => {
                setSubmitting(false);
                clearAndAddHttpError({ key: 'store:nagad', error });
            });
    };

    if (!storefront?.gateways?.nagad) return null;

    const conversionRate = storefront.gateways.conversion_rate || 115;

    return (
        <TitledGreyBox title={'Purchase via Nagad'}>
            <FlashMessageRender byKey={'store:nagad'} css={tw`mb-2`} />
            <Formik
                onSubmit={submit}
                initialValues={{
                    amount: 100,
                    transaction_id: '',
                    sender_number: '',
                }}
                validationSchema={object().shape({
                    amount: number()
                        .required('Amount is required')
                        .min(50, 'Minimum amount is 50 BDT')
                        .max(10000, 'Maximum amount is 10000 BDT'),
                    transaction_id: string()
                        .required('Transaction ID is required')
                        .min(8, 'Transaction ID must be at least 8 characters'),
                    sender_number: string()
                        .required('Sender number is required')
                        .matches(/^01[3-9]\d{8}$/, 'Please enter a valid Bangladeshi mobile number'),
                })}
            >
                {({ values }) => (
                    <Form css={tw`space-y-4`}>
                        <SpinnerOverlay size={'large'} visible={submitting} />

                        <Select name={'amount'} disabled={submitting}>
                            <option value={100}>
                                Purchase {((100 / 100) * conversionRate).toFixed(0)} BDT (100 Credits)
                            </option>
                            <option value={200}>
                                Purchase {((200 / 100) * conversionRate).toFixed(0)} BDT (200 Credits)
                            </option>
                            <option value={500}>
                                Purchase {((500 / 100) * conversionRate).toFixed(0)} BDT (500 Credits)
                            </option>
                            <option value={1000}>
                                Purchase {((1000 / 100) * conversionRate).toFixed(0)} BDT (1000 Credits)
                            </option>
                        </Select>

                        <div css={tw`bg-neutral-800 rounded p-4 text-sm`}>
                            <div css={tw`flex items-center mb-2`}>
                                <Icon.Info size={16} css={tw`mr-2 text-orange-400`} />
                                <span css={tw`font-medium text-white`}>Payment Instructions</span>
                            </div>
                            <ol css={tw`text-gray-300 space-y-1 ml-6 list-decimal`}>
                                <li>
                                    Send {((values.amount / 100) * conversionRate).toFixed(0)} BDT to:{' '}
                                    <strong css={tw`text-white`}>{storefront.gateways.nagad}</strong>
                                </li>
                                <li>Copy the transaction ID from your Nagad app</li>
                                <li>Fill in the form below and submit</li>
                            </ol>
                        </div>

                        <Field
                            name='sender_number'
                            label='Your Nagad Number'
                            placeholder='01XXXXXXXXX'
                            disabled={submitting}
                        />

                        <Field
                            name='transaction_id'
                            label='Transaction ID'
                            placeholder='Enter transaction ID from Nagad'
                            disabled={submitting}
                        />

                        <div css={tw`mt-6`}>
                            <Button type={'submit'} disabled={submitting} css={tw`bg-orange-600 hover:bg-orange-700`}>
                                <Icon.Send size={16} css={tw`mr-2`} />
                                Submit Nagad Payment
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </TitledGreyBox>
    );
}
