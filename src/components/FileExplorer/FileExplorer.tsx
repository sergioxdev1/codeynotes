import React, { useRef } from 'react';
import { Plus, FolderPlus } from 'lucide-react';
import { FileList } from './FileList';
import { Breadcrumbs } from './Breadcrumbs';
import { FileData, FolderData } from '../../types';

interface FileExplorerProps {
  files: FileData[];
  folders: FolderData[];
  currentPath: string;
  activeFile: FileData;
  onFileSelect: (file: FileData) => void;
  onFileMove: (file: FileData, targetPath: string) => void;
  onFileDelete: (file: FileData) => void;
  onFolderDelete: (folder: FolderData) => void;
  onNavigate: (path: string) => void;
  onNewFile: () => void;
  onNewFolder: () => void;
  onRename: (type: 'file' | 'folder', item: FileData | FolderData) => void;
}

export function FileExplorer({
  files,
  folders,
  currentPath,
  activeFile,
  onFileSelect,
  onFileMove,
  onFileDelete,
  onFolderDelete,
  onNavigate,
  onNewFile,
  onNewFolder,
  onRename
}: FileExplorerProps) {
  const dragCounter = useRef(0);

  const handleDrop = (e: React.DragEvent, targetFolder?: FolderData) => {
    e.preventDefault();
    const fileData = e.dataTransfer.getData('application/json');
    if (!fileData) return;
    
    const file: FileData = JSON.parse(fileData);
    const targetPath = targetFolder ? targetFolder.path : currentPath;
    
    if (file.path === targetPath) return;
    onFileMove(file, targetPath);
  };

  return (
    <div 
      className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto flex flex-col"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleDrop(e)}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-400 uppercase">Files</h2>
        <div className="flex space-x-2">
          <button
            onClick={onNewFile}
            className="p-1 hover:bg-gray-700 rounded-md transition-colors"
            title="New File"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={onNewFolder}
            className="p-1 hover:bg-gray-700 rounded-md transition-colors"
            title="New Folder"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <Breadcrumbs currentPath={currentPath} onNavigate={onNavigate} />

      <FileList
        files={files}
        folders={folders}
        currentPath={currentPath}
        activeFile={activeFile}
        onFileSelect={onFileSelect}
        onFileMove={onFileMove}
        onFileDelete={onFileDelete}
        onFolderDelete={onFolderDelete}
        onNavigate={onNavigate}
        onRename={onRename}
      />
    </div>
  );
}