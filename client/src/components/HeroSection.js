export default function HeroSection() {
  return (
    <main id="home" className="container">
      <hgroup style={{ textAlign: 'center', padding: '3rem 0' }}>
        <h1>SecureDrop</h1>
        <p>Share files securely with end-to-end encryption</p>
      </hgroup>

      <section style={{ textAlign: 'center', padding: '2rem 0' }}>
        <h2>Secure • Private • Temporary</h2>
        <p>
          Upload files with confidence knowing they're encrypted before leaving your device.
          Share the generated link and files automatically delete after first download.
        </p>

        <div className="container" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="#upload" className="primary" role="button">Start Sharing</a>
          <a href="#about" className="secondary outline" role="button">Learn More</a>
        </div>
      </section>

      <div className="grid">
        <article>
          <header>Client-Side Encryption</header>
          <p>Files are encrypted in your browser using AES-GCM before upload.</p>
        </article>
        <article>
          <header>Auto-Expiring</header>
          <p>Files automatically delete after 10 minutes or first download.</p>
        </article>
        <article>
          <header>Secure Links</header>
          <p>Decryption keys are embedded in the share link, never stored on servers.</p>
        </article>
      </div>
    </main>
  );
}
