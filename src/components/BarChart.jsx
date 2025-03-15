import { useEffect, useRef } from "react";
import * as d3 from "d3";

const BarChart = ({ stats }) => {
    const svgRef = useRef();

    useEffect(() => {
        const width = 300;
        const height = 300;
        const margin = { top: 30, right: 30, bottom: 40, left: 50 };

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const barWidth = 60;

        // Ensure no NaN values
        const meanX = stats.meanX || 0;
        const meanY = stats.meanY || 0;
        const stdX = stats.stdX || 0;
        const stdY = stats.stdY || 0;

        const xScale = d3.scaleBand().domain(["x", "y"]).range([margin.left, width - margin.right]).padding(0.5);
        const yScale = d3.scaleLinear().domain([0, 100]).range([height - margin.bottom, margin.top]);

        svg.selectAll("rect")
            .data([
                { axis: "x", mean: meanX, std: stdX },
                { axis: "y", mean: meanY, std: stdY },
            ])
            .enter()
            .append("rect")
            .attr("x", (d) => xScale(d.axis))
            .attr("y", (d) => yScale(d.mean))
            .attr("width", barWidth)
            .attr("height", (d) => height - margin.bottom - yScale(d.mean))
            .attr("fill", (d, i) => (i === 0 ? "green" : "purple"));

        // Draw error bars (Standard deviation)
        svg.selectAll("line")
            .data([
                { axis: "x", mean: meanX, std: stdX },
                { axis: "y", mean: meanY, std: stdY },
            ])
            .enter()
            .append("line")
            .attr("x1", (d) => xScale(d.axis) + barWidth / 2)
            .attr("x2", (d) => xScale(d.axis) + barWidth / 2)
            .attr("y1", (d) => yScale(d.mean + d.std))
            .attr("y2", (d) => yScale(d.mean - d.std))
            .attr("stroke", "black")
            .attr("stroke-width", 2);

        // X-axis
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale));

        // Y-axis
        svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(yScale));
    }, [stats]);

    return <svg ref={svgRef} width={300} height={300}></svg>;
};

export default BarChart;
