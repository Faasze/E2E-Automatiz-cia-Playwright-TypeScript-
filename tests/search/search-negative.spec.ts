import { test, expect } from '@fixtures/test';
import { testData } from '@utils/testData';

test.describe('Search – negative flow', () => {
  for (const search of testData.invalidSearches) {
    test(`search for non-existent product "${search.searchTerm}" returns no results and cart stays empty @negative`, async ({
      productsPage,
      cartPage,
    }) => {
      await test.step('Search for a product that does not exist', async () => {
        await productsPage.open();
        await productsPage.search(search.searchTerm);
      });

      await test.step('No products are shown', async () => {
        await expect(productsPage.productCards).toHaveCount(0);
      });

      await test.step('Cart is empty – nothing was added by mistake', async () => {
        await cartPage.header.openCart();
        await expect(cartPage.emptyCartMessage).toBeVisible();
        await expect(cartPage.emptyCartMessage).toContainText('Cart is empty!');
        await expect(cartPage.rows).toHaveCount(0);
      });
    });
  }
});
