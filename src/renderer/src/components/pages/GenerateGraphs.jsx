import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'

export const GenerateGraphs = () => {
  const ref = useRef()
  const [activeSeries, setActiveSeries] = useState(['Series A', 'Series B']) // Toggle series

  const data = [
    {
      name: 'Series A',
      values: [
        { date: new Date(2023, 0, 1), value: 30 },
        { date: new Date(2023, 1, 1), value: 50 },
        { date: new Date(2023, 2, 1), value: 80 },
        { date: new Date(2023, 3, 1), value: 65 }
      ]
    },
    {
      name: 'Series B',
      values: [
        { date: new Date(2023, 0, 1), value: 20 },
        { date: new Date(2023, 1, 1), value: 40 },
        { date: new Date(2023, 2, 1), value: 60 },
        { date: new Date(2023, 3, 1), value: 70 }
      ]
    }
  ]

  useEffect(() => {
    const margin = { top: 40, right: 120, bottom: 50, left: 50 }
    const width = 700 - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom

    const svgRoot = d3.select(ref.current)
    svgRoot.selectAll('*').remove() // Clear on re-render

    const svg = svgRoot
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const filteredData = data.filter((d) => activeSeries.includes(d.name))

    const allDates = filteredData.flatMap((d) => d.values.map((v) => v.date))
    const allValues = filteredData.flatMap((d) => d.values.map((v) => v.value))

    const x = d3.scaleTime().domain(d3.extent(allDates)).range([0, width])
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(allValues)])
      .range([height, 0])
    const color = d3.scaleOrdinal(d3.schemeCategory10)

    const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat('%b %Y'))
    const yAxis = d3.axisLeft(y)

    const clipId = 'clip-area'
    svg
      .append('defs')
      .append('clipPath')
      .attr('id', clipId)
      .append('rect')
      .attr('width', width)
      .attr('height', height)

    const chartArea = svg.append('g').attr('clip-path', `url(#${clipId})`)

    const xAxisGroup = svg.append('g').attr('transform', `translate(0,${height})`).call(xAxis)
    const yAxisGroup = svg.append('g').call(yAxis)

    const line = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.value))

    const tooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('background', 'rgba(0,0,0,0.7)')
      .style('color', 'white')
      .style('padding', '6px 10px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('opacity', 0)
      .style('pointer-events', 'none')

    // Draw each line
    filteredData.forEach((series) => {
      chartArea
        .append('path')
        .datum(series.values)
        .attr('fill', 'none')
        .attr('stroke', color(series.name))
        .attr('stroke-width', 2)
        .attr('d', line)
        .attr('class', `line-${series.name.replace(/\s+/g, '-')}`)
        .on('click', function () {
          const currentStroke = d3.select(this).attr('stroke-width')
          d3.select(this).attr('stroke-width', currentStroke === '2' ? 4 : 2)
        })

      // Add points
      chartArea
        .selectAll(`.point-${series.name}`)
        .data(series.values)
        .enter()
        .append('circle')
        .attr('cx', (d) => x(d.date))
        .attr('cy', (d) => y(d.value))
        .attr('r', 4)
        .attr('fill', color(series.name))
        .on('mouseover', (event, d) => {
          tooltip
            .style('opacity', 1)
            .html(
              `<strong>${series.name}</strong><br>${d3.timeFormat('%b %d, %Y')(d.date)}: ${d.value}`
            )
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 20 + 'px')
        })
        .on('mouseout', () => tooltip.style('opacity', 0))
    })

    // Add zoom functionality
    const zoom = d3
      .zoom()
      .scaleExtent([1, 5])
      .translateExtent([
        [0, 0],
        [width, height]
      ])
      .extent([
        [0, 0],
        [width, height]
      ])
      .on('zoom', (event) => {
        const newX = event.transform.rescaleX(x)
        const newY = event.transform.rescaleY(y)

        xAxisGroup.call(d3.axisBottom(newX).tickFormat(d3.timeFormat('%b %Y')))
        yAxisGroup.call(d3.axisLeft(newY))

        chartArea
          .selectAll('path')
          .attr('d', (d) => line.x((dp) => newX(dp.date)).y((dp) => newY(dp.value))(d))

        chartArea
          .selectAll('circle')
          .attr('cx', (d) => newX(d.date))
          .attr('cy', (d) => newY(d.value))
      })

    svgRoot.call(zoom)

    return () => {
      tooltip.remove()
    }
  }, [activeSeries])

  const toggleSeries = (name) => {
    setActiveSeries((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    )
  }

  return (
    <>
      <svg ref={ref}></svg>
      <div style={{ marginTop: 10 }}>
        <strong>Toggle Series:</strong>
        {['Series A', 'Series B'].map((name) => (
          <label key={name} style={{ marginLeft: 15 }}>
            <input
              type="checkbox"
              checked={activeSeries.includes(name)}
              onChange={() => toggleSeries(name)}
            />
            {name}
          </label>
        ))}
      </div>
    </>
  )
}
