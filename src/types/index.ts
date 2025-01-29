export interface FileData {
  name: string;
  language: string;
  content: string;
  path: string;
}

export interface FolderData {
  name: string;
  path: string;
}

export interface RenameItem {
  type: 'file' | 'folder';
  item: FileData | FolderData;
}