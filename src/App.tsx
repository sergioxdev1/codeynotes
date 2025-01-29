import React, { useState, useCallback } from 'react';
import { Header } from './components/Header/Header';
import { FileExplorer } from './components/FileExplorer/FileExplorer';
import { CodeEditor } from './components/Editor/CodeEditor';
import { AboutModal } from './components/Modals/AboutModal';
import { NewFileModal } from './components/Modals/NewFileModal';
import { NewFolderModal } from './components/Modals/NewFolderModal';
import { RenameModal } from './components/Modals/RenameModal';
import { AuthModal } from './components/Auth/AuthModal';
import { FileData, FolderData } from './types';
import { getLanguageFromExtension } from './utils/fileUtils';
import { fileTemplates, STORAGE_KEY, defaultFiles } from './constants';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const {
    files,
    setFiles,
    folders,
    setFolders,
    activeFile,
    setActiveFile,
    currentPath,
    setCurrentPath
  } = useLocalStorage();

  const [isNewFileModalOpen, setIsNewFileModalOpen] = useState(false);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(!user);
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [newFileError, setNewFileError] = useState<string | null>(null);
  const [newFolderError, setNewFolderError] = useState<string | null>(null);
  const [itemToRename, setItemToRename] = useState<{ type: 'file' | 'folder', item: FileData | FolderData } | null>(null);
  const [newItemName, setNewItemName] = useState('');

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (!value) return;
    
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.name === activeFile.name && file.path === activeFile.path
          ? { ...file, content: value }
          : file
      )
    );
    setActiveFile(prev => ({ ...prev, content: value }));
  }, [activeFile.name, activeFile.path, setFiles, setActiveFile]);

  const createNewFile = () => {
    if (!newFileName.trim()) {
      setNewFileError('File name is required');
      return;
    }

    if (files.some(file => file.name === newFileName && file.path === currentPath)) {
      setNewFileError('A file with this name already exists in this folder');
      return;
    }

    const language = getLanguageFromExtension(newFileName);
    const newFile: FileData = {
      name: newFileName,
      language,
      content: fileTemplates[language] || '',
      path: currentPath
    };

    setFiles(prev => [...prev, newFile]);
    setActiveFile(newFile);
    setNewFileName('');
    setIsNewFileModalOpen(false);
    setNewFileError(null);
  };

  const createNewFolder = () => {
    if (!newFolderName.trim()) {
      setNewFolderError('Folder name is required');
      return;
    }

    const folderPath = currentPath === '/' 
      ? `/${newFolderName}` 
      : `${currentPath}/${newFolderName}`;

    if (folders.some(folder => folder.path === folderPath)) {
      setNewFolderError('A folder with this name already exists');
      return;
    }

    const newFolder: FolderData = {
      name: newFolderName,
      path: folderPath
    };

    setFolders(prev => [...prev, newFolder]);
    setNewFolderName('');
    setIsNewFolderModalOpen(false);
    setNewFolderError(null);
  };

  const handleFileDelete = (file: FileData) => {
    setFiles(prev => prev.filter(f => !(f.name === file.name && f.path === file.path)));
    if (activeFile.name === file.name && activeFile.path === file.path) {
      const remainingFiles = files.filter(f => !(f.name === file.name && f.path === file.path));
      if (remainingFiles.length > 0) {
        setActiveFile(remainingFiles[0]);
      }
    }
  };

  const handleFolderDelete = (folder: FolderData) => {
    setFiles(prev => prev.filter(file => !file.path.startsWith(folder.path)));
    setFolders(prev => prev.filter(f => !f.path.startsWith(folder.path)));
    
    if (currentPath.startsWith(folder.path)) {
      setCurrentPath('/');
    }
  };

  const handleFileMove = (file: FileData, targetPath: string) => {
    if (files.some(f => f.name === file.name && f.path === targetPath)) {
      alert('A file with this name already exists in the target folder');
      return;
    }

    setFiles(prev => prev.map(f => {
      if (f.name === file.name && f.path === file.path) {
        return { ...f, path: targetPath };
      }
      return f;
    }));
  };

  const handleRename = () => {
    if (!itemToRename || !newItemName.trim()) return;

    if (itemToRename.type === 'file') {
      const file = itemToRename.item as FileData;
      const newPath = file.path;
      
      if (files.some(f => f.name === newItemName && f.path === newPath && f !== file)) {
        alert('A file with this name already exists in this folder');
        return;
      }

      setFiles(prev => prev.map(f => {
        if (f.name === file.name && f.path === file.path) {
          const newFile = { ...f, name: newItemName, language: getLanguageFromExtension(newItemName) };
          if (activeFile.name === file.name && activeFile.path === file.path) {
            setActiveFile(newFile);
          }
          return newFile;
        }
        return f;
      }));
    } else {
      const folder = itemToRename.item as FolderData;
      const parentPath = folder.path.split('/').slice(0, -1).join('/');
      const newPath = parentPath === '' ? `/${newItemName}` : `${parentPath}/${newItemName}`;
      
      if (folders.some(f => f.path === newPath)) {
        alert('A folder with this name already exists');
        return;
      }

      setFolders(prev => prev.map(f => {
        if (f.path === folder.path) {
          return { ...f, name: newItemName, path: newPath };
        }
        if (f.path.startsWith(folder.path + '/')) {
          return { ...f, path: newPath + f.path.substring(folder.path.length) };
        }
        return f;
      }));

      setFiles(prev => prev.map(f => {
        if (f.path.startsWith(folder.path + '/') || f.path === folder.path) {
          return { ...f, path: newPath + f.path.substring(folder.path.length) };
        }
        return f;
      }));

      if (currentPath.startsWith(folder.path)) {
        setCurrentPath(newPath + currentPath.substring(folder.path.length));
      }
    }

    setIsRenameModalOpen(false);
    setItemToRename(null);
    setNewItemName('');
  };

  const handleLogout = async () => {
    await signOut();
    localStorage.removeItem(STORAGE_KEY);
    setFiles(defaultFiles);
    setFolders([]);
    setActiveFile(defaultFiles[0]);
    setCurrentPath('/');
    setIsAuthModalOpen(true);
  };

  if (authLoading) {
    return (
      <div className="h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      <Header 
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onLogout={handleLogout}
        user={user}
      />

      <div className="flex-1 flex">
        <FileExplorer
          files={files}
          folders={folders}
          currentPath={currentPath}
          activeFile={activeFile}
          onFileSelect={setActiveFile}
          onFileMove={handleFileMove}
          onFileDelete={handleFileDelete}
          onFolderDelete={handleFolderDelete}
          onNavigate={setCurrentPath}
          onNewFile={() => setIsNewFileModalOpen(true)}
          onNewFolder={() => setIsNewFolderModalOpen(true)}
          onRename={(type, item) => {
            setItemToRename({ type, item });
            setNewItemName(item.name);
            setIsRenameModalOpen(true);
          }}
        />

        <CodeEditor
          file={activeFile}
          onChange={handleEditorChange}
        />
      </div>

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      <NewFileModal
        isOpen={isNewFileModalOpen}
        fileName={newFileName}
        error={newFileError}
        onClose={() => {
          setIsNewFileModalOpen(false);
          setNewFileName('');
          setNewFileError(null);
        }}
        onChange={setNewFileName}
        onSubmit={createNewFile}
      />

      <NewFolderModal
        isOpen={isNewFolderModalOpen}
        folderName={newFolderName}
        error={newFolderError}
        onClose={() => {
          setIsNewFolderModalOpen(false);
          setNewFolderName('');
          setNewFolderError(null);
        }}
        onChange={setNewFolderName}
        onSubmit={createNewFolder}
      />

      <RenameModal
        isOpen={isRenameModalOpen}
        item={itemToRename}
        newName={newItemName}
        onClose={() => {
          setIsRenameModalOpen(false);
          setItemToRename(null);
          setNewItemName('');
        }}
        onChange={setNewItemName}
        onSubmit={handleRename}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default App;