// components/Modal.js
import React from 'react';

export default function Modal({ show, type, message, onClose }) {
  if (!show) return null;

  const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const textColor = type === 'success' ? 'text-green-700' : 'text-red-700';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className={`p-6 rounded-lg shadow-lg ${bgColor}`}>
        <p className={`text-lg font-medium ${textColor}`}>{message}</p>
        <button
          className="flex mx-auto mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          onClick={onClose}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
