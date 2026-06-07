import React, { useState, useRef } from 'react';
import api from '../services/api';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const UploadDropzone = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState('idle'); // idle | uploading | success | error
  const [fileName, setFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await uploadFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const uploadFile = async (file) => {
    // Check file format
    const allowedExtensions = /(\.pdf|\.docx|\.txt)$/i;
    if (!allowedExtensions.exec(file.name)) {
      setUploadState('error');
      setErrorMessage('Unsupported file format. Please upload PDF, DOCX, or TXT.');
      return;
    }

    setFileName(file.name);
    setUploadState('uploading');
    setErrorMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setUploadState('success');
        if (onUploadSuccess) {
          onUploadSuccess(response.data.memory);
        }
        
        // Reset after 3 seconds
        setTimeout(() => {
          setUploadState('idle');
          setFileName('');
        }, 3000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadState('error');
      setErrorMessage(
        error.response?.data?.message || 'File upload failed. Please try again.'
      );
    }
  };

  return (
    <div className="w-100">
      <form 
        onDragEnter={handleDrag} 
        onDragOver={handleDrag}
        onDragLeave={handleDrag} 
        onDrop={handleDrop}
        onSubmit={(e) => e.preventDefault()}
        onClick={uploadState === 'idle' || uploadState === 'error' ? triggerFileInput : undefined}
        className={`glass-card d-flex flex-column align-items-center justify-content-center text-center p-5 cursor-pointer border-dashed ${
          dragActive ? 'scanning' : ''
        }`}
        style={{
          border: '2px dashed rgba(255, 255, 255, 0.15)',
          cursor: uploadState === 'idle' || uploadState === 'error' ? 'pointer' : 'default',
          transition: 'all 0.3s ease'
        }}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="d-none"
          onChange={handleChange}
          accept=".pdf,.docx,.txt"
        />

        {uploadState === 'idle' && (
          <>
            <div className="p-3 rounded-circle bg-white-5 mb-3 d-flex align-items-center justify-content-center text-secondary">
              <UploadCloud size={36} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <h5 className="text-white mb-2 fw-semibold">Upload user knowledge</h5>
            <p className="text-secondary small mb-0 max-w-md">
              Drag & drop or click to upload your **Resume, Research Papers, Notes, or Project Docs** (PDF, DOCX, or TXT).
            </p>
          </>
        )}

        {uploadState === 'uploading' && (
          <>
            <div className="p-3 rounded-circle bg-white-5 mb-3 position-relative d-flex align-items-center justify-content-center">
              <Loader2 size={36} className="text-violet spin" style={{ color: 'var(--accent-primary)', animation: 'spin 1.5s linear infinite' }} />
            </div>
            <h5 className="text-white mb-2 fw-semibold">Ingesting Memory...</h5>
            <p className="text-secondary small mb-0 text-truncate max-width-300">
              Extracting text and generating summaries for:<br /><strong>{fileName}</strong>
            </p>
          </>
        )}

        {uploadState === 'success' && (
          <>
            <div className="p-3 rounded-circle bg-success-glow mb-3 d-flex align-items-center justify-content-center">
              <CheckCircle2 size={36} className="text-success" style={{ color: '#10b981' }} />
            </div>
            <h5 className="text-white mb-2 fw-semibold">Knowledge Ingested!</h5>
            <p className="text-success small mb-0 text-truncate max-width-300">
              Successfully processed and added to long-term memory: <br /><strong>{fileName}</strong>
            </p>
          </>
        )}

        {uploadState === 'error' && (
          <>
            <div className="p-3 rounded-circle bg-danger-glow mb-3 d-flex align-items-center justify-content-center">
              <AlertCircle size={36} className="text-danger" style={{ color: '#ef4444' }} />
            </div>
            <h5 className="text-white mb-2 fw-semibold">Ingestion Failed</h5>
            <p className="text-danger small mb-3">
              {errorMessage}
            </p>
            <button className="btn btn-secondary-glass btn-sm border-0 py-2 px-3">Try Another File</button>
          </>
        )}
      </form>

      <style>{`
        .bg-white-5 {
          background: rgba(255, 255, 255, 0.05);
        }
        .bg-success-glow {
          background: rgba(16, 185, 129, 0.1);
        }
        .bg-danger-glow {
          background: rgba(239, 68, 68, 0.1);
        }
        .max-width-300 {
          max-width: 300px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default UploadDropzone;
