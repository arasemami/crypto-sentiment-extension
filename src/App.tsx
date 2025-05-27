import { useEffect, useState } from 'react';

const API_URL = "https://boxcoino.yaserdarzi.ir/api/binance/report";

function App() {
  const [sentiment, setSentiment] = useState<'Long' | 'Short' | 'Ranging' | 'Error' | 'Loading'>('Loading');

  useEffect(() => {
    async function fetchSentiment() {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic eWFzZXJkYXJ6aTp5YXNlcmRhcnpp");

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
        };

        const response = await fetch(API_URL, requestOptions);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const trend = data?.data?.trend;

        if (trend === 'Long') {
          setSentiment('Long');
        } else if (trend === 'Short') {
          setSentiment('Short');
        } else if (trend === 'Ranging') {
          setSentiment('Ranging');
        } else {
          setSentiment('Error');
        }

      } catch (error) {
        console.error("Failed to fetch data", error);
        setSentiment('Error'); // fallback
      }
    }

    fetchSentiment();
  }, []);

  return (

    <div className=" w-h-screen flex items-center justify-center min-h-screen bg-gray-50 px-4 ">
      <div className="bg-white p-4 rounded-lg shadow-md max-w-sm w-full text-center m-4">
        <h3 className="text-xl sm:text-lg font-bold text-gray-800 text-left pb-4">Market Status</h3>

        <div className='w-full flex flex-col gap-2'>
          <div className="flex items-center justify-center gap-2 bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-lg  text-gray-700">
              Market is:{" "}
              <span className={`font-bold ${sentiment === 'Long' ? 'text-green-600' : 'text-red-600'}`}>
                {sentiment}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg shadow-sm">
            <span className="font-semibold text-gray-700">Short:</span>
            <span className="text-green-600 font-medium bg-green-100 px-2 py-1 rounded">TP: 20%</span>
            <span className="text-red-600 font-medium bg-red-100 px-2 py-1 rounded">SL: 80%</span>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg shadow-sm">
            <span className="font-semibold text-gray-700">Long:</span>
            <span className="text-green-600 font-medium bg-green-100 px-2 py-1 rounded">TP: 80%</span>
            <span className="text-red-600 font-medium bg-red-100 px-2 py-1 rounded">SL: 20%</span>
          </div>
        </div>

      </div>
    </div>


  );
}

export default App;



