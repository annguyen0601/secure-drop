import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css';

import HeroSection from './components/HeroSection';
import UploadSection from './components/UploadSection';
import AboutSection from './components/AboutSection';

function App() {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'dark'
    return localStorage.getItem('theme') || 'dark';
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set theme attribute and save to localStorage
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  async function handleUpload() {
    if (!file) return alert('Please select a file.');

    try {
      setLoading(true); // Show animation

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const key = crypto.getRandomValues(new Uint8Array(16));
      const cryptoKey = await crypto.subtle.importKey('raw', key, 'AES-GCM', false, ['encrypt']);

      const fileBuffer = await file.arrayBuffer();
      const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, fileBuffer);
      const blob = new Blob([iv, new Uint8Array(encrypted)]);

      const form = new FormData();
      form.append('file', blob, file.name);

      const res = await axios.post(`${process.env.REACT_APP_SERVER}/upload`, form);
      const keyB64 = btoa(String.fromCharCode(...key));
      setLink(`${process.env.REACT_APP_CLIENT}/download/${res.data.id}#${keyB64}`);
    } catch (err) {
      alert('Upload failed. Try again.');
    } finally {
      setLoading(false); // Hide animation
    }
  }

  return (
    <div>
      <nav className="container-fluid">
        <ul><li><a href="#home">SecureDrop</a></li></ul>
        <ul>
          <li><a href="#about">About</a></li>
          <li>
            <div className="theme-switcher">
              <input
                type="checkbox"
                id="theme-toggle"
                checked={theme === 'light'}
                onChange={toggleTheme}
                aria-label="Toggle theme"
                style={{ display: 'none' }}
              />
              <label htmlFor="theme-toggle" className="slider round"></label>
              {/* <span>{theme === 'light' ? 'Light' : 'Dark'}</span> */}
            </div>
          </li>
        </ul>
      </nav>

      <div style={{ flex: 1 }}>
        <HeroSection />
        <UploadSection file={file} setFile={setFile} handleUpload={handleUpload} link={link} loading={loading} />
        <AboutSection />
      </div>

      <footer className="container-fluid" style={{ textAlign: 'center', padding: '2rem 0' }}>
        <small>Made by Andy</small>
      </footer>
    </div>
  );
}

export default App;
