import React, { useState, useCallback, useEffect } from 'react';
import { Message } from './types';
import { startTutoringSession, continueTutoring, startGeneratedSession } from './services/geminiService';
import { WelcomeScreen } from './components/WelcomeScreen';
import { TutoringSession } from './components/TutoringSession';
import { COURSES } from './curriculum';

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [generatedProblem, setGeneratedProblem] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingAction, setLoadingAction] = useState<'upload' | 'generate' | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    
    const [currentCourseIndex, setCurrentCourseIndex] = useState<number>(() => {
        const savedIndex = localStorage.getItem('socratic-math-tutor-course-index');
        return savedIndex ? parseInt(savedIndex, 10) : 0;
    });

    useEffect(() => {
        localStorage.setItem('socratic-math-tutor-course-index', currentCourseIndex.toString());
    }, [currentCourseIndex]);

    const currentCourse = COURSES[currentCourseIndex];

    const handleImageUpload = useCallback(async (file: File) => {
        setIsLoading(true);
        setLoadingAction('upload');
        setError(null);
        setIsCompleted(false);
        setGeneratedProblem(null);
        setImageFile(file);
        setImageUrl(URL.createObjectURL(file));
        setMessages([]);

        try {
            const initialResponse = await startTutoringSession(file, currentCourse.name);
            setMessages([{ id: crypto.randomUUID(), sender: 'ai', text: initialResponse }]);
        } catch (err) {
            console.error(err);
            setError('Failed to start tutoring session. Please check your API key and try again.');
            setImageFile(null);
            setImageUrl(null);
        } finally {
            setIsLoading(false);
            setLoadingAction(null);
        }
    }, [currentCourse]);

    const handleGenerateProblem = useCallback(async () => {
        setIsLoading(true);
        setLoadingAction('generate');
        setError(null);
        setIsCompleted(false);
        setImageFile(null);
        setImageUrl(null);
        setGeneratedProblem(null);
        setMessages([]);

        try {
            const { problemStatement, firstStep } = await startGeneratedSession(currentCourse.name);
            setGeneratedProblem(problemStatement);
            setMessages([{ id: crypto.randomUUID(), sender: 'ai', text: firstStep }]);
        } catch (err) {
            console.error(err);
            setError('Failed to generate a problem. Please try again.');
        } finally {
            setIsLoading(false);
            setLoadingAction(null);
        }
    }, [currentCourse]);


    const handleSendMessage = useCallback(async (text: string) => {
        if (!text.trim()) return;

        const userMessage: Message = { id: crypto.randomUUID(), sender: 'user', text };
        const currentMessages = [...messages, userMessage];
        setMessages(currentMessages);
        setIsLoading(true);
        setError(null);

        try {
            const { text: aiResponse, isCompleted: completed } = await continueTutoring(currentMessages, currentCourse.name);
            setMessages(prev => [...prev, { id: crypto.randomUUID(), sender: 'ai', text: aiResponse }]);
            if (completed) {
                setIsCompleted(true);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to get a response from the tutor. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [messages, currentCourse]);
    
    const handleReset = useCallback(() => {
        setImageFile(null);
        setImageUrl(null);
        setGeneratedProblem(null);
        setMessages([]);
        setError(null);
        setIsLoading(false);
        setLoadingAction(null);
        setIsCompleted(false);
    }, []);

    const handleNextCourse = useCallback(() => {
        setCurrentCourseIndex(prev => {
            const nextIndex = prev + 1;
            return nextIndex < COURSES.length ? nextIndex : prev; // Stay on last course if at the end
        });
        handleReset();
    }, [handleReset]);

    const showWelcome = !imageFile && !generatedProblem;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-4xl mx-auto">
                <header className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-gray-800">Socratic Math Tutor</h1>
                    <p className="text-xl text-blue-600 font-semibold mt-2">{currentCourse.name}</p>
                    <p className="text-md text-gray-500 mt-1">{currentCourse.description}</p>
                </header>
                
                <main className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {showWelcome ? (
                        <WelcomeScreen 
                            onImageUpload={handleImageUpload} 
                            onGenerateProblem={handleGenerateProblem}
                            isLoading={isLoading} 
                            loadingAction={loadingAction}
                            courseName={currentCourse.name}
                        />
                    ) : (
                        <TutoringSession
                            imageUrl={imageUrl}
                            problemStatement={generatedProblem}
                            messages={messages}
                            isLoading={isLoading}
                            onSendMessage={handleSendMessage}
                            onReset={handleReset}
                            error={error}
                            isCompleted={isCompleted}
                            onNextCourse={handleNextCourse}
                            courseName={currentCourse.name}
                        />
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;