import React from 'react';

class RadioButtonMenu extends React.Component {
  state = {
    sortOrder: 'alpha'
  }
  render() {
    const {buttonValues, currentValue, onClick} = this.props;
    return (
      <div className="flex">
        {buttonValues.map((value, idx) => {
          return (
            <div key={idx}>
              <label>
                <input
                  onChange={() => onClick(value)}
                  type="radio"
                  value="sortType"
                  checked={value === currentValue} />
                {value}
              </label>
            </div>
          );
        })}
      </div>
    );
  }
}

RadioButtonMenu.displayName = 'RadioButtonMenu';
export default RadioButtonMenu;
