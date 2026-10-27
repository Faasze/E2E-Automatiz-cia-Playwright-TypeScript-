import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartRow {
  readonly name: Locator;
  readonly price: Locator;
  readonly quantity: Locator;
  readonly total: Locator;

  constructor(readonly root: Locator) {
    this.name = root.locator('.cart_description h4 a');
    this.price = root.locator('.cart_price p');
    this.quantity = root.locator('.cart_quantity button');
    this.total = root.locator('.cart_total_price');
  }
}

export class CartPage extends BasePage {
  protected readonly path = '/view_cart';

  readonly rows: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.rows = page.locator('#cart_info_table tbody tr');
    this.emptyCartMessage = page.locator('#empty_cart');
  }

  rowByProductName(name: string): CartRow {
    return new CartRow(
      this.rows.filter({ has: this.page.locator('.cart_description h4 a').getByText(name, { exact: true }) }),
    );
  }
}
