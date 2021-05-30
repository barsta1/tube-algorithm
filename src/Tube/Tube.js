export class Tube {
  constructor(minTolerance, maxTolerance, toleranceFactor, data, tubeIndex) {
    this.minTolerance = minTolerance;
    this.maxTolerance = maxTolerance;
    this.toleranceFactor = toleranceFactor;
    this.data = data;
    this.tubeIndex = tubeIndex;

    const N = this.data.length;
    const sumX = this.getTotalSum('x');
    const sumY = this.getTotalSum('y');
    const sumXY = this.getTotalSum('x', 'y');
    const sumXX = this.getTotalSum('x', 'x');

    this.slope = this.getSlope(N, sumX, sumY, sumXY, sumXX);
    this.intercept = this.getIntercept(N, sumX, sumY);
    this.tolerance = this.getTubeTolerance();
    this.isAnomaly = false;
  }

  getTotalSum(firstProperty, secondProperty) {
    return this.data.reduce((acc, el) => {
      if (firstProperty && secondProperty) {
        acc = acc + el[firstProperty] * el[secondProperty];
      } else if (firstProperty) {
        acc = acc + el[firstProperty];
      } else {
        acc = 0;
      }
      return acc;
    }, 0)
  }

  getSlope(N, sumX, sumY, sumXY, sumXX) {
    return (N * sumXY - sumX * sumY) / (N * sumXX - sumX * sumX);
  }

  getIntercept(N, sumX, sumY) {
    return (sumY - this.slope * sumX) / N;
  }

  makeRegression(predictedValue) {
    /* Handle case when a regression for a single sample was assessed - in this case return the original value */
    if (!this.slope && !this.intercept || this.data.length === 1) {
      return this.data[0].y;
    }

    return this.slope * predictedValue + this.intercept;
  }

  getDevCoefficient() {
    let length = this.data.length;
    if (length === 0) {
      length = - 1;
    }
    return this.data.reduce((acc, point) => {
      return acc + Math.abs(point.y - this.makeRegression(point.x));
    }, 0) / length;
  }

  getMedian(data) {
    data.sort(function (a, b) { return a - b });
    const lowMiddle = Math.floor((data.length - 1) / 2);
    const highMiddle = Math.floor((data.length - 1) / 2);
    return (data[lowMiddle] + data[highMiddle]) / 2;
  }

  getTubeTolerance() {
    return this.getMedian([this.toleranceFactor * this.getDevCoefficient(), this.minTolerance, this.maxTolerance]);
  }

  getBottomTube(point) {
    return this.makeRegression(point.x) - this.tolerance;
  }

  getUpperTube(point) {
    return this.makeRegression(point.x) + this.tolerance;
  }

  isInTube(point) {
    const bottomTubeBorder = this.getBottomTube(point);
    const upperTubeBorder = this.getUpperTube(point);
    return point.y >= bottomTubeBorder && point.y <= upperTubeBorder;
  }
}
