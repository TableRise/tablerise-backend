/* eslint-disable no-console */
const summary = require('../coverage/coverage-summary.json');

function checkCoverage() {
  const summaryTotal = summary.total;

  const summaryPercentages = [
    summaryTotal.lines.pct,
    summaryTotal.statements.pct,
    summaryTotal.functions.pct,
    summaryTotal.branches.pct
  ];

  summaryPercentages.forEach((spec) => {
    if (spec < 90) {
      throw new Error('Some coverage point is below 90%');
    }
  });

  console.log('Well Done, all the coverage points are above or equal 90%');
}

checkCoverage();
