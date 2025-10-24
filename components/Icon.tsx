import React from 'react';

interface IconProps {
  name: string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6' }) => {
  // Fix: Replaced JSX.Element with React.ReactElement to resolve the "Cannot find namespace 'JSX'" error.
  const icons: { [key: string]: React.ReactElement } = {
    gemini: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.5,2.11c-1.83-0.56-3.8-0.56-5.63,0c-2.29,0.7-4.3,2.2-5.63,4.38C-0.29,9.36-0.29,14.64,1.24,17.52 c1.33,2.18,3.34,3.68,5.63,4.38c1.83,0.56,3.8,0.56,5.63,0c2.29-0.7,4.3-2.2,5.63-4.38c1.53-2.88,1.53-8.16,0-11.04 C16.8,4.31,14.79,2.81,12.5,2.11z M12,19.25c-0.83,0-1.5-0.67-1.5-1.5s0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5S12.83,19.25,12,19.25z M12,12.5c-2.34,0-4.25-1.91-4.25-4.25S9.66,4,12,4s4.25,1.91,4.25,4.25S14.34,12.5,12,12.5z" />
      </svg>
    ),
    chat: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
      </svg>
    ),
    user: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ),
    send: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
      </svg>
    ),
  };
  return icons[name] || null;
};
