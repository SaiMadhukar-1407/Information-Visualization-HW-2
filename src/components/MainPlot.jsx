import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useDispatch, useSelector } from "react-redux";
import { setSelection } from "../store/selectionSlice";
import BarChart from "./BarChart";

const MainPlot = ({ data }) => {
    const svgRef = useRef();
    const dispatch = useDispatch();
    const selectedIndices = useSelector((state) => state.selection.indices);

    const [stats, setStats] = useState({ meanX: 0, meanY: 0, stdX: 0, stdY: 0 });

    useEffect(() => {
        const width = 300;  // ✅ Reduce width to match Bar Chart
        const height = 300; // ✅ Keep the height the same
        const margin = { top: 20, right: 20, bottom: 40, left: 50 };

        const svg = d3
            .select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);
        const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

        const circles = svg.selectAll("circle")
            .data(data.dino)
            .enter()
            .append("circle")
            .attr("cx", (d) => xScale(d[0]))
            .attr("cy", (d) => yScale(d[1]))
            .attr("r", 4)
            .attr("fill", "steelblue");

        // Brushing
        const brush = d3.brush()
            .extent([
                [0, 0],
                [width, height],
            ])
            .on("brush", ({ selection }) => {
                if (!selection) return;
                const [[x0, y0], [x1, y1]] = selection;

                const selectedPoints = data.dino
                    .map((d, index) => ({
                        index,
                        x: d[0],
                        y: d[1],
                        selected:
                            x0 <= xScale(d[0]) &&
                            xScale(d[0]) <= x1 &&
                            y0 <= yScale(d[1]) &&
                            yScale(d[1]) <= y1,
                    }))
                    .filter((d) => d.selected);

                const selectedIndices = selectedPoints.map((d) => d.index);

                // Compute mean & standard deviation
                const meanX = d3.mean(selectedPoints, (d) => d.x) || 0;
                const meanY = d3.mean(selectedPoints, (d) => d.y) || 0;
                const stdX = d3.deviation(selectedPoints, (d) => d.x) || 0;
                const stdY = d3.deviation(selectedPoints, (d) => d.y) || 0;

                dispatch(setSelection(selectedIndices));
                setStats({ meanX, meanY, stdX, stdY });

                circles.attr("fill", (d, index) => (selectedIndices.includes(index) ? "red" : "steelblue"));
            })
            .on("end", ({ selection }) => {
                if (!selection) {
                    circles.attr("fill", "steelblue");
                    dispatch(setSelection([]));
                    setStats({ meanX: 0, meanY: 0, stdX: 0, stdY: 0 });
                }
            });

        svg.append("g").call(brush);

        // Add X-axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale).ticks(5))
            .selectAll("text")
            .style("font-size", "12px");

        // Add Y-axis
        svg.append("g")
            .call(d3.axisLeft(yScale).ticks(5))
            .selectAll("text")
            .style("font-size", "12px");

    }, [data, dispatch]);

    return (
        <div className="row">
            <svg ref={svgRef}></svg>
            <BarChart stats={stats} />
        </div>
    );
};

export default MainPlot;
