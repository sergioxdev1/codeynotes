export function getFileIcon(fileName: string) {
  if (fileName.endsWith('.jsx') || fileName.endsWith('.js')) {
    return 'file-code';
  }
  if (fileName.endsWith('.css')) {
    return 'file-text';
  }
  if (fileName.endsWith('.html')) {
    return 'file';
  }
  return 'file-json';
}

export function getLanguageFromExtension(fileName: string): string {
  if (fileName.endsWith('.jsx') || fileName.endsWith('.js')) return 'javascript';
  if (fileName.endsWith('.css')) return 'css';
  if (fileName.endsWith('.html')) return 'html';
  return 'plaintext';
}