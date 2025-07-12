import { useEffect, useState } from 'react';

const API_URL = "https://boxcoino.yaserdarzi.ir/api/binance/report";

type SentimentType = 'Long' | 'Short' | 'Ranging' | 'Error' | 'Loading';

interface MarketData {
  count: number;
  greenCount: number;
  redCount: number;
  greenRate: string;
  redRate: string;
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
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

function MarketCard({
  label,
  greenRate,
  redRate,
  isLoading,
  error,
}: {
  label: string;
  greenRate: number | null;
  redRate: number | null;
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
        Green: {greenRate !== null ? `${greenRate}%` : "--"}
      </span>
      <span className="text-red-600 font-medium bg-red-100 px-2 py-1 rounded">
        Red: {redRate !== null ? `${redRate}%` : "--"}
      </span>
    </div>
  );
}

function App() {
  const [sentiment, setSentiment] = useState<SentimentType>('Loading');
  const [greenRate, setGreenRate] = useState<number | null>(null);
  const [redRate, setRedRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchMarketData(API_URL);

        if (response.error) {
          throw new Error(response.error);
        }

        const data = response.data;

        if (data) {
          const green = parseFloat(data.greenRate);
          const red = parseFloat(data.redRate);

          setGreenRate(Number.isFinite(green) ? Math.round(green) : null);
          setRedRate(Number.isFinite(red) ? Math.round(red) : null);

          if (green > 65) {
            setSentiment('Long');
          } else if (green < 35) {
            setSentiment('Short');
          } else {
            setSentiment('Ranging');
          }
        } else {
          setSentiment('Error');
        }
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
                    sentiment === 'Long'
                      ? 'text-green-600'
                      : sentiment === 'Short'
                        ? 'text-red-600'
                        : sentiment === 'Ranging'
                          ? 'text-yellow-600'
                          : 'text-gray-600'
                  }`}
                >
                  {sentiment}
                </span>
              )}
            </p>
          </div>

          <MarketCard
            label="Market Data"
            greenRate={greenRate}
            redRate={redRate}
            isLoading={isLoading}
            error={error || undefined}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
