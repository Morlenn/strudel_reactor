import { useEffect, useState } from "react";
import * as d3 from 'd3';

export default function Visualiser({ data = [] }) {
    const [strudelData, setStrudelData] = useState(data);
    const maxValue = 1;

    useEffect(() => {
            if (data.length) {
                setStrudelData(data);   
                console.log(strudelData)
            }
        }, [data]);

    useEffect(() => {

        // Shift colour based on mean gain value
        const currentGain = d3.mean(strudelData);
        const colorInterpolate = d3.interpolateRgb("#51dd3eff", "#ffffff");
        const colorValue = colorInterpolate(currentGain);

        // Select SVG element
        const svg = d3.select('svg');

        // Set width and height
        let w = svg.node().getBoundingClientRect().width;
        let h = svg.node().getBoundingClientRect().height;

        let xPadding = 10;
        let yPadding = 10;

        // Create yScale
        let yScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([h - yPadding, yPadding]);

        // Create xScale
        let xScale = d3.scaleLinear()
            .domain([0, Math.max(strudelData.length - 1, 1)])
            .range([xPadding, w - xPadding])

        let chartGroup = svg.select('.chartGroup');

        // Setup group on intial play
        if (chartGroup.empty()) {
            chartGroup = svg.append('g')
            .classed('chartGroup', true)
            .classed('p-0 m-0', true)
        }
        
        let line = d3.line()
            .x((d, i) => xScale(i))
            .y(d => yScale(d))
            .curve(d3.curveMonotoneX)

        // Add strudel data and apply css/classes
        let path = chartGroup.selectAll('path.line').data([strudelData]);
        path.enter()
            .append('path')
            .classed('line neon-line', true)
            .attr('fill', 'none')
            .attr('stroke-width', 1.5)
            .merge(path)
            .transition()
            .duration(80)
            .attr("stroke", colorValue)
            .attr('d', line)

    }, [strudelData])

    return (
        <div className="visualiser crt-container border border-3 shadow-sm d-flex justify-content-center m-3 p-0">
            <div className="row crt">
                <svg width="100%" height="100px" className="visualiser-svg p-0"></svg>
            </div>
        </div>
    );
}