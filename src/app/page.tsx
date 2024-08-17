'use client'
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState<{ title?: string; description?: string; h1?: string; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    setLoading(true);
    setData(null);
    try {
      const response = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      setData({ error: 'Failed to fetch data from the server' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Web Page Scraper</h1>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter a URL to scrape"
          className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
        />
        <button
          onClick={handleScrape}
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Scraping...' : 'Scrape'}
        </button>

        {data && data.title && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold">Scraped Title:</h2>
            <p className="text-white">{data.title}</p>
          </div>
        )}

        {data && data.description && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Scraped Description:</h2>
            <p className="text-white">{data.description}</p>
          </div>
        )}

        {data && data.h1 && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Scraped H1:</h2>
            <p className="text-white">{data.h1}</p>
          </div>
        )}

        {data && data.error && (
          <div className="mt-6 text-red-600">
            <p>{data.error}</p>
          </div>
        )}
      </div>
    </main>
  );
}