import tw from 'twin.macro';
import * as Icon from 'react-feather';
import { useStoreState } from '@/state/hooks';
import React, { useEffect, useState } from 'react';
import Spinner from '@/components/elements/Spinner';
import GlassCard from '@/components/elements/GlassCard';
import { getResources, Resources } from '@/api/store/getResources';
import PageContentBlock from '@/components/elements/PageContentBlock';
import StripePurchaseForm from '@/components/store/forms/StripePurchaseForm';
import PaypalPurchaseForm from '@/components/store/forms/PaypalPurchaseForm';
import BkashPurchaseForm from '@/components/store/forms/BkashPurchaseForm';
import NagadPurchaseForm from '@/components/store/forms/NagadPurchaseForm';

export default () => {
    const [resources, setResources] = useState<Resources>();
    const earn = useStoreState((state) => state.storefront.data?.earn);
    const paypal = useStoreState((state) => state.storefront.data?.gateways?.paypal);
    const stripe = useStoreState((state) => state.storefront.data?.gateways?.stripe);
    const bkash = useStoreState((state) => state.storefront.data?.gateways?.bkash);
    const nagad = useStoreState((state) => state.storefront.data?.gateways?.nagad);

    useEffect(() => {
        getResources().then((resources) => setResources(resources));
    }, []);

    if (!resources || !earn) return <Spinner size={'large'} centered />;

    return (
        <PageContentBlock title={'Account Balance'} description={'Purchase credits easily via Stripe or PayPal.'}>
            <div css={tw`lg:grid lg:grid-cols-2 my-10 gap-8`}>
                <GlassCard
                    css={tw`p-10 flex flex-col items-center justify-center text-center relative overflow-hidden`}
                >
                    <div css={tw`relative z-10`}>
                        <div
                            css={tw`bg-blue-600 bg-opacity-10 w-16 h-16 rounded-sm flex items-center justify-center mx-auto mb-6 border border-blue-500 border-opacity-20 group-hover:scale-110 transition-transform duration-500 shadow-lg`}
                        >
                            <Icon.DollarSign size={32} css={tw`text-blue-400`} strokeWidth={2.5} />
                        </div>
                        <p css={tw`text-neutral-500 font-bold text-xs mb-2`}>Total Available Assets</p>
                        <h1
                            css={tw`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white flex flex-wrap items-baseline justify-center gap-2`}
                        >
                            <span css={tw`break-all`}>{resources.balance.toLocaleString()}</span>
                            <span css={tw`text-xl sm:text-2xl text-neutral-500 font-bold whitespace-nowrap`}>
                                Credits
                            </span>
                        </h1>
                    </div>
                </GlassCard>

                <GlassCard
                    css={tw`p-10 flex flex-col items-center justify-center text-center relative overflow-hidden`}
                >
                    <p css={tw`text-xs font-bold text-neutral-500 mb-8`}>Secure Checkout</p>
                    <div css={tw`w-full max-w-sm relative z-10`}>
                        {!paypal && !stripe && !bkash && !nagad ? (
                            <p className={'text-gray-400 text-sm font-bold'}>Payment gateways are offline.</p>
                        ) : (
                            <div css={tw`space-y-6`}>
                                {paypal && (
                                    <div
                                        css={tw`shadow-lg hover:shadow-xl transition-all p-1 bg-white/5 rounded-sm border border-white/5 hover:bg-white/10`}
                                    >
                                        <PaypalPurchaseForm />
                                    </div>
                                )}
                                {stripe && (
                                    <div
                                        css={tw`shadow-lg hover:shadow-xl transition-all p-1 bg-white/5 rounded-sm border border-white/5 text-left hover:bg-white/10`}
                                    >
                                        <StripePurchaseForm />
                                    </div>
                                )}
                                {bkash && (
                                    <div
                                        css={tw`shadow-lg hover:shadow-xl transition-all bg-white/5 rounded-sm border border-white/5 text-left hover:bg-white/10 overflow-hidden`}
                                    >
                                        <BkashPurchaseForm />
                                    </div>
                                )}
                                {nagad && (
                                    <div
                                        css={tw`shadow-lg hover:shadow-xl transition-all bg-white/5 rounded-sm border border-white/5 text-left hover:bg-white/10 overflow-hidden`}
                                    >
                                        <NagadPurchaseForm />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </GlassCard>
            </div>

            {earn.enabled && (
                <div css={tw`mt-16 mb-20`}>
                    <GlassCard css={tw`p-8 sm:p-12 mb-8`}>
                        <div css={tw`flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8`}>
                            <div>
                                <h1 css={tw`text-3xl sm:text-4xl md:text-5xl font-black text-white`}>Idle Earning</h1>
                                <h3 css={tw`text-base sm:text-lg md:text-xl text-neutral-500 font-bold mt-2`}>
                                    Rewards for active sessions
                                </h3>
                            </div>
                            <div
                                css={tw`bg-green-600 bg-opacity-10 w-16 h-16 sm:w-20 sm:h-20 rounded-sm flex items-center justify-center border border-green-500 border-opacity-20 shadow-lg flex-shrink-0`}
                            >
                                <Icon.Zap size={32} css={tw`text-green-400 animate-pulse`} strokeWidth={2.5} />
                            </div>
                        </div>

                        <div css={tw`grid grid-cols-1 lg:grid-cols-2 gap-6`}>
                            <div
                                css={tw`p-6 sm:p-8 rounded-sm bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center`}
                            >
                                <p css={tw`text-neutral-500 font-bold text-xs mb-4 uppercase tracking-wider`}>
                                    Live Accumulation Rate
                                </p>
                                <h1
                                    css={tw`text-4xl sm:text-5xl md:text-6xl font-black text-white flex flex-wrap items-baseline justify-center gap-2`}
                                >
                                    <span>{earn.amount}</span>
                                    <span
                                        css={tw`text-lg sm:text-xl md:text-2xl font-bold text-green-400 whitespace-nowrap`}
                                    >
                                        Cr / Min
                                    </span>
                                </h1>
                            </div>

                            <div css={tw`p-6 sm:p-8 rounded-sm bg-white/5 border border-white/10`}>
                                <h3 css={tw`text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-3`}>
                                    <Icon.Info css={tw`text-blue-400 flex-shrink-0`} size={20} strokeWidth={2.5} />
                                    <span>How It Works</span>
                                </h3>
                                <div css={tw`space-y-4`}>
                                    <p css={tw`text-neutral-400 text-sm leading-relaxed`}>
                                        Your account balance increases automatically while you remain active on the
                                        panel.
                                    </p>
                                    <div
                                        css={tw`bg-blue-600 bg-opacity-10 rounded-sm p-4 border border-blue-500 border-opacity-20`}
                                    >
                                        <p css={tw`text-xs sm:text-sm text-blue-300 leading-relaxed`}>
                                            <span css={tw`text-white font-bold`}>{earn.amount} Credits</span> will be
                                            deposited for every 60 seconds of uptime.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            )}
        </PageContentBlock>
    );
};
