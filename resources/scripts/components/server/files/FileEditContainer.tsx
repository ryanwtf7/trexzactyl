import tw from 'twin.macro';
import modes from '@/modes';
import { dirname } from 'path';
import useFlash from '@/plugins/useFlash';
import Can from '@/components/elements/Can';
import { httpErrorToHuman } from '@/api/http';
import { ServerContext } from '@/state/server';
import Select from '@/components/elements/Select';
import React, { useEffect, useState } from 'react';
import { encodePathSegments, hashToPath } from '@/helpers';
import { Button } from '@/components/elements/button/index';
import { ServerError } from '@/components/elements/ScreenBlock';
import ErrorBoundary from '@/components/elements/ErrorBoundary';
import getFileContents from '@/api/server/files/getFileContents';
import FlashMessageRender from '@/components/FlashMessageRender';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { useHistory, useLocation, useParams } from 'react-router';
import saveFileContents from '@/api/server/files/saveFileContents';
import FileNameModal from '@/components/server/files/FileNameModal';
import PageContentBlock from '@/components/elements/PageContentBlock';
import CodemirrorEditor from '@/components/elements/CodemirrorEditor';
import FileManagerBreadcrumbs from '@/components/server/files/FileManagerBreadcrumbs';
import styled from 'styled-components/macro';
import * as Icon from 'react-feather';

const EditorWrapper = styled.div`
    ${tw`relative rounded-xl border border-neutral-700 bg-neutral-900`};
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
`;

const ControlsContainer = styled.div`
    ${tw`flex flex-wrap items-center justify-between gap-4 p-4 mt-4 rounded-xl border border-neutral-700 bg-neutral-900 bg-opacity-50 backdrop-blur-md`};
`;

const StyledSelect = styled(Select)`
    ${tw`bg-neutral-800 bg-opacity-50 border-neutral-700 text-xs font-bold uppercase tracking-wider`};
`;

export default () => {
    const [error, setError] = useState('');
    const { action } = useParams<{ action: 'new' | string }>();
    const [loading, setLoading] = useState(action === 'edit');
    const [content, setContent] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [mode, setMode] = useState('text/plain');

    const history = useHistory();
    const { hash } = useLocation();

    const id = ServerContext.useStoreState((state) => state.server.data!.id);
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const setDirectory = ServerContext.useStoreActions((actions) => actions.files.setDirectory);
    const { addError, clearFlashes } = useFlash();

    let fetchFileContent: null | (() => Promise<string>) = null;

    useEffect(() => {
        if (action === 'new') return;
        setError('');
        setLoading(true);
        const path = hashToPath(hash);
        setDirectory(dirname(path));
        getFileContents(uuid, path)
            .then(setContent)
            .catch((error) => {
                console.error(error);
                setError(httpErrorToHuman(error));
            })
            .then(() => setLoading(false));
    }, [action, uuid, hash]);

    const save = (name?: string) => {
        if (!fetchFileContent) return;
        setLoading(true);
        clearFlashes('files:view');
        fetchFileContent()
            .then((content) => saveFileContents(uuid, name || hashToPath(hash), content))
            .then(() => {
                if (name) {
                    history.push(`/server/${id}/files/edit#/${encodePathSegments(name)}`);
                    return;
                }
            })
            .catch((error) => {
                console.error(error);
                addError({ message: httpErrorToHuman(error), key: 'files:view' });
            })
            .then(() => setLoading(false));
    };

    if (error) return <ServerError message={error} onBack={() => history.goBack()} />;

    return (
        <PageContentBlock>
            <FlashMessageRender byKey={'files:view'} css={tw`mb-4`} />
            <div css={tw`flex items-center justify-between mb-6`}>
                <ErrorBoundary>
                    <FileManagerBreadcrumbs withinFileEditor isNewFile={action !== 'edit'} />
                </ErrorBoundary>
                <div css={tw`flex items-center gap-2 text-neutral-500`}>
                    <Icon.Edit3 size={14} />
                    <span css={tw`text-xs uppercase font-bold tracking-wider`}>Editor</span>
                </div>
            </div>

            {hash.replace(/^#/, '').endsWith('.pteroignore') && (
                <div
                    css={tw`mb-6 p-4 rounded-xl border border-blue-500 border-opacity-20 bg-blue-500 bg-opacity-5 flex items-start gap-4`}
                >
                    <Icon.Info size={20} css={tw`text-blue-400 mt-0.5`} />
                    <p css={tw`text-neutral-400 text-sm leading-relaxed`}>
                        You&apos;re editing a{' '}
                        <code css={tw`font-mono bg-neutral-900 rounded py-0.5 px-1.5 text-blue-300`}>.pteroignore</code>{' '}
                        file. Entries here are excluded from backups. Use <code css={tw`text-blue-300`}>*</code> for
                        wildcards and <code css={tw`text-blue-300`}>!</code> to negate rules.
                    </p>
                </div>
            )}

            <FileNameModal
                visible={modalVisible}
                onDismissed={() => setModalVisible(false)}
                onFileNamed={(name) => {
                    setModalVisible(false);
                    save(name);
                }}
            />

            <EditorWrapper>
                <SpinnerOverlay visible={loading} />
                <CodemirrorEditor
                    mode={mode}
                    filename={hash.replace(/^#/, '')}
                    onModeChanged={setMode}
                    initialContent={content}
                    fetchContent={(value) => {
                        fetchFileContent = value;
                    }}
                    onContentSaved={() => (action !== 'edit' ? setModalVisible(true) : save())}
                />
            </EditorWrapper>

            <ControlsContainer>
                <div css={tw`flex items-center gap-4`}>
                    <div css={tw`flex flex-col`}>
                        <span css={tw`text-xs text-neutral-500 font-bold uppercase tracking-wider mb-1 ml-1`}>
                            Syntax Mode
                        </span>
                        <StyledSelect value={mode} onChange={(e) => setMode(e.currentTarget.value)}>
                            {modes.map((mode) => (
                                <option key={`${mode.name}_${mode.mime}`} value={mode.mime}>
                                    {mode.name}
                                </option>
                            ))}
                        </StyledSelect>
                    </div>
                </div>
                <div>
                    {action === 'edit' ? (
                        <Can action={'file.update'}>
                            <Button css={tw`px-8`} onClick={() => save()}>
                                Save Changes
                            </Button>
                        </Can>
                    ) : (
                        <Can action={'file.create'}>
                            <Button css={tw`px-8`} onClick={() => setModalVisible(true)}>
                                Create File
                            </Button>
                        </Can>
                    )}
                </div>
            </ControlsContainer>
        </PageContentBlock>
    );
};
