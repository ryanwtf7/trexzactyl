import React from 'react';
import tw from 'twin.macro';
import '@/assets/tailwind.css';
import { store } from '@/state';
import { StoreProvider } from 'easy-peasy';
import { history } from '@/components/history';
import { SiteSettings } from '@/state/settings';
import IndexRouter from '@/routers/IndexRouter';
import earnCredits from '@/api/account/earnCredits';
import { setupInterceptors } from '@/api/interceptors';
import { StorefrontSettings } from '@/state/storefront';
import GlobalStylesheet from '@/assets/css/GlobalStylesheet';

interface ExtendedWindow extends Window {
    SiteConfiguration?: SiteSettings;
    StoreConfiguration?: StorefrontSettings;
    TrexzactylUser?: {
        uuid: string;
        username: string;
        email: string;
        approved: boolean;
        verified: boolean;
        /* eslint-disable camelcase */
        discord_id: string;
        name_first: string | null;
        root_admin: boolean;
        use_totp: boolean;
        referral_code: string;
        language: string;
        updated_at: string;
        created_at: string;
        /* eslint-enable camelcase */
    };
}

setupInterceptors(history);

const App = () => {
    const { TrexzactylUser, SiteConfiguration, StoreConfiguration } = window as ExtendedWindow;

    if (TrexzactylUser && !store.getState().user.data) {
        store.getActions().user.setUserData({
            uuid: TrexzactylUser.uuid,
            username: TrexzactylUser.username,
            name_first: TrexzactylUser.name_first,
            email: TrexzactylUser.email,
            approved: TrexzactylUser.approved,
            verified: TrexzactylUser.verified,
            discordId: TrexzactylUser.discord_id,
            language: TrexzactylUser.language,
            rootAdmin: TrexzactylUser.root_admin,
            useTotp: TrexzactylUser.use_totp,
            referralCode: TrexzactylUser.referral_code,
            createdAt: new Date(TrexzactylUser.created_at),
            updatedAt: new Date(TrexzactylUser.updated_at),
        });
    }

    if (!store.getState().settings.data) {
        store.getActions().settings.setSettings(SiteConfiguration!);
    }

    if (!store.getState().storefront.data) {
        store.getActions().storefront.setStorefront(StoreConfiguration!);
    }

    function earn() {
        setTimeout(earn, 61000); // Allow 1 second for time inconsistencies.
        earnCredits().catch(() => console.error('Failed to add credits'));
    }

    if (TrexzactylUser) {
        earn();
    }

    return (
        <>
            <GlobalStylesheet />
            <StoreProvider store={store}>
                <div css={tw`mx-auto w-auto`}>
                    <IndexRouter />
                </div>
            </StoreProvider>
        </>
    );
};

export default App;
