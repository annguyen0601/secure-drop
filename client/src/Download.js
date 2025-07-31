import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Download() {
  const { id } = useParams();
  const [status, setStatus] = useState('Downloading...');

  useEffect(() => {
    async function fetchAndDecrypt() {
      try {
        // 1. Get the AES key from the URL hash
        const hash = window.location.hash.slice(1); // remove #
        const keyBytes = new Uint8Array([...atob(hash)].map(c => c.charCodeAt(0)));

        const cryptoKey = await crypto.subtle.importKey(
          'raw',
          keyBytes,
          'AES-GCM',
          false,
          ['decrypt']
        );

        // 2. Download the encrypted file from backend
        const res = await fetch(`http://localhost:4000/download/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to download file: ${res.status}`);
        }

        const blob = await res.blob();
        const arrayBuffer = await blob.arrayBuffer();

        // 3. Extract IV and ciphertext
        const iv = arrayBuffer.slice(0, 12);
        const ciphertext = arrayBuffer.slice(12);

        // Get original filename from header
        const originalNameHeader = res.headers.get('X-Original-Filename');
        // console.log('Original filename header:', originalNameHeader);

        const originalName = originalNameHeader
          ? decodeURIComponent(originalNameHeader)
          : 'downloaded-file';

        // console.log('Final filename:', originalName);        // 4. Decrypt the file
        const decrypted = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv: new Uint8Array(iv) },
          cryptoKey,
          ciphertext
        );

        // 5. Create a blob for download
        const downloadBlob = new Blob([decrypted]);
        const url = URL.createObjectURL(downloadBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = originalName; // ✅ Use actual filename
        // console.log(`Downloading: ${originalName}`);
        a.click();
        URL.revokeObjectURL(url);
        setStatus('✅ File downloaded & decrypted!');
      } catch (err) {
        console.error(err);
        setStatus('❌ Failed to decrypt or download file.');
      }
    }

    fetchAndDecrypt();
  }, [id]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🔓 SecureDownload</h1>
      <p>{status}</p>
    </div>
  );
}

export default Download;
