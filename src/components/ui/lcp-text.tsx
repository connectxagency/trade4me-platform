import React from 'react';

interface LCPTextProps {
  children: React.ReactNode;
  className?: string;
}

export function LCPText({ children, className = '' }: LCPTextProps) {
  return (
    <p 
      className={`lcp-text text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed ${className}`}
      style={{
        containIntrinsicSize: '896px 84px', // Prevent layout shift
        contentVisibility: 'auto'
      }}
    >
      {children}
    </p>
  );
}