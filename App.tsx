import React from 'react';
import ChatInterface from './components/ChatInterface';
import { Icon } from './components/Icon';

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen font-sans bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="flex-shrink-0 bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
               <Icon name="gemini" className="w-8 h-8 text-indigo-500" />
              <h1 className="text-xl font-bold tracking-tight">ADSSTF AI Assistant</h1>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  );
};

export default App;
