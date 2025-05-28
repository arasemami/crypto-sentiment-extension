import { useEffect, useState } from 'react';

const API_URL = "https://boxcoino.yaserdarzi.ir/api/binance/report";
const API_URL_SHORT = "https://boxcoino-short.yaserdarzi.ir/api/binance/report";

type SentimentType = 'Long' | 'Short' | 'Ranging' | 'Error' | 'Loading';

interface MarketData {
  tp_percent: string;
  sl_percent: string;
  risk_free_percent: string;
  trend: string;
}

const AUTH_HEADER = {
  Authorization: "Basic eWFzZXJkYXJ6aTp5YXNlcmRhcnpp",
};

async function fetchMarketData(url: string): Promise<MarketData | null> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: AUTH_HEADER,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    return json?.data ?? null;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

function MarketCard({ label, data }: { label: string; data: MarketData | null }) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg shadow-sm">
      <span className="font-semibold text-gray-700">{label}:</span>
      <span className="text-green-600 font-medium bg-green-100 px-2 py-1 rounded">
        TP: {data?.tp_percent ? parseFloat(data.tp_percent).toFixed(0) : "--"}%
      </span>
      <span className="text-red-600 font-medium bg-red-100 px-2 py-1 rounded">
        SL: {data?.sl_percent ? parseFloat(data.sl_percent).toFixed(0) : "--"}%
      </span>
         <span className="text-yellow-600 font-medium bg-yellow-100 px-2 py-1 rounded">
        RF: {data?.sl_percent ? parseFloat(data.risk_free_percent).toFixed(0) : "--"}%
      </span>
    </div>
  );
}

function App() {
  const [sentiment, setSentiment] = useState<SentimentType>('Loading');
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [marketDataShort, setMarketDataShort] = useState<MarketData | null>(null);

  useEffect(() => {
    async function loadData() {
      const [longData, shortData] = await Promise.all([
        fetchMarketData(API_URL),
        fetchMarketData(API_URL_SHORT),
      ]);

      setMarketData(longData);
      setMarketDataShort(shortData);

      const trend = longData?.trend?.toLowerCase();

      switch (trend) {
        case 'long':
          setSentiment('Long');
          break;
        case 'short':
          setSentiment('Short');
          break;
        case 'ranging':
          setSentiment('Ranging');
          break;
        default:
          setSentiment('Error');
      }
    }

    loadData();
  }, []);

  return (
    <div className="w-h-screen flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-4 rounded-lg shadow-md max-w-sm w-full text-center m-4">
        <h3 className="text-xl sm:text-lg font-bold text-gray-800 text-left pb-4">Market Status</h3>

        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center justify-center gap-2 bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-lg text-gray-700">
              Market is:{" "}
              {sentiment === 'Loading' ? (
                <span className="font-bold text-gray-500">Loading...</span>
              ) : sentiment === 'Error' ? (
                <span className="font-bold text-red-600">Error</span>
              ) : (
                <span
                  className={`font-bold ${sentiment === 'Long' ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                  {sentiment}
                </span>
              )}
            </p>
          </div>

          <MarketCard label="Short" data={marketDataShort} />
          <MarketCard label="Long" data={marketData} />
        </div>
      </div>
    </div>
  );
}

export default App;
