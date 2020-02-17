## Working Directory GitHub Action

GitHub Action that clones a repo into a working directory, lets you modify it, and then commits the changes back to the repository.

Use Your GitHub repository (just one branch) as a simple database!

[![cinderblock/github-action-working-directory status](https://github.com/cinderblock/github-action-working-directory/workflows/Main/badge.svg?branch=master)](https://github.com/cinderblock/github-action-working-directory/actions?query=branch%3Amaster)

### Test Reports

_Using this action enables historical reports with allure!_

[![Allure 2 Report](https://cinderblock.github.io/github-action-working-directory/allure-report.png)](https://cinderblock.github.io/github-action-working-directory/allure-report)

- [jest-stare Test report](https://cinderblock.github.io/github-action-working-directory/jest-stare)
- [jest-html-reporters Test report](https://cinderblock.github.io/github-action-working-directory/jest-html-reporters)
- [lcov Coverage report](https://cinderblock.github.io/github-action-working-directory/coverage/lcov-report)

## How It Works

GitHub Actions `action.yml` has an under-documented feature of `post` runs.
This is run at the end of all other steps automatically.
We can use that post step to commit any changes back to the original repo that we checkout.

## Usage

In your GitHub Actions, add a config like this:

```yml
jobs:
  self-test-and-generate-stats:
    runs-on: ubuntu-latest # Anything should work
    steps:
      - name: Checkout Working Directory
        uses: cinderblock/github-action-working-directory@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          repo: '' # Current
          branch: working-dir/${{ github.ref }}
          working-directory: working-dir
          commit-message: GitHub Actions
          commit-name: GitHub Actions
          commit-email: actions@github.com
          commit-unchanged: ''

      # Make whatever changes you like
      - run: date >> run.log
        working-directory: working-dir
```

Multiple concurrent working directories are supported.

For an example, look for `# Test with self` in [`main.yml` workflow](.github/workflows/main.yml#L167-L176) file.

## Development

Setup everything

```bash
npm run all
```

Run the tests :heavy_check_mark:

```bash
npm test

 PASS  ./main.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)

...
```
