import React from 'react';
import { Folder, Trash2, Edit2, ArrowUp } from 'lucide-react';
import { FileData, FolderData } from '../../types';
import { getFileIcon } from '../../utils/fileUtils';

interface FileListProps {
  files: FileData[];
  folders: FolderData[];
  currentPath: string;
  activeFile: FileData;
  onFileSelect: (file: FileData) => void;
  onFileMove: (file: FileData, targetPath: string) => void;
  onFileDelete: (file: FileData) => void;
  onFolderDelete: (folder: FolderData) => void;
  onNavigate: (path: string) => void;
  onRename: (type: 'file' | 'folder', item: FileData | FolderData) => void;
}

export function FileList({
  files,
  folders,
  currentPath,
  activeFile,
  onFileSelect,
  onFileMove,
  onFileDelete,
  onFolderDelete,
  onNavigate,
  onRename
}: FileListProps) {
  const currentFiles = files.filter(file => file.path === currentPath);
  const currentFolders = folders.filter(folder => {
    const parentPath = folder.path.substring(0, folder.path.lastIndexOf('/'));
    return parentPath === currentPath || (currentPath === '/' && folder.path.split('/').length === 2);
  });

  const handleDragStart = (e: React.DragEvent, file: FileData) => {
    e.dataTransfer.setData('application/json', JSON.stringify(file));
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {currentFolders.map(folder => (
        <div
          key={folder.path}
          className="group flex items-center justify-between px-4 py-2 hover:bg-gray-700 transition-colors"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const fileData = e.dataTransfer.getData('application/json');
            if (!fileData) return;
            const file: FileData = JSON.parse(fileData);
            onFileMove(file, folder.path);
          }}
        >
          <button
            onClick={() => onNavigate(folder.path)}
            className="flex items-center space-x-2 flex-1"
          >
            <Folder className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">{folder.name}</span>
          </button>
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100">
            <button
              onClick={() => onRename('folder', folder)}
              className="p-1 hover:bg-gray-600 rounded transition-all"
              title="Rename folder"
            >
              <Edit2 className="w-4 h-4 text-blue-400" />
            </button>
            <button
              onClick={() => onFolderDelete(folder)}
              className="p-1 hover:bg-gray-600 rounded transition-all"
              title="Delete folder"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
      ))}

      {currentFiles.map(file => (
        <div
          key={`${file.path}/${file.name}`}
          className="group flex items-center justify-between px-4 py-2 hover:bg-gray-700 transition-colors"
          draggable
          onDragStart={(e) => handleDragStart(e, file)}
        >
          <button
            onClick={() => onFileSelect(file)}
            className={`flex items-center space-x-2 flex-1 ${
              activeFile.name === file.name && activeFile.path === file.path
                ? 'text-blue-400'
                : ''
            }`}
          >
            {getFileIcon(file.name)}
            <span className="text-sm">{file.name}</span>
          </button>
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100">
            {currentPath !== '/' && (
              <button
                onClick={() => {
                  const parentPath = file.path.split('/').slice(0, -1).join('/');
                  const targetPath = parentPath === '' ? '/' : parentPath;
                  onFileMove(file, targetPath);
                }}
                className="p-1 hover:bg-gray-600 rounded transition-all"
                title="Move to parent folder"
              >
                <ArrowUp className="w-4 h-4 text-green-400" />
              </button>
            )}
            <button
              onClick={() => onRename('file', file)}
              className="p-1 hover:bg-gray-600 rounded transition-all"
              title="Rename file"
            >
              <Edit2 className="w-4 h-4 text-blue-400" />
            </button>
            <button
              onClick={() => onFileDelete(file)}
              className="p-1 hover:bg-gray-600 rounded transition-all"
              title="Delete file"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}