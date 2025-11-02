import { useEffect, useState } from "react";
import * as d3 from 'd3';

export default function Visualiser({ data = [] }) {
    const [rngNumber, setRngNumber] = useState(0);
    const [strudelData, setStrudelData] = useState(data);
    const maxItems = 50;
    const timeOut = 100;
    const maxValue = 1;

    // function LogToNum(input) {
    //     if (!input) { return 0; }
    //     let stringArray = input.split(/(\s+)/);

    //     for (const item of stringArray) {
    //         if (item.startsWith('gain:')) {
    //             let val = item.substring(5)
    //             return Number(val)
    //         }
    //     }
    //     return 0;
    // }

    useEffect(() => {
            if (data.length) {
                setStrudelData(data);               
            }
        }, [data]);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         let val = Math.random();
    //         setRngNumber(`3/8 -> 7/16: note:d4 s:supersaw cutoff300 attack:0 decay:0 sustain:0.5 release:0.1 room:0.6 lpenv:3.3 gain:${val} duration:0.10714285714285714`)
    //     }, timeOut)
    // })

    // useEffect(() => {
    //     let tempArray = [...rngArray, rngNumber];
    //     if (tempArray.length > maxItems) { tempArray.shift(); }
    //     setRngArray(tempArray)
    // }, [rngNumber])

    useEffect(() => {
        // Select SVG element
        const svg = d3.select('svg');
        svg.selectAll("*").remove();

        // Set width and height
        let w = svg.node().getBoundingClientRect().width;
        w = w -40;
        let h = svg.node().getBoundingClientRect().height;
        h = h - 25;

        const barMargin = 10;
        const barWidth = w / strudelData.length;

        // Crerate yScale
        let yScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([h, 0]);

        // Translate the Bars to make room for the axis
        const chartGroup = svg.append('g')
            .classed('chartGroup', true)
            .attr('transform', 'translate(30, 3)');

        let barGroups = svg.selectAll('g')
            .data(strudelData);

        // Add groups
        let newBarGroups = barGroups.enter()
            .append('g')
            .attr('transform', (d, i) => {
                return `translate(${i * barWidth}, ${yScale(d)})`;
            });

        

        // Draw dem rectangles
        // newBarGroups
        //     .append('rect')
        //     .attr('x', 0)
        //     .attr('height', d => { return h - yScale(d); })
        //     .attr('width', barWidth - barMargin)
        //     .attr('fill', 'black');

        // Draw dem colour rectangles
        // newBarGroups
        //     .append('rect')
        //     .attr('height', 0)
        //     .attr('y', d => h - yScale(d))
        //     .attr('width', barWidth - barMargin)
        //     .attr('y', 0)
        //     .attr('height', d => h - yScale(d))
        //     .attr('fill', (d, i) => `rgb(${360 / maxValue * d + 1}),
        //     ${360 - (360 / maxValue * d + 1)}, 60`);

        // const colourScale = d3.scaleSequential(d3.interpolateRgb('Lime', 'Red'))
        //     .domain([0, maxValue]);

        // Set the gradient
        chartGroup.append('linearGradient')
            .attr('id', 'line-gradient')
            .attr('gradientUnits', 'userSpaceOnUse')
            .attr('x1', 0)
            .attr('y1', yScale(0))
            .attr('x2', 0)
            .attr('y2', yScale(maxValue))
            .selectAll('stop')
            .data([
                { offset: '0%', color: 'green' },
                { offset: '100%', color: 'red' }
            ])
            .enter().append('stop')
            .attr('offset', function (d) { return d.offset; })
            .attr('stop-color', function (d) { return d.color; })

        // Draw me some lines
        chartGroup
            .append('path')
            .datum(strudelData)
            .attr('fill', 'none')
            .attr('stroke', 'url(#line-gradient)')
            .attr('stroke-width', 1.5)
            .attr('d', d3.line()
                .x((d, i) => i * barWidth)
                .y((d) => yScale(d))
            );

        // Add yAxis to chartGroup
        let yAxis = d3.axisLeft(yScale);
        chartGroup.append('g')
            .classed('axis y', true)
            .call(yAxis);

    }, [strudelData])

    return (
        <div className="app container">
            <h1>RNG Output: {rngNumber}</h1>
            <div className="row">
                <svg width="100%" height="600px" className="d3 border border-primary rounded p-2"></svg>
            </div>
        </div>
    );
}