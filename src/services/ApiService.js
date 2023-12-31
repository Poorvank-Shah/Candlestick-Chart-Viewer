// src/services/ApiService.js
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';
// const BASE_URL = 'http://localhost:5000';
console.log("Api Server: ", BASE_URL)
class ApiService {
    static async getHistoricalData(symbol, timeframe) {
        const apiUrl = `${BASE_URL}/api/historical-data/${symbol}/${timeframe}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const parsedData = parseData(data);
            // console.log(parsedData)
            return parsedData;

        } catch (error) {
            console.error('Error fetching historical data:', error.message);
            throw new Error('Failed to fetch historical data');
        }
    }

    static async searchKeyword(keyword) {
        const apiUrl = `${BASE_URL}/api/search/${keyword}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            // console.log(data);
            return data;
        } catch (error) {
            console.error('Error searching keyword:', error.message);
            throw new Error('Failed to search keyword');
        }
    }

    static async companyOverview(symbol) {
        const apiUrl = `${BASE_URL}/api/overview/${symbol}`;

        try {
            const response = await fetch(apiUrl);
            // console.log(response)
            const data = await response.json();
            // console.log(data);
            return data;
        } catch (error) {
            console.error('Error fetching overview', error.message);
            throw new Error('Failed to fetch overview');
        }
    }

    static async globalMarketStatus() {
        // console.log("requesting markte status")
        const apiUrl = `${BASE_URL}/api/globalstatus`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            // console.log(data)
            const filteredData = filterMarket(data["markets"]);
            // console.log(filteredData);
            return filteredData;

        } catch (error) {
            console.error('Error fetching Global Market Status', error.message);
            throw new Error('Failed to fetch Global Market Status');
        }
    }


}

const parseData = (originalData) => {
    const ohlcData = [];
    const volumeData = [];

    Object.entries(originalData).forEach(([timestamp, dataEntry]) => {
        const ohlcEntry = {
            open: parseFloat(parseFloat(dataEntry["1. open"]).toFixed(2)),
            high: parseFloat(parseFloat(dataEntry["2. high"]).toFixed(2)),
            low: parseFloat(parseFloat(dataEntry["3. low"]).toFixed(2)),
            close: parseFloat(parseFloat(dataEntry["4. close"]).toFixed(2)),
            time: new Date(timestamp).getTime() / 1000,    
        };

        const volumeEntry = {
            value: parseFloat(dataEntry["5. volume"]),
            time: new Date(timestamp).getTime() / 1000,
            color: ohlcEntry.open > ohlcEntry.close ? "#ef5350" : "#26a69a"

        };

        ohlcData.push(ohlcEntry);
        volumeData.push(volumeEntry);
    });

    ohlcData.reverse();
    volumeData.reverse();

    return [ohlcData, volumeData];
};

const filterMarket = (marketData) => {
    const regionsToExtract = ["Canada", "United States", "India", "United Kingdom"];

    const filteredData = marketData?.filter(market => regionsToExtract.includes(market.region));

    const extractedInfo = filteredData?.map(market => ({
        primary_exchange: market.primary_exchanges,
        current_status: market.current_status
    }));
    return extractedInfo
};


export default ApiService;
// const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
