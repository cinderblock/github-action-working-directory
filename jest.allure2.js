const { JasmineAllureReporter } = require('allure-jasmine');
const { AllureRuntime } = require('allure-js-commons');

jasmine.getEnv().addReporter(
  new JasmineAllureReporter(
    new AllureRuntime({
      resultsDir: 'allure-results',
    }),
  ),
);
