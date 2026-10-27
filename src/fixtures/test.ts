import { test as base, expect } from '@playwright/test';
import { ProductsPage } from '@pages/ProductsPage';
import { CartPage } from '@pages/CartPage';
import { blockThirdPartyNoise } from '@utils/blockThirdParty';

type Pages = {
  productsPage: ProductsPage;
  cartPage: CartPage;
};

// testy importujú `test` odtiaľto - dostanú hotové page objekty a kontext bez reklám
export const test = base.extend<Pages>({
  context: async ({ context }, use) => {
    await blockThirdPartyNoise(context);
    await use(context);
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

export { expect };
