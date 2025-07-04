const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const from = 'JFK';
  const to = 'SCL';
  const departureDate = '2025-12-15';
  const returnDate = '2026-01-21';

  await page.goto('https://www.delta.com', { waitUntil: 'networkidle' });

  // Fill departure airport
  await page.fill('input[id="fromAirportName"]', from);

  // Fill destination airport
  await page.fill('input[id="toAirportName"]', to);

  // Set trip type to round trip (default is usually round trip)
  await page.click('label[for="roundTrip"]');

  // Fill departure date
  await page.fill('input[id="departureDate"]', departureDate);

  // Fill return date
  await page.fill('input[id="returnDate"]', returnDate);

  // Check "Shop with Miles" checkbox (label has "Shop with Miles")
  const milesCheckbox = page.locator('input[type="checkbox"][aria-label*="Shop with Miles"]');
  if (!(await milesCheckbox.isChecked())) {
    await milesCheckbox.check();
  }

  // Click the search button
  await page.click('button[aria-label="Find Flights"]');

  // Wait for results page to load
  await page.waitForLoadState('networkidle');

  // Wait and grab the lowest award miles price from results
  // Note: You must inspect Delta's results page to find the correct selector for the award price.
  // Here's a placeholder selector example:
  const awardPriceSelector = 'span[data-testid="awardMilesPrice"]';

  await page.waitForSelector(awardPriceSelector, { timeout: 30000 });
  const awardPrice = await page.textContent(awardPriceSelector);

  console.log(`Award flight from ${from} to ${to}, departing ${departureDate} returning ${returnDate}: ${awardPrice}`);

  await browser.close();
})();
