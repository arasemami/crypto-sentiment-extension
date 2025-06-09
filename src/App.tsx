import { useEffect, useState } from 'react';

const API_URL_BASE = "https://falcon-huobi.yaserdarzi.ir/api/binance/report";
const API_URL = "https://boxcoino.yaserdarzi.ir/api/binance/report";
const API_URL_SHORT = "https://boxcoino-short.yaserdarzi.ir/api/binance/report";

type SentimentType = 'Long' | 'Short' | 'Ranging' | 'Error' | 'Loading';

interface MarketData {
  tp_percent: string;
  sl_percent: string;
  risk_free_percent: string;
  trend: string;
}

interface ApiResponse {
  data: MarketData | null;
  error?: string;
}

const AUTH_HEADER = {
  Authorization: "Basic eWFzZXJkYXJ6aTp5YXNlcmRhcnpp",
};

async function fetchMarketData(url: string): Promise<ApiResponse> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: AUTH_HEADER,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    return { data: json?.data ?? null };
  } catch (error) {
    console.error("Fetch error:", error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

function MarketCard({ label, data, isLoading, error }: { 
  label: string; 
  data: MarketData | null;
  isLoading: boolean;
  error?: string;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg shadow-sm">
        <span className="font-semibold text-gray-700">{label}:</span>
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg shadow-sm">
        <span className="font-semibold text-gray-700">{label}:</span>
        <span className="text-red-500">Error: {error}</span>
      </div>
    );
  }

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
        RF: {data?.risk_free_percent ? parseFloat(data.risk_free_percent).toFixed(0) : "--"}%
      </span>
    </div>
  );
}

function App() {
  const [sentiment, setSentiment] = useState<SentimentType>('Loading');
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [marketDataShort, setMarketDataShort] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);
      
      try {
        const [baseResponse, longResponse, shortResponse] = await Promise.all([
          fetchMarketData(API_URL_BASE),
          fetchMarketData(API_URL),
          fetchMarketData(API_URL_SHORT),
        ]);

        if (baseResponse.error) {
          throw new Error(baseResponse.error);
        }

        setMarketData(longResponse.data);
        setMarketDataShort(shortResponse.data);

        // Determine sentiment directly from baseResponse
        const trend = baseResponse.data?.trend?.toLowerCase() ?? 'error';
        setSentiment(
          trend === 'long' ? 'Long' :
          trend === 'short' ? 'Short' :
          trend === 'ranging' ? 'Ranging' : 'Error'
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load market data');
        setSentiment('Error');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="w-screen flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-4 rounded-lg shadow-md max-w-sm w-full text-center m-4">
        <h3 className="text-xl sm:text-lg font-bold text-gray-800 text-left pb-4">Market Status</h3>

        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center justify-center gap-2 bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-lg text-gray-700">
              Market is:{" "}
              {isLoading ? (
                <span className="font-bold text-gray-500">Loading...</span>
              ) : error ? (
                <span className="font-bold text-red-600">Error: {error}</span>
              ) : (
                <span
                  className={`font-bold ${
                    sentiment === 'Long' ? 'text-green-600' : 
                    sentiment === 'Short' ? 'text-red-600' :
                    sentiment === 'Ranging' ? 'text-yellow-600' : 'text-gray-600'
                  }`}
                >
                  {sentiment}
                </span>
              )}
            </p>
          </div>

          <MarketCard 
            label="Short" 
            data={marketDataShort} 
            isLoading={isLoading}
            error={error || undefined}
          />
          <MarketCard 
            label="Long" 
            data={marketData} 
            isLoading={isLoading}
            error={error || undefined}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
