## Working Directory GitHub Action

GitHub Action that clones a repo into a working directory, lets you modify it, and then commits the changes back to the repository.

Use Your GitHub repository (just one branch) as a simple database!

[![CI](https://github.com/cinderblock/github-action-working-directory/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/cinderblock/github-action-working-directory/actions/workflows/ci.yml?query=branch%3Amaster)

## How It Works

The action clones one branch into a folder. If the branch doesn't exist yet, it starts the branch empty.

At the end of the job, the action's `post` step commits whatever changed in the folder and pushes it. `post` is
a lightly documented feature of `action.yml`: it runs automatically after all the job's other steps. If nothing
changed, nothing is committed (see `commit-unchanged`).

## Usage

```yml
jobs:
  update-data:
    runs-on: ubuntu-latest # Anything should work
    permissions:
      contents: write # to push the branch
    env:
      GITHUB_TOKEN: ${{ github.token }}
    steps:
      - name: Checkout Working Directory
        uses: cinderblock/github-action-working-directory@v1
        with:
          branch: data
          working-directory: working-dir

      # Make whatever changes you like
      - run: date >> run.log
        working-directory: working-dir

      # At the end of the job, the changes are committed and pushed to `data`.
```

Several working directories (different branches or repos) can be used in one job.

### Inputs

| Input               | Default              | Description                                                                                  |
| ------------------- | -------------------- | -------------------------------------------------------------------------------------------- |
| `branch`            | required             | Branch to clone and push to. Started empty if it doesn't exist.                              |
| `working-directory` | required             | Folder to clone into.                                                                        |
| `repo`              | this repo            | `owner/name`, authenticated with the `GITHUB_TOKEN` environment variable, or a full git URL. |
| `commit-message`    | `GitHub Actions`     | Commit message.                                                                              |
| `commit-name`       | `GitHub Actions`     | `user.name` of the commit.                                                                   |
| `commit-email`      | `actions@github.com` | `user.email` of the commit.                                                                  |
| `commit-unchanged`  |                      | Set to anything to commit (an empty commit) even when nothing changed.                       |

Pushing to another repo needs a `GITHUB_TOKEN` that can write to it, such as a personal access token or a
GitHub App token. The push is a normal fast-forward push. If another run pushed to the branch first, the push fails
rather than overwriting it.

This repo's [CI](.github/workflows/ci.yml) runs the action on itself, a full round trip included: it pushes a
throwaway branch, checks it, and deletes it.

## Development

```bash
bun install
bun run lint   # tsc --noEmit
bun run test   # bun test (includes clone/commit/push against a local bare repo)
bun run build  # bundles dist/ (committed: GitHub runs it directly)
```
