// @ts-check
const { BasePage } = require('../base/BasePage');
const { environment } = require('../../config/environment');

class HomePage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.baseURL = environment.baseURL;

    // The CTA is repeated in the header, hero section and FAQ, so scope to the first visible one.
    this.becomeMerchantLink = page.getByRole('link', { name: 'Become a Merchant' }).first();
  }

  async open() {
    await this.page.goto(this.baseURL);
  }

  async clickBecomeMerchant() {
    await this.becomeMerchantLink.click();
  }
}

module.exports = { HomePage };
