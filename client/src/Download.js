import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "@picocss/pico/css/pico.min.css";
import '@picocss/pico/css/pico.colors.css';

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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <nav className="container-fluid">
        <ul>
          <li>
            <a
              href="/"
              style={{ fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none' }}
            >
              🔐 SecureDrop
            </a>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <article style={{ textAlign: 'center', maxWidth: '600px', width: '100%' }}>
          <header>
            <hgroup>
              <h1>🔓 Secure Download</h1>
              <p>Decrypting and downloading your file...</p>
            </hgroup>
          </header>

          <div style={{ padding: '2rem 0' }}>
            {status === 'Downloading...' && (
              <>
                <div aria-busy="true" style={{ marginBottom: '1rem' }}></div>
                <p>⏳ {status}</p>
                <small>Please wait while we decrypt your file securely...</small>
              </>
            )}

            {status === '✅ File downloaded & decrypted!' && (
              <div role="alert" style={{ color: 'var(--primary)' }}>
                <h3>✅ Success!</h3>
                <p>Your file has been downloaded and decrypted successfully.</p>
                <small>The file will now appear in your downloads folder.</small>
              </div>
            )}

            {status.includes('❌') && (
              <div role="alert" style={{ color: 'var(--del-color)' }}>
                <h3>❌ Download Failed</h3>
                <p>Failed to decrypt or download the file.</p>
                <details>
                  <summary>Possible reasons</summary>
                  <ul style={{ textAlign: 'left' }}>
                    <li>The download link has expired (files expire after 10 minutes)</li>
                    <li>The file has already been downloaded once</li>
                    <li>The encryption key in the URL is invalid</li>
                    <li>Network connection issues</li>
                  </ul>
                </details>
                <div style={{ marginTop: '2rem' }}>
                  <a href="/" role="button" className="secondary">
                    🏠 Go Back to SecureDrop
                  </a>
                </div>
              </div>
            )}
          </div>

          <footer style={{ marginTop: '3rem' }}>
            <small>
              🔒 This download uses end-to-end encryption.
              The file was decrypted locally in your browser.
            </small>
          </footer>
        </article>
      </main>

      {/* Footer */}
      <footer className="container-fluid" style={{ textAlign: 'center', padding: '2rem 0' }}>
        <small>Made by Andy</small>
      </footer>
    </div>
  );
}

export default Download;
