import { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { apiFetch } from '../api';
import FoodCard from './FoodCard';
import './AnalyzeMealSection.css';

function AnalyzeMealSection({ onMealAnalyzed }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (prompt.trim()) {
        formData.append('user_prompt', prompt.trim());
      }

      const result = await apiFetch('/analyze-image', {
        method: 'POST',
        body: formData,
      });

      setResults(result.foods);
      setSelectedFile(null);
      setPreview(null);
      setPrompt('');
      onMealAnalyzed();
    } catch (err) {
      setError(err.message || 'Failed to analyze meal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="analyze-meal-section">
      <h2>Analyze Meal</h2>
      <p className="section-subtitle">Upload a meal image and let AI estimate nutrition.</p>

      <div className="analyze-card">
        <form onSubmit={handleAnalyze}>
          <div className="upload-zone" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
            <input
              type="file"
              id="meal-upload"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
              style={{ display: 'none' }}
            />
            <label htmlFor="meal-upload" className="upload-label">
              {preview ? (
                <div className="preview-container">
                  <img src={preview} alt="Preview" className="preview-image" />
                  <div className="preview-overlay">Change image</div>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <Upload size={32} />
                  <span>Drag & drop or click to upload</span>
                  <small>PNG, JPG, WebP up to 10MB</small>
                </div>
              )}
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="prompt">Optional Notes</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Chicken breast with brown rice and broccoli'"
              rows={3}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-box">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <button type="submit" className="btn-analyze" disabled={loading || !selectedFile}>
            {loading ? 'Analyzing with AI...' : 'Analyze Meal'}
          </button>
        </form>
      </div>

      {results && results.length > 0 && (
        <div className="results-section">
          <h3>Detected Foods</h3>
          <div className="foods-grid">
            {results.map((food, index) => (
              <FoodCard key={index} food={food} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default AnalyzeMealSection;
