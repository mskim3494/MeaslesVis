/* eslint-disable max-len */
/* eslint-disable no-inline-comments */
/* eslint-disable comma-spacing */
/* eslint-disable max-statements */

import test from 'tape';
import {calculateRates, calculateUSMeanRate} from '../src/components/utils.js';
import {default as AlmostEqual, FLT_EPSILON} from 'almost-equal';

const equalish = (leftArr, rightArr) => {
  if (leftArr.length !== rightArr.length) {
    return false;
  }
  if (!leftArr.every((_, idx) => (isNaN(Number(leftArr[idx])) === isNaN(Number(rightArr[idx]))))) {
    return false;
  }
  return leftArr.every((_, idx) => ((isNaN(Number(leftArr[idx])) && leftArr[idx] === rightArr[idx]) ||
                                    AlmostEqual(leftArr[idx], rightArr[idx], 100 * FLT_EPSILON)));
};

const miniMeasles = [
{1930: '4389', 1931: '8934', 1932: '270', 1933: '1735', 1934: '15849', 1935: '7214', 1936: '572', 1937: '620', 1938: '13511', 1939: '4381', 1940: '3052', 1941: '8696', 1942: '3564', 1943: '3865', 1944: '7199', 1945: '339', 1946: '3986', 1947: '3693', 1948: '2058', 1949: '11066', 1950: '1503', 1951: '3144', 1952: '11878', 1953: '2799', 1954: '8451', 1955: '2061', 1956: '7117', 1957: '9264', 1958: '7664', 1959: '3467', 1960: '2075', 1961: '2588', 1962: '2379', 1963: '1165', 1964: '18140', 1965: '2346', 1966: '1813', 1967: '1345', 1968: '158', 1969: '12', 1970: '486', 1971: '2086', 1972: '142', 1973: '19', 1974: '21', 1975: '5', 1976: '0', 1977: '79', 1978: '60', 1979: '94', 1980: '22', 1981: '0', 1982: '2', 1983: '0', 1984: '0', 1985: '0', 1986: '0', 1987: '4', 1988: '0', 1989: '14', 1990: '4', 1991: '0', 1992: '0', 1993: '1', 1994: '0', 1995: '0', 1996: '0', 1997: '6', 1998: '0', 1999: '0', 2000: '0', 2001: '0', 2002: '7', 2003: '0', 2004: '0', 2005: '0', 2006: '0', 2007: '0', 2008: '0', 2009: '0', 2010: '0', 2011: '0', 2012: '0', 2013: '0', 2014: '1', 2015: '1', 2016: '0', StateAbbr: 'AL', StateName: 'Alabama'},
{1930: '0', 1931: '0', 1932: '0', 1933: '0', 1934: '0', 1935: '0', 1936: '0', 1937: '0', 1938: '0', 1939: '0', 1940: '0', 1941: '0', 1942: '0', 1943: '0', 1944: '0', 1945: '0', 1946: '0', 1947: '0', 1948: '0', 1949: '0', 1950: '0', 1951: '0', 1952: '0', 1953: '0', 1954: '1487', 1955: '536', 1956: '2511', 1957: '958', 1958: '1259', 1959: '1829', 1960: '1456', 1961: '1002', 1962: '1406', 1963: '1849', 1964: '1169', 1965: '215', 1966: '641', 1967: '148', 1968: '4', 1969: '22', 1970: '73', 1971: '40', 1972: '7', 1973: '5', 1974: '1', 1975: '0', 1976: '11', 1977: '49', 1978: '2', 1979: '18', 1980: '4', 1981: '0', 1982: '1', 1983: '0', 1984: '0', 1985: '0', 1986: '0', 1987: '0', 1988: '0', 1989: '0', 1990: '0', 1991: '0', 1992: '0', 1993: '0', 1994: '2', 1995: '0', 1996: '6', 1997: '1', 1998: '7', 1999: '0', 2000: '1', 2001: '0', 2002: '0', 2003: '0', 2004: '0', 2005: '0', 2006: '0', 2007: '0', 2008: '0', 2009: '0', 2010: '0', 2011: '0', 2012: '0', 2013: '0', 2014: '0', 2015: '0', 2016: '0', StateAbbr: 'AK', StateName: 'Alaska'}
];
const miniPop = [{1930: '2646248', 1940: '2832961', 1950: '3061743', 1960: '3266740', 1970: '3444165', 1980: '3893888', 1990: '4040587', 2000: '4447382', 2010: '4779736', StateAbbr: 'AL', StateName: 'Alabama'},
                 {1930: '59278', 1940: '72524', 1950: '128643', 1960: '226167', 1970: '300382', 1980: '401851', 1990: '550043', 2000: '626931', 2010: '710231', StateAbbr: 'AK', StateName: 'Alaska'}];
const wantRates = [
  {1930: 1658.574706527884, 1931: 3352.4467326271383, 1932: 100.61147180944813, 1933: 642.0547171982109, 1934: 5824.839801285823, 1935: 2633.22680335793,
    1936: 207.37592665679045, 1937: 223.26676658694723, 1938: 4832.9199721964915, 1939: 1556.6983029501191, 1940: 1077.318042853396, 1941: 3044.989367748716,
    1942: 1238.0513627353628, 1943: 1332.0257309461042, 1944: 2461.63942381703, 1945: 115.01849796020292, 1946: 1341.9835270680367, 1947: 1233.8343643016738,
    1948: 682.3637744279102, 1949: 3641.491388494809, 1950: 490.8968518912267, 1951: 1020.0364818773031, 1952: 3828.2262813696684, 1953: 896.1841286655299,
    1954: 2688.197866631414, 1955: 651.3409295719053, 1956: 2234.718475711621, 1957: 2890.2663759220095, 1958: 2375.888501387867, 1959: 1068.0047315043191,
    1960: 635.189822269296, 1961: 787.9475686047954, 1962: 720.4233509224841, 1963: 350.9070495419006, 1964: 5434.864023537096, 1965: 699.1605454107903,
    1966: 537.472633512145, 1967: 396.64547046355176, 1968: 46.35225365830762, 1969: 3.5021950737248546, 1970: 141.10822216705645, 1971: 597.8555214780456,
    1972: 40.179851807651914, 1973: 5.308623979797725, 1974: 5.794615323358022, 1975: 1.3627593041369421, 1976: 0, 1977: 21.01638929865675,
    1978: 15.773105351672688, 1979: 24.4224626691616, 1980: 5.649880017093455, 1981: 0, 1982: 0.5097843158635856, 1983: 0,
    1984: 0, 1985: 0, 1986: 0, 1987: 1.0008564078067501, 1988: 0, 1989: 3.477468525121891, 1990: 0.9899551723549078, 1991: 0, 1992: 0,
    1993: 0.24023299717930427, 1994: 0, 1995: 0, 1996: 0, 1997: 1.3871730649831626, 1998: 0, 1999: 0, 2000: 0, 2001: 0, 2002: 1.5507816293876486,
    2003: 0, 2004: 0, 2005: 0, 2006: 0, 2007: 0, 2008: 0, 2009: 0, 2010: 0, 2011: 0, 2012: 0, 2013: 0, 2014: 0.20355498191047589,
    2015: 0.20218713915914008, 2016: 0, StateAbbr: 'AL', StateName: 'Alabama'},
  {1930: 0, 1931: 0, 1932: 0, 1933: 0, 1934: 0, 1935: 0, 1936: 0, 1937: 0, 1938: 0, 1939: 0, 1940: 0, 1941: 0, 1942: 0, 1943: 0, 1944: 0,
    1945: 0, 1946: 0, 1947: 0, 1948: 0, 1949: 0, 1950: 0, 1951: 0, 1952: 0, 1953: 0, 1954: 8869.531400049864, 1955: 3021.3353625884274,
    1956: 13416.514655578674, 1957: 4865.171769002864, 1958: 6092.06715112875, 1959: 8451.370656138726, 1960: 6437.720799232426, 1961: 4289.594736042228,
    1962: 5833.782830587942, 1963: 7442.695471387485, 1964: 4569.02987262217, 1965: 816.6381476367822, 1966: 2367.9699736974317, 1967: 532.1491815509631,
    1968: 14.008594272586231, 1969: 75.09544802114961, 1970: 243.02388292241213, 1971: 128.81248734014773, 1972: 21.828900091619012, 1973: 15.113835900619879,
    1974: 2.932812778617214, 1975: 0, 1976: 30.448697543122275, 1977: 131.92956684292278, 1978: 5.241678049844165, 1979: 45.95305486973458,
    1980: 9.953938151205298, 1981: 0, 1982: 2.3175540349311015, 1983: 0, 1984: 0, 1985: 0, 1986: 0, 1987: 0, 1988: 0, 1989: 0, 1990: 0, 1991: 0,
    1992: 0, 1993: 0, 1994: 3.4435368429172133, 1995: 0, 1996: 10.064145508757651, 1997: 1.656000368294482, 1998: 11.44626127497615, 1999: 0,
    2000: 1.595071865962921, 2001: 0, 2002: 0, 2003: 0, 2004: 0, 2005: 0, 2006: 0, 2007: 0, 2008: 0, 2009: 0, 2010: 0, 2011: 0, 2012: 0, 2013: 0,
    2014: 0, 2015: 0, 2016: 0, StateAbbr: 'AK', StateName: 'Alaska'}];

test('calculateRates', t => {
  const gotRates = calculateRates(miniMeasles, miniPop);
  const wantRates0Keys = Object.keys(wantRates[0]).sort();
  const wantRates0Vals = wantRates0Keys.map(k => wantRates[0][k]);
  const wantRates1Keys = Object.keys(wantRates[1]).sort();
  const wantRates1Vals = wantRates1Keys.map(k => wantRates[1][k]);
  const gotRates0Keys = Object.keys(gotRates[0]).sort();
  const gotRates0Vals = gotRates0Keys.map(k => gotRates[0][k]);
  const gotRates1Keys = Object.keys(gotRates[1]).sort();
  const gotRates1Vals = gotRates1Keys.map(k => gotRates[1][k]);
  t.ok(equalish(wantRates0Keys, gotRates0Keys), 'rates[0] keys');
  t.ok(equalish(wantRates0Vals, gotRates0Vals), 'rates[0] vals');
  t.ok(equalish(wantRates1Keys, gotRates1Keys), 'rates[1] keys');
  t.ok(equalish(wantRates1Vals, gotRates1Vals), 'rates[1] vals');
  t.end();
});

test('calculateUSMeanRate', t => {
  const wantMean = {
    1930: 1622.2353804768463, 1931: 3277.9043162338926, 1932: 98.34210508487688, 1933: 627.3698806843735, 1934: 5689.802684578793, 1935: 2571.372610034092,
    1936: 202.44194534817785, 1937: 217.8880999113933, 1938: 4715.06964315951, 1939: 1518.2867958156555, 1940: 1050.4270371383777, 1941: 2963.897001034535,
    1942: 1203.052106738672, 1943: 1292.2292753756633, 1944: 2384.2126769372944, 1945: 111.22282607358325, 1946: 1295.659482225086, 1947: 1189.404272715037,
    1948: 656.7933205459694, 1949: 3499.7989655510164, 1950: 471.1028696841072, 1951: 976.2040634121543, 1952: 3653.7684354888397, 1953: 853.056571182542,
    1954: 3001.1526262169195, 1955: 777.1617973355351, 1956: 2855.3646304785084, 1957: 3004.5700209576257, 1958: 2599.636616075479, 1959: 1529.4622631900165,
    1960: 1010.9058157002177, 1961: 1020.4455794098527, 1962: 1068.2328437148537, 1963: 844.6364882402445, 1964: 5373.2187247030315, 1965: 707.7074341336056,
    1966: 673.455929389765, 1967: 406.91676739650944, 1968: 43.85230003960242, 1969: 9.141301124406924, 1970: 149.28374513659463, 1971: 559.5228338741966,
    1972: 38.65325421228378, 1973: 6.13825718407554, 1974: 5.548516505752121, 1975: 1.2437368521468017, 1976: 2.699212826109692, 1977: 30.989874203868922,
    1978: 14.813042912955263, 1979: 26.411233565433054, 1980: 6.052509242298007, 1981: 0, 1982: 0.6889081109560915, 1983: 0, 1984: 0, 1985: 0, 1986: 0,
    1987: 0.8884618941025831, 1988: 0, 1989: 3.0694074809221523, 1990: 0.8713400992892043, 1991: 0, 1992: 0, 1993: 0.21116046846287784, 1994: 0.4180511825079358,
    1995: 0, 1996: 1.2292966468598294, 1997: 1.420106406138544, 1998: 1.4063068926475943, 1999: 0, 2000: 0.19707101237152697, 2001: 0, 2002: 1.3572615178084928,
    2003: 0, 2004: 0, 2005: 0, 2006: 0, 2007: 0, 2008: 0, 2009: 0, 2010: 0, 2011: 0, 2012: 0, 2013: 0, 2014: 0.1767962490059189,
    2015: 0.17550652059375962, 2016: 0};
  const gotMean = calculateUSMeanRate(wantRates, miniPop);
  const wantMeanKeys = Object.keys(wantMean).sort();
  const wantMeanVals = wantMeanKeys.map(k => wantMean[k]);
  const gotMeanKeys = Object.keys(gotMean).sort();
  const gotMeanVals = gotMeanKeys.map(k => gotMean[k]);
  t.ok(equalish(wantMeanKeys, gotMeanKeys), 'mean rate keys');
  t.ok(equalish(wantMeanVals, gotMeanVals), 'mean rate vals');
  t.end();
});