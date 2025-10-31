
import React from 'react';

export const LogoIcon: React.FC = () => (
    <svg 
        width="44" 
        height="44" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="text-blue-500"
    >
        <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'currentColor', stopOpacity: 1 }} className="text-blue-400" />
                <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: 1 }} className="text-teal-300" />
            </linearGradient>
        </defs>
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="url(#logoGradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 7L12 12M12 12L22 7M12 12V22M12 2V12" stroke="url(#logoGradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 4.5L7 9.5" stroke="url(#logoGradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
