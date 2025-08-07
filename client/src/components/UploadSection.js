export default function UploadSection({ file, setFile, handleUpload, link, loading }) {
  return (
    <section id="upload" className="container" style={{ padding: '4rem 0' }}>
      <hgroup>
        <h1>Upload & Encrypt</h1>
        <p>Select a file to securely share with end-to-end encryption</p>
      </hgroup>

      <article>
        <div class="container">
          <header><h3>Choose File</h3></header>
          <input type="file" onChange={e => setFile(e.target.files[0])} />

          {loading ? (
            <div className="upload-status">
              <p>Encrypting & Uploading...</p>
              <div className="spinner"></div>
            </div>
          ) : (
            <button
              onClick={handleUpload}
              disabled={!file}
              className={file ? 'primary' : 'secondary'}
            >
              {file ? 'Encrypt & Upload' : 'Select a file first'}
            </button>
          )}
        </div>

        {link && !loading && (
          <details open style={{ marginTop: '2rem', animation: 'fadeIn 0.5s ease-in-out' }}>
            <summary>File uploaded successfully!</summary>
            <p>
              <strong>Secure Link:</strong><br />
              <a href={link} target="_blank" rel="noreferrer" className="contrast">{link}</a>
            </p>
            <small>This link will expire in 10 minutes and can only be downloaded once.</small>
          </details>
        )}
      </article>
    </section>
  );
}
