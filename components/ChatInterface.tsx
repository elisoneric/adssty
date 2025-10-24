import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Chat } from '@google/genai';
import { createChat, getChatResponse } from '../services/geminiService';
import { Message } from '../types';
import { Icon } from './Icon';

const ChatBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
          <Icon name="gemini" className="w-6 h-6 text-white" />
        </div>
      )}
      <div
        className={`max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl shadow-md ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-none'
            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
        }`}
      >
        <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{message.text}</p>
      </div>
       {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
          <Icon name="user" className="w-6 h-6 text-white" />
        </div>
      )}
    </div>
  );
};


const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hello! I am the AI assistant for the Adamawa State Scholarship Trust Fund. How can I help you today?",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatRef.current = createChat();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading || !chatRef.current) return;

    const userMessage: Message = { role: 'user', text: inputValue.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const responseText = await getChatResponse(chatRef.current, userMessage.text);
      const modelMessage: Message = { role: 'model', text: responseText };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: Message = { role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading]);

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="container mx-auto max-w-4xl">
          {messages.map((msg, index) => (
            <ChatBubble key={index} message={msg} />
          ))}
          {isLoading && (
             <div className="flex items-start gap-3 my-4 justify-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
                    <Icon name="gemini" className="w-6 h-6 text-white" />
                </div>
                <div className="max-w-md px-4 py-3 rounded-2xl shadow-md bg-white dark:bg-gray-700 rounded-bl-none">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey ? (e.preventDefault(), handleSendMessage()) : null}
              placeholder="Ask a question..."
              className="flex-1 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center transition-colors duration-200 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              <Icon name="send" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
