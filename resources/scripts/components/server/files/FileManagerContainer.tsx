import tw from 'twin.macro';
import { ip } from '@/lib/formatters';
import { hashToPath } from '@/helpers';
import Can from '@/components/elements/Can';
import { httpErrorToHuman } from '@/api/http';
import { ServerContext } from '@/state/server';
import Input from '@/components/elements/Input';
import Label from '@/components/elements/Label';
import Spinner from '@/components/elements/Spinner';
import { CSSTransition } from 'react-transition-group';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/elements/button/index';
import CopyOnClick from '@/components/elements/CopyOnClick';
import useFileManagerSwr from '@/plugins/useFileManagerSwr';
import { FileObject } from '@/api/server/files/loadDirectory';
import { useStoreActions, useStoreState } from '@/state/hooks';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { ServerError } from '@/components/elements/ScreenBlock';
import UploadButton from '@/components/server/files/UploadButton';
import PullFileModal from '@/components/server/files/PullFileModal';
import FileObjectRow from '@/components/server/files/FileObjectRow';
import MassActionsBar from '@/components/server/files/MassActionsBar';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import FileManagerStatus from '@/components/server/files/FileManagerStatus';
import NewDirectoryButton from '@/components/server/files/NewDirectoryButton';
import { FileActionCheckbox } from '@/components/server/files/SelectFileCheckbox';
import FileManagerBreadcrumbs from '@/components/server/files/FileManagerBreadcrumbs';
import styled from 'styled-components/macro';
import * as Icon from 'react-feather';

const sortFiles = (files: FileObject[], searchString: string): FileObject[] => {
    const sortedFiles: FileObject[] = files
        .sort((a, b) => a.name.localeCompare(b.name))
        .sort((a, b) => (a.isFile === b.isFile ? 0 : a.isFile ? 1 : -1));
    return sortedFiles
        .filter((file, index) => index === 0 || file.name !== sortedFiles[index - 1].name)
        .filter((file) => file.name.toLowerCase().includes(searchString.toLowerCase()));
};

const ActionsContainer = styled.div`
    ${tw`flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-sm border border-neutral-700 bg-neutral-900 bg-opacity-40 backdrop-blur-xl`};
`;

const FileListContainer = styled.div`
    ${tw`bg-neutral-900 bg-opacity-40 backdrop-blur-xl border border-neutral-700 rounded-sm overflow-hidden`};
`;

const SearchInput = styled(Input)`
    ${tw`bg-neutral-900 bg-opacity-40 backdrop-blur-xl border-neutral-700 focus:border-blue-500 transition-all duration-200 rounded-sm`};
`;

const SFTPCard = styled.div`
    ${tw`p-6 rounded-sm border border-neutral-700 bg-neutral-900 bg-opacity-40 backdrop-blur-xl mt-8`};
`;

export default () => {
    const id = ServerContext.useStoreState((state) => state.server.data!.id);
    const username = useStoreState((state) => state.user.data!.username);
    const sftp = ServerContext.useStoreState((state) => state.server.data!.sftpDetails);
    const { hash } = useLocation();
    const { data: files, error, mutate } = useFileManagerSwr();
    const directory = ServerContext.useStoreState((state) => state.files.directory);
    const clearFlashes = useStoreActions((actions) => actions.flashes.clearFlashes);
    const setDirectory = ServerContext.useStoreActions((actions) => actions.files.setDirectory);
    const setSelectedFiles = ServerContext.useStoreActions((actions) => actions.files.setSelectedFiles);
    const selectedFilesLength = ServerContext.useStoreState((state) => state.files.selectedFiles.length);

    const [searchString, setSearchString] = useState('');
    const fileListRef = useRef(null);

    useEffect(() => {
        clearFlashes('files');
        setSelectedFiles([]);
        setDirectory(hashToPath(hash));
    }, [hash]);

    useEffect(() => {
        mutate();
    }, [directory]);

    const onSelectAllClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles(e.currentTarget.checked ? files?.map((file) => file.name) || [] : []);
    };

    if (error) {
        return <ServerError message={httpErrorToHuman(error)} onRetry={() => mutate()} />;
    }

    const searchFiles = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchString(event.target.value);
    };

    return (
        <ServerContentBlock title={'File Manager'}>
            <div css={tw`mb-6`}>
                <div css={tw`flex items-center gap-2 text-neutral-400 mb-2 px-1`}>
                    <Icon.Search size={14} />
                    <span css={tw`text-xs uppercase font-bold tracking-wider`}>Search Files</span>
                </div>
                <SearchInput onChange={searchFiles} placeholder={'Search for files and folders...'} />
            </div>

            <ActionsContainer>
                <div css={tw`flex-1`}>
                    <FileManagerBreadcrumbs
                        renderLeft={
                            <FileActionCheckbox
                                type={'checkbox'}
                                css={tw`mr-4`}
                                checked={selectedFilesLength === (files?.length === 0 ? -1 : files?.length)}
                                onChange={onSelectAllClick}
                            />
                        }
                    />
                </div>
                <Can action={'file.create'}>
                    <div css={tw`flex items-center gap-2`}>
                        <FileManagerStatus />
                        <NewDirectoryButton />
                        <UploadButton />
                        <PullFileModal />
                        <NavLink to={`/server/${id}/files/new${window.location.hash}`}>
                            <Button
                                css={tw`bg-blue-600 bg-opacity-10 text-blue-400 border border-blue-500 border-opacity-30 hover:bg-blue-600 bg-opacity-20 hover:border-blue-500 border-opacity-60 font-black uppercase tracking-wider text-xs px-4 py-2 rounded-sm transition-all`}
                            >
                                <div css={tw`flex items-center gap-2`}>
                                    <Icon.FilePlus css={tw`w-4 h-4 sm:w-3 sm:h-3`} />
                                    <span css={tw`hidden sm:block`}>New File</span>
                                </div>
                            </Button>
                        </NavLink>
                    </div>
                </Can>
            </ActionsContainer>

            {!files ? (
                <Spinner size={'large'} centered />
            ) : (
                <FileListContainer>
                    {!files.length ? (
                        <div css={tw`p-12 flex flex-col items-center justify-center text-neutral-500`}>
                            <Icon.FolderMinus size={48} css={tw`mb-4 opacity-20`} />
                            <p css={tw`text-sm`}>This directory seems to be empty.</p>
                        </div>
                    ) : (
                        <CSSTransition classNames={'fade'} timeout={150} appear in nodeRef={fileListRef}>
                            <div css={tw`p-2`} ref={fileListRef}>
                                {files.length > 250 && (
                                    <div
                                        css={tw`rounded-lg bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-20 mb-2 p-3 text-center`}
                                    >
                                        <p css={tw`text-yellow-400 text-xs`}>Limit: First 250 files shown.</p>
                                    </div>
                                )}
                                {sortFiles(files.slice(0, 250), searchString).map((file) => (
                                    <FileObjectRow key={file.key} file={file} />
                                ))}
                                <MassActionsBar />
                            </div>
                        </CSSTransition>
                    )}
                </FileListContainer>
            )}

            <Can action={'file.sftp'}>
                <SFTPCard>
                    <div css={tw`flex items-center gap-3 mb-6`}>
                        <div css={tw`p-2 rounded-lg bg-blue-500 bg-opacity-10 text-blue-400`}>
                            <Icon.Cpu size={20} />
                        </div>
                        <div>
                            <h3 css={tw`text-lg font-bold text-neutral-100`}>SFTP Connection</h3>
                            <p css={tw`text-xs text-neutral-500`}>Connect via your favorite SFTP client.</p>
                        </div>
                    </div>

                    <div css={tw`grid grid-cols-1 md:grid-cols-2 gap-6`}>
                        <div>
                            <Label>Server Address</Label>
                            <CopyOnClick text={`${ip(sftp.ip)}:${sftp.port}`}>
                                <SearchInput type={'text'} value={`${ip(sftp.ip)}:${sftp.port}` || ''} readOnly />
                            </CopyOnClick>
                        </div>
                        <div>
                            <Label>Username</Label>
                            <CopyOnClick text={`${username}.${id}`}>
                                <SearchInput type={'text'} value={`${username}.${id}` || ''} readOnly />
                            </CopyOnClick>
                        </div>
                    </div>

                    <div
                        css={tw`mt-8 p-4 rounded-lg bg-blue-500 bg-opacity-5 border border-blue-500 border-opacity-10 flex items-center justify-between`}
                    >
                        <div css={tw`flex items-center gap-3`}>
                            <Icon.Info size={16} css={tw`text-blue-400`} />
                            <p css={tw`text-xs text-neutral-400`}>Password is the same as your panel password.</p>
                        </div>
                        <a href={`sftp://${username}.${id}@${ip(sftp.ip)}:${sftp.port}`}>
                            <Button.Text css={tw`text-xs`}>Launch Protocol</Button.Text>
                        </a>
                    </div>
                </SFTPCard>
            </Can>
        </ServerContentBlock>
    );
};
