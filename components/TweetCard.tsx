import React, { useState } from 'react';
import { RefreshIcon } from './icons/RefreshIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';

interface PostCardProps {
  postContent: string;
  setPostContent: (content: string) => void;
  imageUrl: string;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ postContent, setPostContent, imageUrl, onRegenerate, isRegenerating }) => {
  const [copyStatus, setCopyStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const charCount = postContent.length;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(postContent);
      setCopyStatus('SUCCESS');
      window.open('https://www.linkedin.com/feed/', '_blank', 'noopener,noreferrer');
      setTimeout(() => setCopyStatus('IDLE'), 3000); // Reset button after 3 seconds
    } catch (err) {
      console.error('Failed to copy text:', err);
      setCopyStatus('ERROR');
      setTimeout(() => setCopyStatus('IDLE'), 3000);
    }
  };
  
  const getButtonText = () => {
      switch (copyStatus) {
          case 'SUCCESS': return '¡Texto Copiado! Pegalo en LinkedIn';
          case 'ERROR': return 'Error al copiar. Intentalo de nuevo.';
          default: return 'Compartir en LinkedIn';
      }
  }

  return (
    <>
      <div className="w-full mt-8 animate-fade-in-up bg-gray-800/50 border border-teal-500/30 rounded-2xl shadow-lg shadow-teal-500/10 p-6 md:p-8">
        <h3 className="text-xl font-semibold text-teal-300 mb-4">Post de LinkedIn Generado</h3>
        
        {imageUrl && (
          <div className="mb-4 relative group transition-all duration-300">
            <img src={imageUrl} alt="Visualización generada por IA" className="rounded-xl w-full object-cover border border-gray-700 shadow-md" />
            <a
              href={imageUrl}
              download="ai_linkedin_image.jpeg"
              className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/80"
              aria-label="Descargar imagen"
              title="Descargar imagen"
            >
              <DownloadIcon />
            </a>
          </div>
        )}

        <div className="relative">
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="w-full h-64 bg-gray-900 border border-gray-700 rounded-lg p-4 text-gray-200 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-colors duration-200 resize-y"
            placeholder="El contenido de la publicación aparecerá aquí..."
          />
          <div className={`absolute bottom-3 right-3 text-sm font-medium text-gray-400`}>
            {charCount} Caracteres
          </div>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
           <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshIcon spinning={isRegenerating} />
            {isRegenerating ? 'Generando...' : 'Volver a generar'}
          </button>
          <button
            onClick={handleShare}
            disabled={!postContent || !imageUrl}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 font-bold rounded-full px-6 py-2.5 transition-all duration-300 ease-in-out shadow-md
              ${copyStatus === 'SUCCESS' ? 'bg-green-600 hover:bg-green-700' : ''}
              ${copyStatus === 'ERROR' ? 'bg-red-600 hover:bg-red-700' : ''}
              ${copyStatus === 'IDLE' ? 'bg-blue-700 hover:bg-blue-800' : ''}
              text-white disabled:bg-gray-600 disabled:cursor-not-allowed`}
          >
            <LinkedInIcon />
            {getButtonText()}
          </button>
        </div>
      </div>
    </>
  );
};

export default PostCard;