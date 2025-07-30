import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');

  async function handleUpload() {
    if (!file) return alert('Please select a file.');

    // Step 1: Create IV and AES key
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = crypto.getRandomValues(new Uint8Array(16)); // 128-bit key
    const cryptoKey = await crypto.subtle.importKey('raw', key, 'AES-GCM', false, ['encrypt']);

    // Step 2: Read and encrypt file
    const fileBuffer = await file.arrayBuffer();
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      fileBuffer
    );

    // Step 3: Combine IV + encrypted data
    const blob = new Blob([iv, new Uint8Array(encrypted)]);

    // Step 4: Upload to backend
    const form = new FormData();
    form.append('file', blob, file.name);
    //console.log('Uploading file:', file.name);
    const res = await axios.post('http://localhost:4000/upload', form);


    // Step 5: Generate secure link with AES key in URL fragment
    const keyB64 = btoa(String.fromCharCode(...key)); // base64 encode key
    const secureLink = `http://localhost:3000/download/${res.data.id}#${keyB64}`;
    setLink(secureLink);
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🔐 SecureDrop</h1>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload & Encrypt</button>
      {link && <p><a href={link} target="_blank" rel="noreferrer">Share this secure link</a></p>}
    </div>
  );
}

export default App;
