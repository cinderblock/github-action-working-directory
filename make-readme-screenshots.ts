import puppeteer, { BrowserOptions } from 'puppeteer';

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function makeScreenshots(): Promise<void> {
  await Promise.all([
    makeScreenshot({
      dir: 'allure-report',
      screenshotDelay: 850,
    }),
    makeScreenshot({
      dir: 'jest-stare',
      screenshotDelay: 850,
      defaultViewport: { width: 992, height: 754 },
    }),
    makeScreenshot({
      file: 'jest-html-reporters',
      screenshotDelay: 1500,
    }),
    makeScreenshot({
      dir: 'coverage/lcov-report',
      defaultViewport: { width: 800, height: 300 },
    }),
  ]);
}

type Options = {
  defaultViewport?: BrowserOptions['defaultViewport'];
  screenshotDelay?: number;
  file?: string;
  dir?: string;
};

export async function makeScreenshot(opts: Options): Promise<void> {
  const browser = await puppeteer.launch({
    defaultViewport: { width: 1200, height: 600, ...opts.defaultViewport },
    args: ['--disable-web-security'],
  });

  const page = await browser.newPage();

  if (opts.file && opts.dir) {
    throw new Error('Cannot have file and dir defined');
  }

  if (!opts.file && !opts.dir) {
    throw new Error('Need one of file or dir defined!');
  }

  const input = opts.dir ? `${opts.dir}/index` : `${opts.file}`;
  const output = opts.dir ?? opts.file;

  await page.goto(`file://${__dirname}/public/${input}.html`);

  if (opts.screenshotDelay) await delay(opts.screenshotDelay);

  await page.screenshot({ path: `public/${output}.png` });

  await browser.close();
}

if (!module.parent) {
  makeScreenshots().catch(e => {
    process.exitCode = 1;
    console.log(e);

    // Force quit
    setTimeout(() => {
      process.exit();
    }, 500).unref();
  });
}
