import puppeteer from 'puppeteer';
import { config } from '../../config/BCLoginConfig';

// BC username and password
const username: string | undefined = config.bcAuth.username;
const password: string | undefined = config.bcAuth.password;

// Check it environment variables are defined
if (username === undefined || password === undefined) {
  const undefinedVariables: string[] = [];
  if (username === undefined) undefinedVariables.push('username');
  if (password === undefined) undefinedVariables.push('password');

  throw new Error(
    `The following BC Auth environment variable(s) are undefined: ${undefinedVariables.join(
      ', '
    )}.`
  );
}

/**
 * Fills out and submits a form on a web page using Puppeteer and returns the redirected page's HTML.
 *
 * @param {string} targetParam - The target parameter for the form submission.
 * @returns {Promise<string>} - A Promise that resolves to the raw HTML of the redirected page after form submission.
 */
async function fillAndSubmitForm(targetParam: string): Promise<string[]> {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const pages: string[] = [];

  try {
    // URL encode the target parameter
    const encodedTargetParam = encodeURIComponent(targetParam);
    const pageURL = `https://login.bc.edu/nidp/idff/sso?id=94&sid=1&option=credential&sid=1&target=${encodedTargetParam}`;

    // Navigate to the form page with the encoded target query parameter
    await page.goto(pageURL);

    // Fill out the form with your specific form field names and values
    await page.type('input#username.smalltext', config.bcAuth.username);
    await page.type('input#password', config.bcAuth.password);
    // Add more fields as needed...

    // Submit the form
    await page.click('button.btn.custom');

    // Wait for the page to redirect after form submission
    await page.waitForNavigation();

    // Specify the selector for the button you want to check
    const buttonSelector = 'a.footable-page-link[name="›"]';

    // Use page.evaluate to check if the button has the .disabled style
    const buttonDisabled = await page.evaluate((selector) => {
      const button = document.querySelector(selector);
      return button && button.classList.contains('disabled');
    }, buttonSelector);

    while (!buttonDisabled) {
      pages.push(await page.content());

      //click to next page
      await page.click(buttonSelector);
    }
    // Add last page to list
    pages.push(await page.content());

    // Get the raw HTML of the redirected page
    return pages;
  } finally {
    // Close the browser when done
    await browser.close();
  }
}

export default fillAndSubmitForm;
