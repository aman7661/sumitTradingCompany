import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

const Toast = ({ message, isVisible, onClose, type = 'success' }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-bounce">
      <CheckCircleIcon className="h-5 w-5" />
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:bg-green-700 rounded-full p-1">
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
