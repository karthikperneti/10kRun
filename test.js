const assert = require('assert');
const plan = require('./trainingPlan');

assert.strictEqual(plan.length, 8, 'Plan should have 8 weeks');
plan.forEach((week) => {
  assert.strictEqual(week.runs.length, 3, `Week ${week.week} should have 3 runs`);
});

console.log('All tests passed.');
