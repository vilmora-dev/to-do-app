import React, { useState } from 'react';
import { Home, Inbox } from 'lucide-react';

export default function Sidebar({ currentView, onViewChange }) {
  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'inbox', icon: Inbox, label: 'Inbox' }
  ];

  return (
    <aside className="w-16 bg-white border-r border-gray-200 shadow-sm flex flex-col items-center py-6 gap-4">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`relative p-3 rounded-lg transition-all group ${
              isActive 
                ? 'bg-indigo-100 text-indigo-600' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
            title={item.label}
          >
            <Icon size={24} />
            
            {/* Tooltip */}
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {item.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}