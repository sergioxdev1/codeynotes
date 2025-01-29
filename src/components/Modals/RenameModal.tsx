import React from 'react';
import { X } from 'lucide-react';
import { RenameItem } from '../../types';

interface RenameModalProps {
  isOpen: boolean;
  item: RenameItem | null;
  newName: string;
  onClose: () => void;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function RenameModal({
  isOpen,
  item,
  newName,
  onClose,
  onChange,
  onSubmit
}: RenameModalProps) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Rename {item.type === 'file' ? 'File' : 'Folder'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="newName" className="block text-sm font-medium text-gray-300 mb-1">
              New Name
            </label>
            <input
              type="text"
              id="newName"
              value={newName}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white"
            />
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
              Rename
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}