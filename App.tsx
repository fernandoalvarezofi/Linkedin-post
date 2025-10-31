import React, { useState, useCallback } from 'react';
import { generateLinkedInPost, generateImageForPost, generateCreativeTopic } from './services/geminiService';
import Header from './components/Header';
import PostCard from './components/TweetCard';
import Loader from './components/Loader';
import { RobotIcon } from './components/icons/RobotIcon';
import { LightbulbIcon } from './components/icons/LightbulbIcon';

type LoadingStep = 'IDLE' | 'GENERATING_POST' | 'GENERATING_IMAGE' | 'DONE' | 'ERROR';

const App: React.FC = () => {
  const [loadingStep, setLoadingStep] = useState<LoadingStep>('IDLE');
  const [isGeneratingTopic, setIsGeneratingTopic] = useState<boolean>(false);
  const [topic, setTopic] = useState<string>('Las 5 mejores herramientas de IA para aumentar la productividad');
  const [postContent, setPostContent] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleGenerateTopic = useCallback(async () => {
    setIsGeneratingTopic(true);
    setError('');
    try {
        const newTopic = await generateCreativeTopic();
        setTopic(newTopic);
    } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Error al sugerir idea: ${errorMessage}`);
    } finally {
        setIsGeneratingTopic(false);
    }
  }, []);

  const handleGeneratePost = useCallback(async () => {
    if (!topic.trim()) {
        setError('Por favor, introduce un tema para la publicación.');
        return;
    }
    setLoadingStep('GENERATING_POST');
    setError('');
    setPostContent('');
    setImageUrl('');

    try {
      const content = await generateLinkedInPost(topic);
      setPostContent(content);
      setLoadingStep('GENERATING_IMAGE');

      const generatedImageUrl = await generateImageForPost(content);
      setImageUrl(generatedImageUrl);

      setLoadingStep('DONE');
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Hubo un error: ${errorMessage}. Por favor, inténtalo de nuevo.`);
      setLoadingStep('ERROR');
    }
  }, [topic]);

  const getLoadingMessage = () => {
    switch (loadingStep) {
      case 'GENERATING_POST':
        return 'Generando contenido educativo para LinkedIn...';
      case 'GENERATING_IMAGE':
        return 'Creando un visual profesional para el post...';
      default:
        return '';
    }
  };
  
  const isProcessing = loadingStep === 'GENERATING_POST' || loadingStep === 'GENERATING_IMAGE';

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="w-full max-w-2xl mx-auto flex flex-col items-center flex-grow">
        <div className="bg-gray-800 border border-blue-500/30 rounded-2xl shadow-2xl shadow-blue-500/10 p-6 md:p-8 mt-8 w-full">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
              Crea tu Próximo Post para LinkedIn
            </h2>
            <p className="text-gray-400 mt-2">
              Genera contenido educativo y de valor sobre IA para tu red profesional.
            </p>
          </div>
          <div className="mt-8">
             <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-2">
                Tema de la Publicación (o genera una idea)
             </label>
             <div className="flex items-center gap-2">
                <input
                    id="topic"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Escribe un tema o una pregunta..."
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-colors duration-200"
                    disabled={isProcessing || isGeneratingTopic}
                />
                <button
                    onClick={handleGenerateTopic}
                    disabled={isProcessing || isGeneratingTopic}
                    title="Sugerir una idea creativa"
                    className="flex-shrink-0 bg-gray-700 hover:bg-gray-600 text-teal-300 rounded-lg p-3 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <LightbulbIcon spinning={isGeneratingTopic} />
                </button>
             </div>
          </div>
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleGeneratePost}
              disabled={isProcessing || isGeneratingTopic || !topic.trim()}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold rounded-full px-8 py-3 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-lg shadow-blue-500/20"
            >
              <RobotIcon />
              {isProcessing ? 'Generando...' : 'Generar Post con IA'}
            </button>
          </div>
        </div>

        {isProcessing && <Loader message={getLoadingMessage()} />}
        
        {error && !isProcessing && (
            <div className="mt-6 w-full text-center bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg">
                <p>{error}</p>
            </div>
        )}

        {(loadingStep === 'DONE' || (loadingStep === 'ERROR' && postContent)) && (
          <PostCard 
            postContent={postContent} 
            setPostContent={setPostContent} 
            imageUrl={imageUrl}
            onRegenerate={handleGeneratePost}
            isRegenerating={isProcessing}
          />
        )}
      </main>
      <footer className="w-full max-w-2xl mx-auto text-center text-gray-500 text-sm py-4">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;