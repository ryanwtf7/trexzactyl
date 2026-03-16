import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import * as Icon from 'react-feather';

import Spinner from '@/components/elements/Spinner';
import Pagination from '@/components/elements/Pagination';
import GlassCard from '@/components/elements/GlassCard';
import PageContentBlock from '@/components/elements/PageContentBlock';
import useFlash from '@/plugins/useFlash';
import { getOrders, OrdersResponse } from '@/api/store/getOrders';

const StatusBadge = styled.span<{ $status: string }>`
    ${tw`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border`};
    ${(props) => {
        switch (props.$status) {
            case 'pending':
                return tw`bg-yellow-900/50 text-yellow-400 border-yellow-500/30`;
            case 'processing':
                return tw`bg-blue-900/50 text-blue-400 border-blue-500/30`;
            case 'approved':
                return tw`bg-green-900/50 text-green-400 border-green-500/30`;
            case 'rejected':
                return tw`bg-red-900/50 text-red-400 border-red-500/30`;
            default:
                return tw`bg-gray-900/50 text-gray-400 border-gray-500/30`;
        }
    }}
`;

const PaymentMethodBadge = styled.span<{ $method: string }>`
    ${tw`px-3 py-1 rounded-full text-xs font-bold text-white`};
    ${(props) => {
        switch (props.$method.toLowerCase()) {
            case 'bkash':
                return tw`bg-pink-600`;
            case 'nagad':
                return tw`bg-orange-600`;
            case 'stripe':
                return tw`bg-purple-600`;
            case 'paypal':
                return tw`bg-blue-600`;
            default:
                return tw`bg-neutral-700 text-gray-300`;
        }
    }}
`;

export default function OrdersContainer() {
    const { addFlash } = useFlash();
    const [orders, setOrders] = useState<OrdersResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const loadOrders = async (page = 1) => {
        setLoading(true);
        try {
            const response = await getOrders(page);
            setOrders(response);
        } catch (error) {
            addFlash({
                type: 'danger',
                key: 'orders:load',
                message: 'Failed to load payment history.',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders(1);
    }, []);

    const handlePageChange = (page: number) => {
        loadOrders(page);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Icon.Clock size={16} />;
            case 'processing':
                return <Icon.Loader size={16} className='animate-spin' />;
            case 'approved':
                return <Icon.CheckCircle size={16} />;
            case 'rejected':
                return <Icon.XCircle size={16} />;
            default:
                return <Icon.Circle size={16} />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatAmount = (amount: number, paymentMethod: string, currency: string) => {
        const method = paymentMethod.toLowerCase();

        // For bKash and Nagad, show BDT
        if (method === 'bkash' || method === 'nagad') {
            return `${amount} BDT`;
        }

        // For Stripe and PayPal, show credits (amount is already in credits)
        if (method === 'stripe' || method === 'paypal') {
            return `${amount} Credits ($${(amount / 100).toFixed(2)})`;
        }

        // Fallback: use the currency field
        return `${amount} ${currency}`;
    };

    if (loading && !orders) {
        return (
            <PageContentBlock title={'Payment History'}>
                <div css={tw`flex items-center justify-center py-12`}>
                    <Spinner size='large' />
                </div>
            </PageContentBlock>
        );
    }

    return (
        <PageContentBlock title={'Payment History'} description={'Track your payment transactions and their status'}>
            <div css={tw`space-y-6`}>
                {loading ? (
                    <div css={tw`flex items-center justify-center py-8`}>
                        <Spinner size='large' />
                    </div>
                ) : orders && orders.items.length > 0 ? (
                    <>
                        <div css={tw`space-y-4`}>
                            <AnimatePresence>
                                {orders.items.map((order) => (
                                    <GlassCard
                                        key={order.id}
                                        as={motion.div}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.2 }}
                                        css={tw`p-6 relative`}
                                    >
                                        <div
                                            css={[
                                                tw`absolute left-0 top-0 w-1 h-full rounded-l-lg`,
                                                order.status === 'pending' && tw`bg-yellow-500`,
                                                order.status === 'processing' && tw`bg-blue-500`,
                                                order.status === 'approved' && tw`bg-green-500`,
                                                order.status === 'rejected' && tw`bg-red-500`,
                                            ]}
                                        />

                                        <div css={tw`flex items-start justify-between mb-4`}>
                                            <div css={tw`flex items-center space-x-3`}>
                                                <div css={tw`flex items-center space-x-2`}>
                                                    {getStatusIcon(order.status)}
                                                    <StatusBadge $status={order.status}>
                                                        {order.status_label}
                                                    </StatusBadge>
                                                </div>
                                                <PaymentMethodBadge $method={order.payment_method}>
                                                    {order.payment_method}
                                                </PaymentMethodBadge>
                                            </div>
                                            <div css={tw`text-right`}>
                                                <div css={tw`text-xl font-bold text-white`}>
                                                    {formatAmount(order.amount, order.payment_method, order.currency)}
                                                </div>
                                                <div css={tw`text-sm text-gray-400`}>Order #{order.id}</div>
                                            </div>
                                        </div>

                                        <div css={tw`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm`}>
                                            <div>
                                                <span css={tw`text-gray-400`}>Transaction ID:</span>
                                                <div css={tw`text-white font-mono mt-1`}>{order.transaction_id}</div>
                                            </div>
                                            {(order.payment_method.toLowerCase() === 'bkash' ||
                                                order.payment_method.toLowerCase() === 'nagad') &&
                                                order.sender_number && (
                                                    <div>
                                                        <span css={tw`text-gray-400`}>Sender Number:</span>
                                                        <div css={tw`text-white mt-1`}>{order.sender_number}</div>
                                                    </div>
                                                )}
                                            <div>
                                                <span css={tw`text-gray-400`}>Submitted:</span>
                                                <div css={tw`text-white mt-1`}>{formatDate(order.created_at)}</div>
                                            </div>
                                            {order.processed_at && (
                                                <div>
                                                    <span css={tw`text-gray-400`}>Processed:</span>
                                                    <div css={tw`text-white mt-1`}>
                                                        {formatDate(order.processed_at)}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {order.rejection_reason && (
                                            <div css={tw`mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg`}>
                                                <div css={tw`flex items-start space-x-2`}>
                                                    <Icon.AlertCircle
                                                        size={16}
                                                        css={tw`text-red-400 mt-0.5 flex-shrink-0`}
                                                    />
                                                    <div>
                                                        <div css={tw`text-red-400 font-medium text-sm`}>
                                                            Rejection Reason:
                                                        </div>
                                                        <div css={tw`text-red-200 text-sm mt-1`}>
                                                            {order.rejection_reason}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </GlassCard>
                                ))}
                            </AnimatePresence>
                        </div>

                        {orders.pagination && orders.pagination.totalPages > 1 && (
                            <div css={tw`flex justify-center mt-8`}>
                                <Pagination
                                    data={{ items: orders.items, pagination: orders.pagination }}
                                    onPageSelect={handlePageChange}
                                >
                                    {() => null}
                                </Pagination>
                            </div>
                        )}
                    </>
                ) : (
                    <GlassCard css={tw`p-12 text-center`}>
                        <Icon.CreditCard size={48} css={tw`text-gray-600 mx-auto mb-4`} />
                        <h3 css={tw`text-xl font-bold text-white mb-2`}>No Payment History</h3>
                        <p css={tw`text-gray-400`}>
                            You haven&apos;t made any payments yet. Start by purchasing credits!
                        </p>
                    </GlassCard>
                )}
            </div>
        </PageContentBlock>
    );
}
