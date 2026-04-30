import React from "react";
import "../style/ConfirmModal.css";

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <p>{message}</p>
        <div className="modal-actions">
          <button className="confirm-btn" onClick={onConfirm}>Yes, Delete</button>
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
