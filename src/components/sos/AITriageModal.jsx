// src/components/sos/AITriageModal.jsx
import React, { useState } from "react";
// Use relative imports for Modal and Button
import { Modal, ModalContent, ModalHeader, ModalFooter } from "../ui/modal";
import { Button } from "../ui/button";

export default function AITriageModal({ isOpen, onClose, onSubmit, isProcessing }) {
  const [type, setType] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!type.trim()) return alert("Please enter an emergency type");
    onSubmit({ type, notes });
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-md">
        <ModalHeader>
          <h2 className="text-xl font-bold">Confirm Emergency</h2>
        </ModalHeader>
        <div className="space-y-4 p-4">
          <input
            type="text"
            placeholder="Emergency Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <textarea
            placeholder="Additional Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <ModalFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Submit"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
