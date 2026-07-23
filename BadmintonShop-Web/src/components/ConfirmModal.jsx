import React from 'react';
import { HiOutlineExclamationCircle, HiOutlineX } from 'react-icons/hi';
import './styles/ConfirmModal.css';

export default function ConfirmModal({
  isOpen,
  title = 'Confirm action',
  message = 'Are you sure you want to continue?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" role="presentation" onMouseDown={onCancel}>
      <div
        className="confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={`confirm-modal-icon ${variant}`}>
          <HiOutlineExclamationCircle />
        </div>

        <button className="confirm-modal-close" type="button" onClick={onCancel} aria-label="Close">
          <HiOutlineX />
        </button>

        <h2 id="confirm-modal-title">{title}</h2>
        <p>{message}</p>

        <div className="confirm-modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${variant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
