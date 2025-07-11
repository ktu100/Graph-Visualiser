import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GraphCanvas = ({ edges, isDirected, isWeighted, width = 1000, height = 800 }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('width', width).attr('height', height);

    const nodesSet = new Set();
    edges.forEach(({ from, to }) => {
      nodesSet.add(from);
      nodesSet.add(to);
    });

    const nodes = Array.from(nodesSet).map((id) => ({ id }));
    let links = edges.map(({ from, to, weight }) => ({
      source: from,
      target: to,
      weight: weight || '',
    }));

    if (!isDirected) {
      const reverseEdges = links.map(({ source, target, weight }) => ({
        source: target,
        target: source,
        weight,
      }));
      links = [...links, ...reverseEdges];
    }

    const simulation = d3
      .forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2));

    if (isDirected) {
      svg
        .append('defs')
        .append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 28)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#facc15'); 
    }

    const link = svg
      .append('g')
      .attr('stroke', '#facc15') 
      .attr('stroke-width', 2)
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('marker-end', isDirected ? 'url(#arrow)' : null);

    if (isWeighted) {
      svg
        .append('g')
        .selectAll('text')
        .data(links)
        .enter()
        .append('text')
        .attr('class', 'weight-label')
        .attr('fill', '#22c55e') 
        .attr('font-size', '14px')
        .style('font-weight', 'bold')
        .text((d) => d.weight)
        .attr('text-anchor', 'middle')
        .attr('dy', -5)
        .attr('x', (d) => (d.source.x + d.target.x) / 2)
        .attr('y', (d) => (d.source.y + d.target.y) / 2);
    }

    const node = svg
      .append('g')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 25)
      .attr('fill', '#0B5ED7') 
      .call(
        d3
          .drag()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = Math.max(25, Math.min(width - 25, event.x));
            d.fy = Math.max(25, Math.min(height - 25, event.y));
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    const labels = svg
      .append('g')
      .selectAll('text.node-label')
      .data(nodes)
      .enter()
      .append('text')
      .attr('class', 'node-label')
      .text((d) => d.id)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', 'white')
      .style('pointer-events', 'none')
      .style('font-weight', 'bold');

    simulation.on('tick', () => {
      nodes.forEach((node) => {
        node.x = Math.max(25, Math.min(width - 25, node.x));
        node.y = Math.max(25, Math.min(height - 25, node.y));
      });

      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);

      labels.attr('x', (d) => d.x).attr('y', (d) => d.y);

      if (isWeighted) {
        svg.selectAll('text.weight-label')
          .attr('x', (d) => (d.source.x + d.target.x) / 2)
          .attr('y', (d) => (d.source.y + d.target.y) / 2);
      }
    });
  }, [edges, isDirected, isWeighted]);

  return (
    <div className="bg-black px-10 py-10 flex justify-center items-center rounded-md">
      <svg ref={svgRef} className="border border-gray-400 rounded-md shadow-lg" />
    </div>
  );
};

export default GraphCanvas;
