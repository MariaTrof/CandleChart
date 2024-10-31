import { useRef, useEffect, FC, useState } from "react";
import * as d3 from "d3";
import styles from "./CandleChart.module.scss";
import { KlineData } from "../services/api";

interface Props {
  data: KlineData[];
}

const CandleChart: FC<Props> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });


  const handleResize = () => {
    const parent = parentRef.current;
    if (parent) {
      setDimensions({
        width: parent.clientWidth,
        height: parent.clientHeight,
      });
    }
  };


  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  
  useEffect(() => {
    if (!svgRef.current || !data.length) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.time)) as [Date, Date])
      .range([0, dimensions.width]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => Math.min(d.open, d.close)) || 0,
        d3.max(data, (d) => Math.max(d.high, d.low)) || 0,
      ])
      .range([dimensions.height, 0]);

    const formatDate = d3.timeFormat("%Y-%m-%d %H:%M");

    const g = svg.append("g");

    g.append("g")
      .attr("transform", `translate(0, ${dimensions.height})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(6)
          .tickFormat((value) => {
            return formatDate(new Date(value as number));
          })
      );

    g.append("g").call(d3.axisLeft(yScale));

    g.selectAll(".candle")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "candle")
      .attr("x", (d) => xScale(new Date(d.time)) - 2.5)
      .attr("y", (d) => yScale(Math.max(d.open, d.close)))
      .attr("width", 5)
      .attr("height", (d) => Math.abs(yScale(d.open) - yScale(d.close)))
      .style("fill", (d) => (d.open > d.close ? "#ff0000" : "#00ff00"));

    g.selectAll(".highlow-line")
      .data(data)
      .enter()
      .append("line")
      .attr("class", "highlow-line")
      .attr("x1", (d) => xScale(new Date(d.time)))
      .attr("x2", (d) => xScale(new Date(d.time)))
      .attr("y1", (d) => yScale(d.high))
      .attr("y2", (d) => yScale(d.low))
      .style("stroke", (d) => (d.open > d.close ? "#ff0000" : "#00ff00"));
  }, [data, dimensions]);

  return (
    <div className={styles.container} ref={parentRef}>
      <p className={styles.title}>BTC/USDT Chart</p>
      <div className={styles.svg_box}>
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className={styles.svg}
        ></svg>
      </div>
    </div>
  );
};

export default CandleChart;
