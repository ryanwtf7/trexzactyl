import tw from 'twin.macro';
import styled from 'styled-components/macro';

export default styled.div<{ $hoverable?: boolean }>`
    ${tw`flex rounded-sm no-underline text-neutral-200 items-center bg-neutral-900 bg-opacity-40 backdrop-blur-xl p-4 border border-neutral-700 transition-colors duration-150 overflow-hidden`};

    ${(props) => props.$hoverable !== false && tw`hover:border-neutral-500`};

    & .icon {
        ${tw`rounded-full w-16 flex items-center justify-center bg-neutral-500 bg-opacity-10 p-3`};
    }
`;
