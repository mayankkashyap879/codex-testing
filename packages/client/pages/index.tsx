import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('http://localhost:3001/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setMessage(JSON.stringify(data));
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Upload</button>
      </form>
      {message && <pre>{message}</pre>}
    </div>
  );
}
