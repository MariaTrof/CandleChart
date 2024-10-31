import { FC, useEffect, useState } from "react";
import CandleChart from "../components/CandleChart";
import styles from "./App.module.scss";
import { fetchBTCUSDTKlines, KlineData } from "../services/api";

const App: FC = () => {
  const [data, setData] = useState<KlineData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const fetchedData = await fetchBTCUSDTKlines();
        setData(fetchedData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) {
    return <div className={styles.loader}> Loading...</div>;
  }

  return (
    <>
      <div className={styles.container}>
        <p className={styles.title}>Candle Chart</p>

        <div className={styles.description}>
          <p className={styles.small_title}>description: </p>
          <p className={styles.text}>
            Использована библиотека D3 в связке с React, чтобы отрисовать
            BTC/USDT с помощью Binance API
          </p>
        </div>

        <div className={styles.component}>
          <CandleChart data={data} />
        </div>
      </div>
    </>
  );
};

export default App;
