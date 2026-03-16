import React from 'react';
import tw from 'twin.macro';
import CSSTransition, { CSSTransitionProps } from 'react-transition-group/CSSTransition';

interface Props extends Omit<CSSTransitionProps, 'timeout' | 'classNames'> {
    timeout: number;
}

const Fade: React.FC<Props> = ({ timeout, children, ...props }) => {
    const nodeRef = React.useRef<HTMLDivElement>(null);

    return (
        <div
            css={[
                tw``,
                `
                .fade-enter,
                .fade-exit,
                .fade-appear {
                    will-change: opacity;
                }

                .fade-enter,
                .fade-appear {
                    opacity: 0;
                }

                .fade-enter-active,
                .fade-appear-active {
                    opacity: 1;
                    transition: opacity ease-in;
                    transition-duration: ${timeout}ms;
                }

                .fade-exit {
                    opacity: 1;
                }

                .fade-exit-active {
                    opacity: 0;
                    transition: opacity ease-in;
                    transition-duration: ${timeout}ms;
                }
                `,
            ]}
        >
            <CSSTransition timeout={timeout} classNames={'fade'} {...props} nodeRef={nodeRef}>
                <div ref={nodeRef}>{children}</div>
            </CSSTransition>
        </div>
    );
};
Fade.displayName = 'Fade';

export default Fade;
