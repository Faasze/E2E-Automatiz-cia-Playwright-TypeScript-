import type { Locator, Page } from '@playwright/test';

export class Header {
  readonly root: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.root = page.locator('#header');
    this.productsLink = this.root.getByRole('link', { name: 'Products' });
    this.cartLink = this.root.getByRole('link', { name: 'Cart' });
  }

  async openProducts(): Promise<void> {
    await this.productsLink.click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
