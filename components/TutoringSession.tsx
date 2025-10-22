import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { MessageBubble } from './MessageBubble';
import { SendIcon, ResetIcon } from './Icons';
import { LatexHelper } from './LatexHelper';
import { COURSES } from '../curriculum';


interface TutoringSessionProps {
    imageUrl: string | null;
    problemStatement: string | null;
    messages: Message[];
    isLoading: boolean;
    onSendMessage: (text: string) => void;
    onReset: () => void;
    error: string | null;
    isCompleted: boolean;
    onNextCourse: () => void;
    courseName: string;
}

export const TutoringSession: React.FC<TutoringSessionProps> = ({
    imageUrl,
    problemStatement,
    messages,
    isLoading,
    onSendMessage,
    onReset,
    error,
    isCompleted,
    onNextCourse,
    courseName
}) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleInsertLatex = (latex: string, cursorPosOffset: number) => {
        const inputElement = inputRef.current;
        if (!inputElement) return;

        const start = inputElement.selectionStart ?? 0;
        const end = inputElement.selectionEnd ?? 0;
        const currentValue = inputElement.value;

        const newValue = currentValue.substring(0, start) + latex + currentValue.substring(end);
        
        setInput(newValue);

        requestAnimationFrame(() => {
            if (inputRef.current) {
                inputRef.current.focus();
                const newCursorPos = start + cursorPosOffset;
                inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || isCompleted) return;
        onSendMessage(input);
        setInput('');
    };
    
    const isLastCourse = COURSES.findIndex(c => c.name === courseName) === COURSES.length - 1;


    return (
        <div className="flex flex-col md:flex-row h-[85vh] max-h-[900px]">
            <div className="w-full md:w-2/5 p-4 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-700">The Problem</h3>
                    <button onClick={onReset} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                        <ResetIcon className="w-4 h-4" />
                        Start Over
                    </button>
                </div>
                <div className="relative w-full flex-grow rounded-lg overflow-hidden bg-gray-100">
                    {imageUrl && <img src={imageUrl} alt="Math problem" className="object-contain w-full h-full" />}
                    {problemStatement && (
                        <div className="h-full flex items-center justify-center p-4">
                           <MessageBubble message={{ id: 'problem-statement', sender: 'ai', text: problemStatement }} />
                        </div>
                    )}
                </div>
            </div>
            <div className="w-full md:w-3/5 flex flex-col bg-gray-50">
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <MessageBubble key={msg.id} message={msg} />
                        ))}
                        {isLoading && !isCompleted && <LoadingBubble />}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                 {error && (
                    <div className="p-4 border-t border-gray-200">
                        <p className="text-sm text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>
                    </div>
                )}
                <div className="p-4 border-t border-gray-200">
                    {isCompleted ? (
                        <CompletionCard onNextCourse={onNextCourse} isLastCourse={isLastCourse} />
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col">
                            <div className="flex items-center space-x-2">
                                <input
                                    ref={inputRef}
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
                            </div>
                            <LatexHelper onInsert={handleInsertLatex} />
                        </form>
                    )}
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

const CompletionCard: React.FC<{onNextCourse: () => void; isLastCourse: boolean}> = ({ onNextCourse, isLastCourse }) => (
    <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800">Congratulations, you solved it!</h3>
        {isLastCourse ? (
             <p className="text-green-700 mt-1">You've completed the entire curriculum!</p>
        ) : (
            <>
                <p className="text-green-700 mt-1">Ready for the next challenge?</p>
                <button 
                    onClick={onNextCourse}
                    className="mt-3 px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    Next Course
                </button>
            </>
        )}
    </div>
);