import tw from 'twin.macro';
import { ServerContext } from '@/state/server';
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { encodePathSegments, hashToPath } from '@/helpers';
import styled from 'styled-components/macro';
import * as Icon from 'react-feather';

interface Props {
    renderLeft?: JSX.Element;
    withinFileEditor?: boolean;
    isNewFile?: boolean;
}

const BreadcrumbContainer = styled.div`
    ${tw`flex flex-grow-0 items-center text-sm font-medium overflow-x-hidden p-2 bg-neutral-900 bg-opacity-50 backdrop-blur-md border border-neutral-700 rounded-lg`};
`;

const CrumbLink = styled(NavLink)`
    ${tw`px-2 py-1 text-neutral-400 no-underline hover:text-neutral-100 hover:bg-neutral-800 rounded transition-all duration-200`};
`;

const CrumbText = styled.span`
    ${tw`px-2 py-1 text-neutral-300 font-bold`};
`;

export default ({ renderLeft, withinFileEditor, isNewFile }: Props) => {
    const [file, setFile] = useState<string | null>(null);
    const id = ServerContext.useStoreState((state) => state.server.data!.id);
    const directory = ServerContext.useStoreState((state) => state.files.directory);
    const { hash } = useLocation();

    useEffect(() => {
        const path = hashToPath(hash);
        if (withinFileEditor && !isNewFile) {
            const name = path.split('/').pop() || null;
            setFile(name);
        }
    }, [withinFileEditor, isNewFile, hash]);

    const breadcrumbs = (): { name: string; path?: string }[] =>
        directory
            .split('/')
            .filter((directory) => !!directory)
            .map((directory, index, dirs) => {
                if (!withinFileEditor && index === dirs.length - 1) {
                    return { name: directory };
                }
                return { name: directory, path: `/${dirs.slice(0, index + 1).join('/')}` };
            });

    return (
        <BreadcrumbContainer>
            {renderLeft || <div className={'w-2'} />}
            <Icon.Home size={14} className={'text-neutral-500 mr-2'} />
            <CrumbLink to={`/server/${id}/files`}>container</CrumbLink>
            <span className={'text-neutral-700 mx-1'}>/</span>
            {breadcrumbs().map((crumb, index) =>
                crumb.path ? (
                    <React.Fragment key={index}>
                        <CrumbLink to={`/server/${id}/files#${encodePathSegments(crumb.path)}`}>{crumb.name}</CrumbLink>
                        <span className={'text-neutral-700 mx-1'}>/</span>
                    </React.Fragment>
                ) : (
                    <CrumbText key={index}>{crumb.name}</CrumbText>
                )
            )}
            {file && (
                <React.Fragment>
                    <span className={'text-neutral-700 mx-1'}>/</span>
                    <CrumbText>{file}</CrumbText>
                </React.Fragment>
            )}
        </BreadcrumbContainer>
    );
};
