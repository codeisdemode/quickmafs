
import React, { useEffect, useRef } from 'react';
import { Message } from '../types';

declare global {
  interface Window {
    MathJax: {
      typesetPromise: (elements?: HTMLElement[]) => Promise<void>;
    };
  }
}

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const { sender, text } = message;
    const isUser = sender === 'user';
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (window.MathJax && textRef.current) {
            window.MathJax.typesetPromise([textRef.current]).catch((err) => console.error('MathJax typeset error:', err));
        }
    }, [text]);

    const bubbleClasses = isUser
        ? 'bg-blue-600 text-white self-end'
        : 'bg-gray-200 text-gray-800 self-start';

    const containerClasses = isUser ? 'flex justify-end' : 'flex justify-start';

    // Simple markdown link replacement: [title](url) -> <a href="url" target="_blank">title</a>
    // This is a basic implementation for safety.
    const renderTextWithLinks = (inputText: string) => {
        const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
        return inputText.replace(linkRegex, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">$1</a>');
    };
    
    // A more robust way to handle text splitting and rendering to avoid full dangerouslySetInnerHTML
    const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/g).filter(Boolean);

    return (
        <div className={containerClasses}>
            <div
                className={`p-3 rounded-lg max-w-md md:max-w-lg shadow-sm ${bubbleClasses}`}
                ref={textRef}
            >
                {/* Render text parts to handle LaTeX correctly with MathJax */}
                {parts.map((part, index) => {
                    if (part.startsWith('$') && part.endsWith('$')) {
                        return <span key={index}>{part}</span>;
                    }
                    // For non-math parts, you might want to render them safely
                    // For simplicity, we are rendering as text content here.
                    // This avoids complex markdown parsing for now.
                    return <span key={index}>{part}</span>;
                })}
            </div>
        </div>
    );
};
