import React from 'react';
import ReactDOM from 'react-dom';
import {line} from 'd3-shape';
import {scaleLinear, scaleTime} from 'd3-scale';
import {axisLeft, axisBottom} from 'd3-axis';
import {select} from 'd3-selection';

import {years, natAvg} from './utils';

class LinePlots extends React.Component {
  constructor(props) {
    super(props);
    // Note that these values are initialized via .defaultProps below
    const {
      measlesRates,
      width,
      height,
      margin
    } = this.props;
    // Creating/computing things that will never change,
    // especially stuff involving traversing all the data multiple times
    const xScale = scaleTime()
      .domain([new Date('1930'), new Date('2016')])
      .range([margin.left, margin.left + (width - margin.left - margin.right)]);
    const yrScale = scaleLinear()
      .domain([margin.left + 566, 566 + margin.left + (width - margin.left - margin.right)])
      .range([1930, 2016]);
    const yearWidth = xScale(new Date('1')) - xScale(new Date('0'));
    const xAxis = axisBottom(xScale).tickFormat(d => d.getFullYear());
    const plotHeight = height - margin.top - margin.bottom;
    const reformatedData = measlesRates.map(row =>
      ({
        StateAbbr: row.StateAbbr,
        StateData: years.map(year => ({date: new Date(`${year}`), value: row[year]}))
      })
    );

    const nationalAverages = Array(natAvg(measlesRates));
    // YOUR CODE HERE: pre-compute once any other re-arrangements of data,
    // or any objects that depend on data.
    // This is the one place state is not set via setState
    this.state = {
      xScale,
      yearWidth,
      xAxis,
      plotHeight,
      reformatedData,
      nationalAverages,
      // YOUR CODE HERE: any other pre-computed data re-arrangements?
      yrScale
    };
  }

  state = {
    xScale: null,
    yearWidth: null,
    xAxis: null,
    plotHeight: null,
    reformatedData: null,
    nationalAverages: null,
    yrScale: null
  }

  componentDidMount() {
    const {
      xAxis,
      plotHeight
    } = this.state;
    select(ReactDOM.findDOMNode(this.refs.xAxisContainer))
      .call(axisG => axisG.call(xAxis))
      .attr('transform', `translate(0, ${plotHeight})`);
    this.updateChart(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateChart(nextProps);
  }

  updateChart(props) {
    const {
      measlesRates,
      selectedYear,
      selectedUSST
    } = props;
    const {
      xScale,
      plotHeight,
      reformatedData,
      nationalAverages
    } = this.state;
    if (!measlesRates.length) {
      return;
    }
    // YOUR CODE HERE: make yScale respond usefully to selectedYear.
    // If the Y scaling that depends on selectedYear hasn't actually changed
    // then this can return early
    let yScale = null;
    if (selectedYear <= 1968) {
      yScale = scaleLinear().domain([30000, 0]).range([0, plotHeight]);
    } else {
      yScale = scaleLinear().domain([2000, 0]).range([0, plotHeight]);
    }

    // build axes
    const yAxis = axisLeft(yScale);
    select(ReactDOM.findDOMNode(this.refs.yAxisContainer))
      .call(axisG => axisG.call(yAxis));

    // build lines
    const lineContainer = select(ReactDOM.findDOMNode(this.refs.plotContainer));
    const lineEval = line().x(d => xScale(d.date)).y(d => yScale(d.value));
    // update lines first
    select('.plot-container').selectAll('.state-line').attr('stroke', 'gray').attr('opacity', 0.3);
    select('.plot-container').select(`#${selectedUSST}`).attr('stroke', 'blue').attr('opacity', 1);
    select('.plot-container').selectAll('.state-line').attr('d', d => lineEval(d.StateData));
    const lines = lineContainer.selectAll('.state-line').data(reformatedData);
    const stAvg = lineContainer.selectAll('.state-line').data(nationalAverages);
    lines
      .enter().append('path')
      .attr('class', 'state-line')
      .attr('stroke', d => d.StateAbbr === selectedUSST ? 'blue' : 'gray')
      .attr('stroke-width', '2')
      .attr('fill', 'none')
      .attr('name', d => d.StateAbbr)
      .attr('id', d => d.StateAbbr)
      .attr('opacity', d => d.StateAbbr === selectedUSST ? 1 : 0.3)
      .merge(lines)
      .attr('d', d => lineEval(d.StateData));

    stAvg
      .enter().append('path')
      .attr('class', 'state-line')
      .attr('stroke', 'orange')
      .attr('stroke-width', '2')
      .attr('fill', 'none')
      // .attr('opacity', 0.3)
      .merge(lines)
      .attr('d', d => lineEval(d));
    lines.attr('d', d => lineEval(d.StateData));
    stAvg.attr('d', d => lineEval(d.StateData));
    // ACTUALLY if you've added more local state, call this.setState() on any changed state
  }

  render() {
    const {
      height,
      margin,
      modifySelectedYear,
      modifySelectedUSST,
      selectedYear,
      selectedUSST,
      width,
      onMouseOver,
      onClick
    } = this.props;
    const {
      xScale,
      yearWidth,
      yrScale
    } = this.state;
    // YOUR CODE HERE any other values useful below

    return (
      <div className="container-relative" onClick={event => {
        const newST = event.target.getAttribute('id');
        onClick(newST);
      }}>
        <div> {'Measles cases per million people (natl. avg. = orange)'} </div>
        {/* YOUR CODE HERE inside this svg tag, for responding to events.
            Note that the generation of the line plots above includes setting
            "id" attributes that may be helpful in connection with things like
            event.target.getAttribute('id') or
            event.target.parentNode.getAttribute('id') */
        }
        <svg width={width} height={height}>
          >
          <g
            transform={`translate(${xScale(new Date(`${selectedYear}`))})`}>
            <rect
              x={-yearWidth / 2}
              y={0}
              width={yearWidth}
              height={height - margin.top - margin.bottom}
              fill="#ff7"
            />
          </g>
          <g className="plot-container"
             ref="plotContainer"
             onMouseOver={event => {
               onMouseOver(Math.round(yrScale(event.clientX)));
             }
           }
          />
          <g className="axis-container x-axis"
             ref="xAxisContainer"
          />
          <g className="axis-container y-axis"
             transform={`translate(${margin.left})`}
             ref="yAxisContainer"
          />
        </svg>
        {/* ACTUALLY could add tooltip here */}
      </div>
    );
  }
}

LinePlots.displayName = 'LinePlots';
LinePlots.defaultProps = {
  // Yes, the non-responsive hard-coding of dimensions here is poor form
  width: 550,
  height: 400,
  margin: {left: 42, right: 5, top: 10, bottom: 10}
};
export default LinePlots;
