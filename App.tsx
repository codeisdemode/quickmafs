
import React, { useState, useCallback } from 'react';
import { Message } from './types';
import { startTutoringSession, continueTutoring } from './services/geminiService';
import { WelcomeScreen } from './components/WelcomeScreen';
import { TutoringSession } from './components/TutoringSession';

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = useCallback(async (file: File) => {
        setIsLoading(true);
        setError(null);
        setImageFile(file);
        setImageUrl(URL.createObjectURL(file));
        setMessages([]);

        try {
            const initialResponse = await startTutoringSession(file);
            setMessages([{ id: crypto.randomUUID(), sender: 'ai', text: initialResponse }]);
        } catch (err) {
            console.error(err);
            setError('Failed to start tutoring session. Please check your API key and try again.');
            setImageFile(null); // Reset on failure
            setImageUrl(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSendMessage = useCallback(async (text: string) => {
        if (!text.trim()) return;

        const userMessage: Message = { id: crypto.randomUUID(), sender: 'user', text };
        const currentMessages = [...messages, userMessage];
        setMessages(currentMessages);
        setIsLoading(true);
        setError(null);

        try {
            const aiResponse = await continueTutoring(currentMessages);
            setMessages(prev => [...prev, { id: crypto.randomUUID(), sender: 'ai', text: aiResponse }]);
        } catch (err) {
            console.error(err);
            setError('Failed to get a response from the tutor. Please try again.');
            // Don't remove the user's message on failure
        } finally {
            setIsLoading(false);
        }
    }, [messages]);
    
    const handleReset = useCallback(() => {
        setImageFile(null);
        setImageUrl(null);
        setMessages([]);
        setError(null);
        setIsLoading(false);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-3xl mx-auto">
                <header className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-gray-800">Socratic Math Tutor</h1>
                    <p className="text-lg text-gray-600 mt-2">Your patient AI partner for conquering calculus and algebra.</p>
                </header>
                
                <main className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {!imageFile || !imageUrl ? (
                        <WelcomeScreen onImageUpload={handleImageUpload} isLoading={isLoading} />
                    ) : (
                        <TutoringSession
                            imageUrl={imageUrl}
                            messages={messages}
                            isLoading={isLoading}
                            onSendMessage={handleSendMessage}
                            onReset={handleReset}
                            error={error}
                        />
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;
