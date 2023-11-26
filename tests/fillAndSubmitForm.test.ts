// fillAndSubmitForm.test.ts
import fillAndSubmitForm from '../controllers/directory/auth';
import puppeteer from 'puppeteer';
import { config } from '../config/BCLoginConfig';

jest.mock('puppeteer');

describe('fillAndSubmitForm', () => {
  it('fills and submits the form', async () => {
    const mockPage = {
      goto: jest.fn().mockResolvedValue(undefined),
      type: jest.fn().mockResolvedValue(undefined),
      click: jest.fn().mockResolvedValue(undefined),
      waitForNavigation: jest.fn().mockResolvedValue(undefined),
      content: jest.fn().mockResolvedValue('Redirected Page Content'),
    };

    const mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn().mockResolvedValue(undefined),
    };

    (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser);

    const result = await fillAndSubmitForm('example-target');

    expect(puppeteer.launch).toHaveBeenCalled();
    expect(mockBrowser.newPage).toHaveBeenCalled();
    expect(mockPage.goto).toHaveBeenCalledWith('example-target');
    expect(mockPage.type).toHaveBeenCalledWith(
      'input[name="username"]',
      config.bcAuth.username
    );
    expect(mockPage.type).toHaveBeenCalledWith(
      'input[name="password"]',
      config.bcAuth.password
    );
    expect(mockPage.click).toHaveBeenCalledWith('button[type="submit"]');
    expect(mockPage.waitForNavigation).toHaveBeenCalled();
    expect(mockPage.content).toHaveBeenCalled();
    expect(mockBrowser.close).toHaveBeenCalled();

    expect(result).toBe('Redirected Page Content');
  });
});
