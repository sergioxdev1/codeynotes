import React from 'react';
import { X } from 'lucide-react';

interface NewFileModalProps {
  isOpen: boolean;
  fileName: string;
  error: string | null;
  onClose: () => void;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function NewFileModal({
  isOpen,
  fileName,
  error,
  onClose,
  onChange,
  onSubmit
}: NewFileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Create New File</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="fileName" className="block text-sm font-medium text-gray-300 mb-1">
              File Name
            </label>
            <input
              type="text"
              id="fileName"
              value={fileName}
              onChange={(e) => onChange(e.target.value)}
              placeholder="e.g., script.js"
              className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
            {error && (
              <p className="mt-1 text-sm text-red-400">{error}</p>
            )}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}