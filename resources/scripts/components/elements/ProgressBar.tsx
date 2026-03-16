import tw from 'twin.macro';
import { randomInt } from '@/helpers';
import { CSSTransition } from 'react-transition-group';
import React, { useEffect, useRef, useState } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';

type Timer = ReturnType<typeof setTimeout>;

export default () => {
    // All refs must be declared first
    const nodeRef = useRef<HTMLDivElement>(null);
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const timeout = useRef<Timer>(null) as React.MutableRefObject<Timer>;

    // Then state hooks
    const [visible, setVisible] = useState(false);

    // Then store hooks
    const progress = useStoreState((state) => state.progress.progress);
    const continuous = useStoreState((state) => state.progress.continuous);
    const setProgress = useStoreActions((actions) => actions.progress.setProgress);

    useEffect(() => {
        return () => {
            timeout.current && clearTimeout(timeout.current);
            interval.current && clearInterval(interval.current);
        };
    }, []);

    useEffect(() => {
        setVisible((progress || 0) > 0);

        if (progress === 100) {
            timeout.current = setTimeout(() => setProgress(undefined), 500);
        }
    }, [progress, setProgress]);

    useEffect(() => {
        if (!continuous) {
            interval.current && clearInterval(interval.current);
            return;
        }

        if (!progress || progress === 0) {
            setProgress(randomInt(20, 30));
        }
    }, [continuous, progress, setProgress]);

    useEffect(() => {
        if (continuous) {
            interval.current && clearInterval(interval.current);
            if ((progress || 0) >= 90) {
                setProgress(90);
            } else {
                interval.current = setTimeout(() => setProgress((progress || 0) + randomInt(1, 5)), 500);
            }
        }
    }, [progress, continuous, setProgress]);

    return (
        <div css={tw`w-20 fixed`} style={{ height: '3px' }}>
            <CSSTransition timeout={150} appear in={visible} unmountOnExit classNames={'fade'} nodeRef={nodeRef}>
                <div
                    ref={nodeRef}
                    css={tw`h-full bg-green-400 animate-pulse`}
                    style={{
                        width: progress === undefined ? '100%' : `${progress}%`,
                        transition: '500ms ease-in-out',
                    }}
                />
            </CSSTransition>
        </div>
    );
};
