import puppeteer from 'puppeteer';
import { config } from '../../config/BCLoginConfig';

/**
 * Fills out and submits a form on a web page using Puppeteer and returns the redirected page's HTML.
 *
 * @param {string} targetParam - The target parameter for the form submission.
 * @returns {Promise<string>} - A Promise that resolves to the raw HTML of the redirected page after form submission.
 */
async function fillAndSubmitForm(targetParam: string): Promise<string> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // URL encode the target parameter
    const encodedTargetParam = encodeURIComponent(targetParam);

    // Navigate to the form page with the encoded target query parameter
    await page.goto(
      `https://login.bc.edu/nidp/idff/sso?id=94&sid=0&option=credential&sid=0&target=${encodedTargetParam}`
    );

    // Fill out the form with your specific form field names and values
    await page.type('input[name="username"]', config.bcAuth.username);
    await page.type('input[name="password"]', config.bcAuth.password);
    // Add more fields as needed...

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for the page to redirect after form submission
    await page.waitForNavigation();

    // Get the raw HTML of the redirected page
    const redirectedPageHTML = await page.content();

    return redirectedPageHTML;
  } finally {
    // Close the browser when done
    await browser.close();
  }
}

export default fillAndSubmitForm;
