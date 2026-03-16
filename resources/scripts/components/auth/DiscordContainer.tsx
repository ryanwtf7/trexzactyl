import tw from 'twin.macro';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useFlash from '@/plugins/useFlash';
import discordLogin from '@/api/auth/discord';
import { Button } from '@/components/elements/button/index';
import DiscordFormContainer from '@/components/auth/DiscordFormContainer';

const DiscordContainer = () => {
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const [loading, setLoading] = useState(false);

    const login = () => {
        clearFlashes();
        setLoading(true);

        discordLogin()
            .then((data) => {
                if (!data) return clearAndAddHttpError({ error: 'Discord auth failed. Please try again.' });
                window.location.href = data;
            })
            .then(() => setLoading(false))
            .catch((error) => {
                console.error(error);
                clearAndAddHttpError({ error });
            });
    };

    return (
        <DiscordFormContainer css={tw`w-full flex`}>
            <div css={tw`flex flex-col md:h-full`}>
                <div css={tw`mt-2`}>
                    <Button
                        type={'button'}
                        css={tw`w-full bg-blue-500 bg-opacity-10 text-blue-400 border border-blue-500 border-opacity-20 hover:bg-blue-500 bg-opacity-20 rounded-2xl transition-all duration-300 font-black uppercase tracking-wider text-xs py-4`}
                        onClick={() => login()}
                        disabled={loading}
                    >
                        Connect with Discord
                    </Button>
                </div>
                <div css={tw`mt-10 text-center`}>
                    <Link
                        to={'/auth/login'}
                        css={tw`text-xs text-neutral-500 font-black tracking-wider no-underline uppercase hover:text-neutral-300 transition-colors`}
                    >
                        Return to login
                    </Link>
                </div>
            </div>
        </DiscordFormContainer>
    );
};

export default DiscordContainer;
