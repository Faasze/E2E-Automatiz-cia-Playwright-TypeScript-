import { expect, type Locator, type Page } from '@playwright/test';

export class ProductCard {
  readonly name: Locator;
  readonly price: Locator;
  readonly addToCartButton: Locator;

  constructor(
    readonly root: Locator,
    private readonly page: Page,
  ) {
    // karta má tlačidlo 2x (druhé v overlay pri hoveri), preto len .productinfo
    const info = root.locator('.productinfo');
    this.name = info.locator('p');
    this.price = info.locator('h2');
    this.addToCartButton = info.locator('.add-to-cart');
  }

  // čakám na odpoveď servera, nie len na okno - pri pomalom serveri je to spoľahlivejšie
  async addToCart(): Promise<void> {
    const response = this.page.waitForResponse((r) => r.url().includes('/add_to_cart/'), { timeout: 30_000 });
    await this.addToCartButton.click();
    expect((await response).ok(), 'add_to_cart request should succeed').toBe(true);
  }
}
