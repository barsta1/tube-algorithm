import { crashStockData } from '@/data_covid_crash';
import { boomStockData } from '@/data_tesla_boom';

/**
 * A function for getting indexed data
 * @param data
 * @return {list} data with added index property
 */
const getIndexedData = (data) => {
  return data.reduce((acc, el, index) => {
    acc.push({...el, x: index});
    return acc;
  }, [])
};

/**
 * A function for getting the median element based on "Close" property for which, the median is calculated
 * @param {Array} data
 * @return {Object} foundElement - Object with the median value
 */
const getMedianElement = (data) => {
  data.sort(function (a, b) { return a.Close - b.Close });
  let lowMiddle = Math.floor((data.length - 1) / 2);
  let highMiddle = Math.floor((data.length - 1) / 2);
  const median = (data[lowMiddle].Close + data[highMiddle].Close) / 2;

  return data.find((el) => el.Close === median);
};

/**
 * A function for mapping "Close" value to "y" for easier data manipulation
 * @param {Array} data
 * @return {Array} mapped data
 */
const mapData = (data) => {
  return data.map((el) => {
    return {
      ...el,
      y: el.Close
    };
  })
};

/**
 * A function for splitting data into separate, smaller datasets - makes it possible to display data on the chart
 * @param {Array} data
 * @param {number} singleChunkLength -  length of chunk array
 * @return {Array[]} chunkedData
 */
const getChunkedData = (data, singleChunkLength) => {
  let tempArray = [];
  const chunkedData = [];
  data.forEach((el, index) => {
    if (index % singleChunkLength === 0 && index !== 0) {
      chunkedData.push([...tempArray]);
      tempArray = [];
    }
    tempArray.push(el);
    if (index === data.length) {
      chunkedData.push([...tempArray]);
    }
  });

  return chunkedData;
};

/**
 * A function for filling empty array with values of given type
 * @param {Array} array
 * @param fillValue
 * @return {array} array filled with values of given type
 */
export const getFilledArray = (array, fillValue) => {
  return new Array(array.length).fill(fillValue);
};

/**
 * A "moving" window assessing median value for given set of elements
 * @param {Array} data
 * @param {number} windowSize
 * @return {Object} foundElement - Object with the median value
 */
export const medianFilter = (data, windowSize) => {
  const filteredValues = [];

  data.forEach((element, index) => {
    if (index >= windowSize - 1) {
      const dataToFilter = data.slice(index - windowSize + 1, index + 1);
      filteredValues.push(getMedianElement(dataToFilter));
    } else {
      filteredValues.push(element);
    }
  })

  return filteredValues;
};

/**
 * A MSE helper
 * @param {Array} originalValues  - array with original values
 * @param {Array} predictedValues - array with predicted values
 * @return {number} Mean Square Error
 */
export const meanSquaredError = (originalValues, predictedValues) => {
  let error = 0;

  for (let i = 0; i < originalValues.length; i++) {
    error += Math.pow((predictedValues[i] - originalValues[i]), 2)
  }

  return error / originalValues.length;
};

/**
 * A MAE helper
 * @param {Array} originalValues - array with original values
 * @param {Array} predictedValues - array with predicted values
 * @return {number} Mean Absolute Percentage Error
 */
export const meanAbsoluteError = (originalValues, predictedValues) => {
  let error = 0;

  for (let i = 0; i < originalValues.length; i++) {
    error += Math.abs((originalValues[i] - predictedValues[i]));
  }

  return error / originalValues.length;
};

/**
 * A MAPE helper
 * @param {Array} originalValues - array with original values
 * @param {Array} predictedValues - array with predicted values
 * @return {number} Mean Absolute Percentage Error
 */
export const meanAbsolutePercentageError = (originalValues, predictedValues) => {
  let error = 0;

  for (let i = 0; i < originalValues.length; i++) {
    error += Math.abs((originalValues[i] - predictedValues[i]) / originalValues[i]);
  }

  return (error / originalValues.length) * 100;
};

/**
 * A RMSE helper
 * @param {Array} originalValues - array with original values
 * @param {Array} predictedValues - array with predicted values
 * @return {number} Root Mean Squared Error
 */
export const rootMeanSquaredError = (originalValues, predictedValues) => {
  return Math.sqrt(meanSquaredError(originalValues, predictedValues));
};

/**
 * A function for rounding given number by given decimal places
 * @param {number} number - a value to round
 * @param {number} decimalPlaces - number of decimal places to which the value will be rounded
 * @return {number} rounded value
 */
export const round = (number, decimalPlaces) => {
  return Math.round(number * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
};

/**
 * A function for getting data to be then processed inside App.vue
 * @return {Array[]} an array of array chunks
 */
export const getSummaryData = (chosenDatasetType) => {
  let data = boomStockData;
  if (chosenDatasetType === 'crash') {
    data = crashStockData;
  }

  const stockDataConverted = getIndexedData(data).reverse();
  const stockDataMapped = mapData(stockDataConverted);

  return getChunkedData(stockDataMapped, 100);
};
