import {scaleLinear} from 'd3-scale';
import {rgb} from 'd3-color';

const numYears = 2016 - 1930 + 1;
export const years = [...new Array(numYears)].map((d, i) => i + 1930);

// feel free to add (and possibly export) other helper/utility functions

// compute the per-year per-state rates of measles (the number of cases per
// million people), using populationData to get a per-year per-state
// population estimate.  The population should be linearly interpolated
// (perhaps with a scaleLinear) between the years (e.g. 1930, 1940, 1950, etc)
// where it is known; years after 2010 should use the 2010 population.  The
// structure of the data returned should be identical to the measlesData
// coming in: the only difference is that the numbers giving #cases in
// measlesData should be 1,000,000 * #cases / population in the data returned.
// Then given code returns the same measlesData given, which is incorrect.
export function calculateRates(measlesData, populationData) {
  // YOUR CODE HERE
  const decades = getDecades(Object.keys(populationData[0]));

  measlesData.reduce((acc, state) => {
    const statePopulation = getStatePopulation(populationData, state.StateName);
    const popScale = interpolateYear(decades, statePopulation);
    Object.keys(state).reduce((ac, year) => {
      if (!isNaN(Number(year))) {
        if (state[year] !== 0) {
          state[year] = 1000000 * state[year] / popScale(year);
        }
      }
      return acc;
    }, 0);
    return acc;
  }, []);

  return measlesData;
}

// returns an array of the decades included in the data, for use in year interpolation
function getDecades(state) {
  return state.reduce((acc, decade) => {
    if (!isNaN(Number(decade))) {
      acc.push(Number(decade));
    }
    return acc;
  }, []);
}

// returns the scale with which population will be interpolated
function interpolateYear(decades, statePop) {
  const popRange = decades.reduce((acc, decade) => {
    acc.push(statePop[decade]);
    return acc;
  }, []);
  return scaleLinear().domain(decades).range(popRange).clamp(false);
}

// given the populationData and desired state, it returns its corresponding population
function getStatePopulation(pData, stName) {
  return pData.reduce((acc, state) => {
    if (state.StateName === stName) {
      acc = state;
    }
    return acc;
  }, {});
}

// compute the mean US measles rate as a weighted average of the states'
// rates, weighted by the states' populations.  The return should be
// like one element of the given measlesRates, but without the
// StateName and StateAbbr keys. The given code returns the right
// kind of object, but may or may not be a useful part of your code.
export function calculateUSMeanRate(measlesRates, populationData) {
  // YOUR CODE HERE
  const decades = getDecades(Object.keys(populationData[0]));

  const temp = measlesRates.reduce((acc, state) => {
    const statePopulation = getStatePopulation(populationData, state.StateName);
    const popScale = interpolateYear(decades, statePopulation);
    Object.keys(state).reduce((d, year) => {
      if (!isNaN(Number(year))) {
        // key is a year, not 'StateAbbr' or 'StateName'
        if (!acc.pop[year]) {
          acc.pop[year] = 0;
        }
        if (!acc.rates[year]) {
          acc.rates[year] = 0;
        }
        acc.pop[year] += Number(popScale(year));
        acc.rates[year] += (Number(state[year]) * Number(popScale(year)));
      }
      return d;
    }, {});
    return acc;
  }, {rates: {}, pop: {}});

  return Object.keys(temp.rates).reduce((avg, yr) => {
    avg[yr] = temp.pop[yr] === 0 ? 0 : temp.rates[yr] / temp.pop[yr];
    return avg;
  }, {});
}

// Colormap to support ordinal comparisons of measles rates,
// designed to be legible even for recent years
export function buildColormapValue() {
  // YOUR CODE HERE: how you set this up should involve specific numeric values
  // for measles rates, which you can hard-code rather than re-learn from the data
  return scaleLinear().domain([1000, 2000]).range([rgb(0, 0, 0), rgb(255, 255, 255)]);
}

// Colormap to support ordinal comparisons of per-state measles rates minus
// the national average, designed to be legible even for recent years
export function buildColormapValueMinusMean() {
  // YOUR CODE HERE: how you set this up should involve specific numeric values
  // for measles rates, which you can hard-code rather than re-learn from the data
  return scaleLinear().domain([0, 1500]).range([rgb(0, 0, 0), rgb(255, 255, 255)]);
}

// calculate the average of all values in object
function avgRate(st) {
  const keys = Object.keys(st);
  const sum = keys.reduce((acc, d) => {
    if (typeof st[d] !== 'string') {
      acc += st[d];
    }
    return acc;
  }, 0);
  return sum / keys.length;
}

export function compareAvg(a, b) {
  return avgRate(a) - avgRate(b);
}

export function compareName(a, b) {
  if (a.StateName < b.StateName) {
    return -1;
  }
  if (a.StateName > b.StateName) {
    return 1;
  }
  return 0;
}

function getMax(st) {
  const keys = Object.keys(st);
  return keys.reduce((acc, d) => {
    if (typeof st[d] !== 'string') {
      if (st[d] > acc) {
        acc = st[d];
      }
      return acc;
    }
    return acc;
  }, -Infinity);
}

export function compareMax(a, b) {
  return getMax(a) - getMax(b);
}

function getAvg(data, year) {
  return data.reduce((acc, val) => {
    if (typeof val[year] !== 'string') {
      acc += val[year];
    }
    return acc;
  }, 0) / data.length;
}

export function natAvg(data) {
  const keys = Object.keys(data[0]);
  return keys.reduce((acc, d) => {
    if (typeof data[0][d] !== 'string') {
      acc.push({date: new Date(`${d}`), value: getAvg(data, d)});
    }
    return acc;
  }, []);
}
