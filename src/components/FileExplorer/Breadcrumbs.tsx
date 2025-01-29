import React from 'react';

interface BreadcrumbsProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function Breadcrumbs({ currentPath, onNavigate }: BreadcrumbsProps) {
  const getBreadcrumbs = () => {
    const paths = currentPath.split('/').filter(Boolean);
    return [
      { name: 'root', path: '/' },
      ...paths.map((name, index) => ({
        name,
        path: '/' + paths.slice(0, index + 1).join('/')
      }))
    ];
  };

  return (
    <div className="px-4 py-2 border-b border-gray-700 flex items-center space-x-1 overflow-x-auto">
      {getBreadcrumbs().map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          {index > 0 && <span className="text-gray-500">/</span>}
          <button
            onClick={() => onNavigate(crumb.path)}
            className="text-sm hover:text-blue-400 transition-colors whitespace-nowrap"
          >
            {crumb.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}