
import React from 'react';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center my-10 text-center animate-fade-in">
      <div className="w-12 h-12 border-4 border-t-blue-400 border-gray-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-gray-300">{message}</p>
    </div>
  );
};

export default Loader;
