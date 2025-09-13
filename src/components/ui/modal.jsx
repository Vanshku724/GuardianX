// src/components/ui/modal.jsx
import React from "react";

export function Modal({ children, isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-[90%]">
        {children}
        <button
          onClick={onClose}
          className="mt-4 text-sm text-red-600 hover:underline"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export function ModalHeader({ children }) {
  return <h2 className="text-lg font-bold mb-2">{children}</h2>;
}

export function ModalContent({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function ModalFooter({ children }) {
  return <div className="flex justify-end gap-2">{children}</div>;
}
