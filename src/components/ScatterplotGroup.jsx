import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";

const ScatterplotGroup = ({ data }) => {
    const svgRefs = useRef([]);
    const selectedIndices = useSelector((state) => state.selection.indices);

    useEffect(() => {
        const width = 200;
        const height = 200;
        const margin = { top: 20, right: 20, bottom: 40, left: 40 };

        const datasets = Object.keys(data).filter((key) => key !== "dino");

        datasets.forEach((datasetName, i) => {
            const svg = d3.select(svgRefs.current[i]);
            svg.selectAll("*").remove();

            const xScale = d3.scaleLinear().domain([0, 100]).range([margin.left, width - margin.right]);
            const yScale = d3.scaleLinear().domain([0, 100]).range([height - margin.bottom, margin.top]);

            svg.selectAll("circle")
                .data(data[datasetName])
                .enter()
                .append("circle")
                .attr("cx", (d) => xScale(d[0]))
                .attr("cy", (d) => yScale(d[1]))
                .attr("r", 2)  // ✅ Reduced from 4 to 2
                .attr("fill", (d, index) => (selectedIndices.includes(index) ? "red" : "black"));

            svg.append("g")
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(xScale).ticks(5))
                .selectAll("text")
                .style("font-size", "12px");

            svg.append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(yScale).ticks(5))
                .selectAll("text")
                .style("font-size", "12px");
        });
    }, [data, selectedIndices]);

    return (
        <div className="scatterplot-group-container">
            <div className="scatterplot-group">
                {Object.keys(data)
                    .filter((key) => key !== "dino")
                    .map((dataset, i) => (
                        <svg key={dataset} ref={(el) => (svgRefs.current[i] = el)} width={200} height={200}></svg>
                    ))}
            </div>
        </div>
    );
};

export default ScatterplotGroup;
