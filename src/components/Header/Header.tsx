import React, { useRef, useEffect } from 'react';
import { Code2, Menu, ChevronDown, Settings, Info, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface HeaderProps {
  onOpenAbout: () => void;
  onLogout: () => void;
  user: User | null;
}

export function Header({ onOpenAbout, onLogout, user }: HeaderProps) {
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = React.useState(false);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSettingsMenuOpen &&
        settingsButtonRef.current &&
        menuRef.current &&
        !settingsButtonRef.current.contains(event.target as Node) &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsSettingsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSettingsMenuOpen]);

  // Close menu if user becomes null
  useEffect(() => {
    if (!user) {
      setIsSettingsMenuOpen(false);
    }
  }, [user]);

  return (
    <header className="h-14 border-b border-gray-700 flex items-center justify-between px-4 bg-gray-900 relative z-10">
      <div className="flex items-center space-x-3">
        <Code2 className="w-6 h-6 text-blue-400" />
        <h1 className="text-xl font-semibold">SergioXDev - Code & Notes</h1>
      </div>
      <div className="flex items-center space-x-4">
        {user && (
          <>
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800 rounded-full">
              <UserIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">{user.email}</span>
            </div>
            <div className="relative">
              <button 
                ref={settingsButtonRef}
                onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors flex items-center space-x-1 group"
                aria-label="Settings menu"
              >
                <Menu className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSettingsMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSettingsMenuOpen && (
                <div 
                  ref={menuRef}
                  className="absolute right-0 top-12 w-56 bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-700 backdrop-blur-sm"
                >
                  <button
                    onClick={() => {
                      alert('User Settings - Coming soon!');
                      setIsSettingsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-700 transition-colors flex items-center space-x-2 group"
                  >
                    <Settings className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                    <span>User Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenAbout();
                      setIsSettingsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-700 transition-colors flex items-center space-x-2 group"
                  >
                    <Info className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                    <span>About this App</span>
                  </button>
                  <div className="h-px bg-gray-700 my-1"></div>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsSettingsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-700 transition-colors flex items-center space-x-2 group"
                  >
                    <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-500" />
                    <span className="text-red-400 group-hover:text-red-500">Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}