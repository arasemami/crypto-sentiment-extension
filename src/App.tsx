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

    <div className=" w-h-screen flex items-center justify-center min-h-screen bg-gray-50 px-4 ">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full text-center m-4">
        <h1 className="text-2xl sm:text-lg font-extrabold text-gray-800">Market Status</h1>
        <p className="mt-6 text-lg  text-gray-700">
          Market is:{" "}
          <span className={`font-bold ${sentiment === 'Long' ? 'text-green-600' : 'text-red-600'}`}>
            {sentiment}
          </span>
        </p>
      </div>
    </div>


  );
}

export default App;
