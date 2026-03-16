import styled from 'styled-components/macro';
import tw from 'twin.macro';

const GlassCard = styled.div<{ $bg?: string }>`
    ${tw`relative rounded-sm border border-neutral-700 bg-neutral-900/50 backdrop-blur-md transition-all duration-300 overflow-hidden`};
    ${tw`hover:border-blue-500/50 hover:shadow-2xl`};

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        ${({ $bg }) =>
            $bg
                ? `background-image: url("${$bg}");`
                : 'background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%);'}
        background-position: center;
        background-size: cover;
        opacity: 0.2;
        z-index: -1;
        transition: opacity 0.3s ease;
    }

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    &:hover::after {
        opacity: 1;
    }

    &:hover::before {
        opacity: 0.35;
    }
`;

export default GlassCard;
