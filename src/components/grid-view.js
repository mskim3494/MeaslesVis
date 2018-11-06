import React from 'react';
import {scaleLinear} from 'd3-scale';

import RadioButtonMenu from './radio-button-menu';
import {years, compareAvg, compareName, compareMax} from './utils';

class GridView extends React.Component {

  constructor(props) {
    super(props);
    // YOUR CODE HERE: you can pre-sort this.props.measlesRates (or rather a copy of it)
    // in the different possible ways, so that render() merely chooses amongst them
    this.state = {
      sortBy: 'alphabetical',
      mean: this.props.measlesRates.concat().sort((a, b) => compareAvg(a, b)),
      alphabetical: this.props.measlesRates.concat().sort((a, b) => compareName(a, b)),
      max: this.props.measlesRates.concat().sort((a, b) => compareMax(a, b))
    };
  }

  state = {
    sortBy: null,
    // YOUR CODE HERE: null-initialization of pre-sorted data fields
    alphabetical: null,
    mean: null,
    max: null
  }

  render() {
    // Yes, the non-responsive hard-coding of dimensions here is poor form
    const rectWidth = Math.floor(600 / years.length);
    const rectHeight = Math.floor(800 / 51);
    const abbrWidth = 30;
    const width = rectWidth * years.length;
    const height = rectHeight * 51;
    const {

      colorBy,
      colormapValue,
      colormapValueMinusMean,
      measlesRates,
      modifySelectedYear,
      modifySelectedUSST,
      selectedUSST,
      selectedYear
    } = this.props;
    const {
      sortBy,
      byAlphabet,
      byMean,
      byMax
    } = this.state;
    const xScale = scaleLinear().domain([0, years.length]).range([0, width]);
    const colormap = (colorBy === 'value' ? colormapValue : colormapValueMinusMean);
    // ACTUALLY this has to depend on sortBy
    const sortedRates = this.state[sortBy];

    function getSortByRates() {
      switch (sortBy) {
      case 'alphabetical':
        return byAlphabet;
      case 'mean':
        return byMean;
      case 'max':
        return byMax;
      default:
        return measlesRates;
      }
    }
    return (
      <div className="container">
        <div className="containrow">
          Sort rows:&nbsp;
          <RadioButtonMenu
            buttonValues={['alphabetical', 'mean', 'max']}
            currentValue={sortBy}
            onClick={(value) => this.setState({sortBy: value})}
          />
        </div>

        <svg width={`${abbrWidth + width}`} height={height}
        >
          {sortedRates.map((row, idx) => {
            return (
              <g className="row-container" transform={`translate(0,${idx * rectHeight})`}
                 key={idx} id={row.StateAbbr}>
                <text y={`${rectHeight * 0.8}`}>{row.StateAbbr}</text>
                <g className="year-container"
                   id={`${row.StateAbbr}`}
                   transform={`translate(${abbrWidth},0)`}>
                  {years.map((year, i) => {
                    return (<rect
                      key={`${idx}-${i}`}
                      y="0"
                      id={`${year}`}
                      x={Math.round(xScale(i))}
                      stroke="none"
                      fill={colormap(row[year])}
                      height={`${rectHeight}`}
                      width={`${rectWidth}`}/>);
                  })}
                </g>
                {
                  /* ACTUALLY you could indicate the selected state with a rect here
                    with stroke 'none' except when selectedUSST === row.StateAbbr */
                  <rect
                    height={`${rectHeight}`}
                    width={`${width + abbrWidth}`}
                    fill="none"
                    stroke={selectedUSST === row.StateAbbr ? 'red' : 'none'}
                    strokeWidth="2"
                    />
                }
              </g>
            );
          })}
          {
            /* ACTUALLY you could indicate the selected year with a rect here
              that moves around according to the selected year and xScale */
            <rect
              y="0"
              id={`${selectedYear}`}
              x={abbrWidth + Math.round(xScale(selectedYear - 1930))}
              fill="none"
              stroke="red"
              strokeWidth="2"
              height={`${height}`}
              width={`${rectWidth}`}/>
          }
        </svg>
      </div>
    );
  }
}

GridView.displayName = 'GridView';
export default GridView;
