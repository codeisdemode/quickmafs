
import React, { useRef } from 'react';
import { UploadIcon } from './Icons';

interface WelcomeScreenProps {
    onImageUpload: (file: File) => void;
    isLoading: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onImageUpload, isLoading }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageUpload(file);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="p-8 text-center flex flex-col items-center justify-center h-[60vh] min-h-[400px]">
            <div className="max-w-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Let's Solve a Problem Together</h2>
                <p className="text-gray-500 mb-6">
                    Upload a photo of a calculus or algebra problem, and I'll guide you through it, step by step. I won't give you the answer, but I'll help you find it.
                </p>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    disabled={isLoading}
                />
                <button
                    onClick={handleButtonClick}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <UploadIcon className="w-6 h-6 mr-2" />
                            Upload Math Problem
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
