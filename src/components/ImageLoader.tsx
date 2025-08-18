import React, { useState } from 'react';

interface ImageLoaderProps {
  onImageLoad: (src: string) => void;
}

export const ImageLoader: React.FC<ImageLoaderProps> = ({ onImageLoad }) => {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        onImageLoad(src);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlLoad = () => {
    if (urlInput.trim()) {
      setLoading(true);
      onImageLoad(urlInput.trim());
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Load Training Image</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Upload Image</h3>
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileUpload}
          disabled={loading}
        />
      </div>

      <div>
        <h3>Or Load from URL</h3>
        <input
          type="url"
          placeholder="https://example.com/image.jpg"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          style={{ width: '300px', marginRight: '10px' }}
          disabled={loading}
        />
        <button onClick={handleUrlLoad} disabled={loading || !urlInput.trim()}>
          Load Image
        </button>
      </div>

      {loading && <p>Loading image...</p>}
    </div>
  );
};