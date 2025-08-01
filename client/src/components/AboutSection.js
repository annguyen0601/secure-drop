export default function AboutSection() {
  return (
    <section id="about" className="container">
      <hgroup>
        <h1>About SecureDrop</h1>
        <p>End-to-end encrypted file sharing made simple</p>
      </hgroup>

      <div className="grid">
        <article>
          <header>Security First</header>
          <p>
            Files are encrypted client-side using AES-GCM before upload.
            The encryption key never leaves your browser and is embedded in the share link.
          </p>
        </article>

        <article>
          <header>Temporary Storage</header>
          <p>
            Files automatically expire after 10 minutes and are permanently deleted
            after the first download for maximum security.
          </p>
        </article>

        <article>
          <header>Zero Knowledge</header>
          <p>
            Our servers never see your unencrypted files. Even we can't access
            your data without the encryption key from your share link.
          </p>
        </article>
      </div>

      <article>
        <header>How it works</header>
        <ol>
          <li>Select a file and it gets encrypted in your browser</li>
          <li>Encrypted file is uploaded to our temporary storage</li>
          <li>You receive a secure link containing the decryption key</li>
          <li>Recipients use the link to download and decrypt the file</li>
          <li>File is permanently deleted after first download</li>
        </ol>
      </article>
    </section>
  );
}
