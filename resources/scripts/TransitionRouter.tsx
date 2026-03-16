import React from 'react';
import tw from 'twin.macro';
import { Route } from 'react-router';
import styled from 'styled-components/macro';
import Fade from '@/components/elements/Fade';
import { SwitchTransition } from 'react-transition-group';

const FullSection = styled.section`
    ${tw`absolute w-full top-0 left-0`};
`;

const TransitionRouter: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <Route
            render={({ location }) => (
                <div css={tw`relative`}>
                    <SwitchTransition mode={'out-in'}>
                        <Fade timeout={150} key={location.pathname + location.search} in appear unmountOnExit>
                            <FullSection>{children}</FullSection>
                        </Fade>
                    </SwitchTransition>
                </div>
            )}
        />
    );
};

export default TransitionRouter;
