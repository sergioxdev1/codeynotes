import { useState, useEffect } from 'react';
import { FileData, FolderData } from '../types';
import { STORAGE_KEY, defaultFiles } from '../constants';

interface StorageState {
  files: FileData[];
  folders: FolderData[];
  activeFilePath: string;
  activeFileName: string;
  currentPath: string;
}

export function useLocalStorage() {
  const [files, setFiles] = useState<FileData[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { files } = JSON.parse(saved);
      return files;
    }
    return defaultFiles;
  });
  
  const [folders, setFolders] = useState<FolderData[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { folders } = JSON.parse(saved);
      return folders;
    }
    return [];
  });

  const [activeFile, setActiveFile] = useState<FileData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { activeFilePath, activeFileName, files } = JSON.parse(saved);
      const savedActiveFile = files.find(
        (f: FileData) => f.path === activeFilePath && f.name === activeFileName
      );
      return savedActiveFile || files[0];
    }
    return files[0];
  });

  const [currentPath, setCurrentPath] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { currentPath } = JSON.parse(saved);
      return currentPath;
    }
    return '/';
  });

  useEffect(() => {
    const state: StorageState = {
      files,
      folders,
      activeFilePath: activeFile.path,
      activeFileName: activeFile.name,
      currentPath
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [files, folders, activeFile, currentPath]);

  return {
    files,
    setFiles,
    folders,
    setFolders,
    activeFile,
    setActiveFile,
    currentPath,
    setCurrentPath
  };
}