// Other packages https://github.com/actions/toolkit/blob/master/README.md#packages
import core from '@actions/core';
import io from '@actions/io';

async function run(): Promise<void> {
  try {
    core.debug('Reading inputs');

    const dir = core.getInput('working-directory', { required: true });

    core.debug(`mkdir ${dir}`);

    io.mkdirP(dir);

    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
