import { encodePathSegments } from '@/helpers';
import { differenceInHours, format, formatDistanceToNow } from 'date-fns';
import { FileObject } from '@/api/server/files/loadDirectory';
import FileDropdownMenu from '@/components/server/files/FileDropdownMenu';
import { ServerContext } from '@/state/server';
import { NavLink, useRouteMatch } from 'react-router-dom';
import tw from 'twin.macro';
import * as Icon from 'react-feather';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import SelectFileCheckbox from '@/components/server/files/SelectFileCheckbox';
import { usePermissions } from '@/plugins/usePermissions';
import { join } from 'path';
import { bytesToString } from '@/lib/formatters';
import styled from 'styled-components/macro';

const FileRow = styled.div`
    ${tw`flex items-center p-4 rounded-xl border border-neutral-700 bg-neutral-900 bg-opacity-50 backdrop-blur-md mb-2 transition-all duration-200`};
    ${tw`hover:border-blue-500 border-opacity-30 hover:shadow-md hover:-translate-y-0.5`};
`;

const FileIcon = styled.div`
    ${tw`flex-none text-neutral-500 group-hover:text-blue-400 transition-colors duration-200 mr-4 ml-8`};
`;

const FileDetails = styled.div`
    ${tw`flex-1 truncate text-neutral-300 group-hover:text-neutral-100 transition-colors duration-200`};
`;

const Clickable: React.FC<{ file: FileObject }> = memo(({ file, children }) => {
    const [canReadContents] = usePermissions(['file.read-content']);
    const directory = ServerContext.useStoreState((state) => state.files.directory);
    const match = useRouteMatch();

    return !canReadContents || (file.isFile && !file.isEditable()) ? (
        <div className={'flex-1 flex items-center min-w-0'}>{children}</div>
    ) : (
        <NavLink
            className={'flex-1 flex items-center min-w-0 no-underline'}
            to={`${match.url}${file.isFile ? '/edit' : ''}#${encodePathSegments(join(directory, file.name))}`}
        >
            {children}
        </NavLink>
    );
}, isEqual);

const FileObjectRow = ({ file }: { file: FileObject }) => (
    <FileRow
        key={file.name}
        className={'group'}
        onContextMenu={(e) => {
            e.preventDefault();
            window.dispatchEvent(new CustomEvent(`Trexzactyl:files:ctx:${file.key}`, { detail: e.clientX }));
        }}
    >
        <SelectFileCheckbox name={file.name} />
        <Clickable file={file}>
            <FileIcon>
                {file.isFile ? (
                    <>
                        {file.isSymlink ? (
                            <Icon.Download size={18} />
                        ) : file.isArchiveType() ? (
                            <Icon.Archive size={18} />
                        ) : (
                            <Icon.File size={18} />
                        )}
                    </>
                ) : (
                    <Icon.Folder size={18} />
                )}
            </FileIcon>
            <FileDetails>{file.name}</FileDetails>
            {file.isFile && (
                <div
                    css={tw`w-1/6 text-right mr-4 hidden sm:block text-xs text-neutral-500 group-hover:text-neutral-400`}
                >
                    {bytesToString(file.size)}
                </div>
            )}
            <div
                css={tw`w-1/5 text-right mr-4 hidden md:block text-xs text-neutral-500 group-hover:text-neutral-400`}
                title={file.modifiedAt.toString()}
            >
                {Math.abs(differenceInHours(file.modifiedAt, new Date())) > 48
                    ? format(file.modifiedAt, 'MMM do, yyyy')
                    : formatDistanceToNow(file.modifiedAt, { addSuffix: true })}
            </div>
        </Clickable>
        <FileDropdownMenu file={file} />
    </FileRow>
);

export default memo(FileObjectRow, (prevProps, nextProps) => {
    const { isArchiveType: _isArchiveType, _isEditable, ...prevFile } = prevProps.file;
    const { isArchiveType: _nextIsArchiveType, _isEditable: _nextIsEditable, ...nextFile } = nextProps.file;
    return isEqual(prevFile, nextFile);
});
