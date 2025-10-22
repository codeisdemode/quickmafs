import React, { useRef } from 'react';
import { UploadIcon, WandIcon } from './Icons';

interface WelcomeScreenProps {
    onImageUpload: (file: File) => void;
    onGenerateProblem: () => void;
    isLoading: boolean;
    loadingAction: 'upload' | 'generate' | null;
    courseName: string;
}

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onImageUpload, onGenerateProblem, isLoading, loadingAction, courseName }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageUpload(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
             <div className="max-w-xl w-full">
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">Ready for <span className="text-blue-600">{courseName}</span>?</h2>
                <p className="text-gray-500 mb-8">
                    Choose how you want to start your session.
                </p>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    disabled={isLoading}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                        onClick={handleUploadClick}
                        disabled={isLoading}
                        className="p-6 border-2 border-gray-300 rounded-lg text-left hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex flex-col items-start"
                    >
                        <div className="bg-blue-100 p-3 rounded-full mb-4">
                            <UploadIcon className="w-7 h-7 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Upload Your Problem</h3>
                        <p className="text-gray-500 text-sm">Get help with a specific problem from your homework.</p>
                         {isLoading && loadingAction === 'upload' && <div className="absolute inset-0 bg-white/50 flex items-center justify-center"><LoadingSpinner/></div>}
                    </button>

                     <button
                        onClick={onGenerateProblem}
                        disabled={isLoading}
                        className="p-6 border-2 border-gray-300 rounded-lg text-left hover:border-green-500 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex flex-col items-start"
                    >
                        <div className="bg-green-100 p-3 rounded-full mb-4">
                            <WandIcon className="w-7 h-7 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Practice a New Problem</h3>
                        <p className="text-gray-500 text-sm">Let me create a practice problem for you to solve.</p>
                         {isLoading && loadingAction === 'generate' && <div className="absolute inset-0 bg-white/50 flex items-center justify-center"><LoadingSpinner/></div>}
                    </button>
                </div>
            </div>
        </div>
    );
};