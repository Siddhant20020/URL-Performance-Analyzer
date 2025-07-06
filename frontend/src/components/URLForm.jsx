import { useState } from 'react';
import axios from 'axios';
import ResultCard from './ResultCard';

export default function URLForm() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/analyze`,
        { url }
      );
      setResult(data);
    } catch (error) {
      alert('Failed to analyze the URL.');
    }
    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="Enter URL (https://example.com)"
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
        >
          Analyze URL
        </button>

      </form>
      {result && <ResultCard result={result} />}
    </div>
  );
}
