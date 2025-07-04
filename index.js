const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Set your desired route
  const from = 'JFK';
  const to = 'LAX';
  const date = '2025-09-10';

  await page.goto('https://www.delta.com');

  // Navigate to book page
  await page.click('text=Book');
  await page.click('text=Shop with Miles'); // This sometimes needs checking — could be a checkbox

  // Fill search form
  await page.fill('input[name="fromAirport"]', from);
  await page.fill('input[name="toAirport"]', to);

  await page.click('input[name="departureDate"]');
  await page.fill('input[name="departureDate"]', date);

  await page.click('button:has-text("Search")');

  await page.waitForLoadState('networkidle');

  // Get the lowest award price
  const awardPrice = await page.textContent('selector-for-award-price'); // <- Update this

  console.log(`Award flight from ${from} to ${to} on ${date}: ${awardPrice}`);

  await browser.close();
})();
