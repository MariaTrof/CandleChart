import axios from "axios";

const BASE_URL = "https://api1.binance.com/api/v3";

export interface KlineData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const fetchBTCUSDTKlines = async (): Promise<KlineData[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/klines`, {
      params: {
        symbol: "BTCUSDT",
        interval: "1h",
        limit: 100,
      },
    });
    return response.data.map((kline: any) => ({
      time: kline[0],
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5]),
    }));
  } catch (error) {
    console.error("Error fetching data from Binance API:", error);
    throw error;
  }
};
