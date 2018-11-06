import React from 'react';

// Yes, the non-responsive hard-coding of dimensions here is poor form
const hexWidth = 39.5;

class HexMap extends React.Component {
  render() {
    const {hexData,
      colorBy,
      colormapValue,
      colormapValueMinusMean,
      measlesRates,
      selectedUSST,
      modifySelectedUSST,
      selectedYear
    } = this.props;
    const colormap = (colorBy === 'value' ? colormapValue : colormapValueMinusMean);

    const stateByYearMap = measlesRates.reduce((acc, row) => {
      acc[row.StateAbbr] = Number(row[selectedYear]);
      return acc;
    }, {});

    return (
      <div className="container" >
        {/* YOUR CODE HERE inside this svg tag, for responding to events.
            Note that the generation of the map includes setting "id"
            attributes that may be helpful in connection with things like
            event.target.getAttribute('id') or
            event.target.parentNode.getAttribute('id') */}
        <svg width={`${hexWidth * 11}`} height={`${hexWidth * 7.5}`}
        >
          {hexData.map((row, idx) => {
            const scaling = 1;
            const hexRow = Number(row.HexRow);
            const hexCol = Number(row.HexCol);
            // (x,y) center of hexagon, given location in hex grid
            // variables to simplify tracing hexagon corners
            const dx = scaling * hexWidth / 2;
            const HY = scaling * hexWidth / Math.sqrt(3);
            const dy = HY / 2;
            const pos = [
              hexWidth * (-2 + hexCol + 0.5 * hexRow),
              1 + hexWidth * (-0.3 + 0.5 * Math.sqrt(3) * hexRow)
            ];
            // traverse vertices of hexagon centered at 0,0
            const constructedPath = `M${(-dx)},${dy}
              l${dx},${dy}
              l${dx},${-dy}
              l0,${-HY}
              l${-dx},${-dy}
              l${-dx},${dy} Z
              `;
            return (
              <g
                transform={`translate(${pos[0]}, ${pos[1]})`}
                className="state-hex"
                key={idx}
                id={row.StateAbbr}>
                <path
                  fill={colormap(stateByYearMap[row.StateAbbr])}
                  d={constructedPath} />
                {/* ACTUALLY could indicated selected state with an addition path here
                    that is visible only when selectedUSST === row.StateAbbr */}
                <text
                  className={`state-hex-label ${selectedUSST === row.StateAbbr ? 'state-selected' : ''}`}
                  >{row.StateAbbr}</text>
              </g>);
          })}
          <g transform="translate(130,30)"><text className="year">{selectedYear}</text></g>
        </svg>
      </div>
    );
  }
}
HexMap.defaultProps = {
  hexData: []
};
HexMap.displayName = 'HexMap';
export default HexMap;
