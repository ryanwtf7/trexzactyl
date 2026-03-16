import React from 'react';
import tw, { theme } from 'twin.macro';

const SubNavigation = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => (
    <div
        ref={ref}
        {...props}
        css={[
            tw`bg-neutral-900 bg-opacity-40 backdrop-blur-xl border-b border-white/5 overflow-x-auto mb-4 sm:mb-10 w-full`,
            `
            & > div {
                display: flex;
                font-size: 0.875rem;
                margin-left: auto;
                margin-right: auto;
                padding-left: 0.5rem;
                padding-right: 0.5rem;
                max-width: 80rem;
            }

            & > div > a,
            & > div > div {
                display: inline-block;
                padding: 0.75rem 1rem;
                color: rgb(163 163 163);
                text-decoration: none;
                white-space: nowrap;
                transition: all 300ms;
                font-weight: 700;
                font-size: 0.75rem;
            }

            & > div > a:not(:first-of-type),
            & > div > div:not(:first-of-type) {
                margin-left: 0.5rem;
            }

            & > div > a:hover,
            & > div > div:hover {
                color: rgb(245 245 245);
            }

            & > div > a:active,
            & > div > a.active,
            & > div > div:active,
            & > div > div.active {
                color: rgb(96 165 250);
                box-shadow: inset 0 -2px ${theme`colors.blue.500`.toString()};
            }
            `,
        ]}
    />
));

SubNavigation.displayName = 'SubNavigation';

export default SubNavigation;
