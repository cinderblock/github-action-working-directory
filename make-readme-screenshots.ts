import puppeteer from 'puppeteer';

export async function makeScreenshots(): Promise<void> {
  const browser = await puppeteer.launch({
    defaultViewport: { width: 1200, height: 600 },
    args: ['--disable-web-security'],
  });

  const page = await browser.newPage();
  await page.goto(`file://${__dirname}/public/allure-report/index.html`);
  await new Promise(resolve => setTimeout(resolve, 750));
  await page.screenshot({ path: 'public/allure-report.png' });

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
