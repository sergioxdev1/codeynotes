import React from 'react';
import Editor, { loader } from '@monaco-editor/react';
import { FileData } from '../../types';

// Configure Monaco loader with fallback CDN
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
  },
  'vs/nls': {
    availableLanguages: {}
  }
});

interface CodeEditorProps {
  file: FileData;
  onChange: (value: string | undefined) => void;
}

export function CodeEditor({ file, onChange }: CodeEditorProps) {
  const [isEditorReady, setIsEditorReady] = React.useState(false);

  const handleEditorDidMount = (editor: any) => {
    setIsEditorReady(true);
    editor.focus();
  };

  const handleEditorWillMount = () => {
    // Pre-configure editor options before mounting
    return {
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: 'on',
      contextmenu: true,
      quickSuggestions: true,
      formatOnPaste: true,
      formatOnType: true
    };
  };

  return (
    <div className="flex-1 h-full relative">
      <Editor
        height="100%"
        language={file.language}
        value={file.content}
        theme="vs-dark"
        onChange={onChange}
        onMount={handleEditorDidMount}
        beforeMount={handleEditorWillMount}
        loading={
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-gray-400 flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
              <span>Loading editor...</span>
            </div>
          </div>
        }
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          contextmenu: true,
          quickSuggestions: true,
          formatOnPaste: true,
          formatOnType: true
        }}
      />
      {!isEditorReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-gray-400 flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
            <span>Loading editor...</span>
          </div>
        </div>
      )}
    </div>
  );
}