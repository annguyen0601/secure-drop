import React, { useState } from 'react';
import axios from 'axios';

import './App.css';

import HeroSection from './components/HeroSection';
import UploadSection from './components/UploadSection';
import AboutSection from './components/AboutSection';

function App() {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  async function handleUpload() {
    if (!file) return alert('Please select a file.');

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = crypto.getRandomValues(new Uint8Array(16));
    const cryptoKey = await crypto.subtle.importKey('raw', key, 'AES-GCM', false, ['encrypt']);

    const fileBuffer = await file.arrayBuffer();
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, fileBuffer);
    const blob = new Blob([iv, new Uint8Array(encrypted)]);

    const form = new FormData();
    form.append('file', blob, file.name);

    const res = await axios.post('http://localhost:4000/upload', form);
    const keyB64 = btoa(String.fromCharCode(...key));
    setLink(`http://localhost:3000/download/${res.data.id}#${keyB64}`);
  }

  return (
    <div>
      <nav className="container-fluid">
        <ul><li><a href="#home">SecureDrop</a></li></ul>
        <ul>
          <li><a href="#about">About</a></li>
          <li>
            <button
              onClick={toggleTheme}
              className="secondary outline"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
          </li>
        </ul>
      </nav>

      <div style={{ flex: 1 }}>
        <HeroSection />
        <UploadSection file={file} setFile={setFile} handleUpload={handleUpload} link={link} />
        <AboutSection />
      </div>

      <footer className="container-fluid" style={{ textAlign: 'center', padding: '2rem 0' }}>
        <small>Made by Andy</small>
      </footer>
    </div>
  );
}

export default App;
