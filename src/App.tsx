import { useEffect, useState } from 'react';

const API_URL = "https://api.coinglass.com/api/pro/v1/futures/longShortRate"; // Example API (use a real one)

function App() {
  const [sentiment, setSentiment] = useState<'Long' | 'Short' | 'Loading'>('Loading');

  useEffect(() => {
    async function fetchSentiment() {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        const rate = data.data.BTC.longShortRate; // Example path
        setSentiment(rate > 1 ? 'Long' : 'Short');
      } catch (error) {
        console.error("Failed to fetch data", error);
        setSentiment('Short'); // fallback
      }
    }

    fetchSentiment();
  }, []);

  return (
    <div className="text-center p-4">
      <h1 className="text-xl font-bold">Crypto Market Sentiment</h1>
      <p className="mt-4 text-lg">
        Market is:{" "}
        <span className={`font-bold ${sentiment === 'Long' ? 'text-green-600' : 'text-red-600'}`}>
          {sentiment}
        </span>
      </p>
    </div>
  );
}

export default App;
