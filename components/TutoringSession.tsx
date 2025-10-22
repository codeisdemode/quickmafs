
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { MessageBubble } from './MessageBubble';
import { SendIcon, ResetIcon } from './Icons';

interface TutoringSessionProps {
    imageUrl: string;
    messages: Message[];
    isLoading: boolean;
    onSendMessage: (text: string) => void;
    onReset: () => void;
    error: string | null;
}

export const TutoringSession: React.FC<TutoringSessionProps> = ({
    imageUrl,
    messages,
    isLoading,
    onSendMessage,
    onReset,
    error
}) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSendMessage(input);
        setInput('');
    };

    return (
        <div className="flex flex-col md:flex-row h-[85vh] max-h-[900px]">
            <div className="w-full md:w-1/2 p-4 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-700">Your Problem</h3>
                    <button onClick={onReset} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                        <ResetIcon className="w-4 h-4" />
                        Start Over
                    </button>
                </div>
                <div className="relative w-full flex-grow rounded-lg overflow-hidden bg-gray-100">
                    <img src={imageUrl} alt="Math problem" className="object-contain w-full h-full" />
                </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col bg-gray-50">
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <MessageBubble key={msg.id} message={msg} />
                        ))}
                        {isLoading && <LoadingBubble />}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                 {error && (
                    <div className="p-4 border-t border-gray-200">
                        <p className="text-sm text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>
                    </div>
                )}
                <div className="p-4 border-t border-gray-200">
                    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isLoading ? "Tutor is thinking..." : "Type your answer or ask 'why'..."}
                            disabled={isLoading}
                            className="flex-1 block w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="inline-flex items-center justify-center p-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-transform duration-200 ease-in-out transform hover:scale-110"
                        >
                            <SendIcon className="w-6 h-6" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const LoadingBubble: React.FC = () => (
    <div className="flex justify-start">
        <div className="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-sm flex items-center space-x-2">
            <span className="text-sm">Tutor is thinking</span>
            <div className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse"></span>
            </div>
        </div>
    </div>
);
