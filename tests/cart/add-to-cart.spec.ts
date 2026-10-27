import { test, expect } from '@fixtures/test';
import { testData } from '@utils/testData';

test.describe('Cart – positive flow', () => {
  // jeden test pre každý produkt z JSON-u
  for (const product of testData.cartProducts) {
    test(`search "${product.searchTerm}" and add "${product.productName}" to cart @smoke`, async ({
      productsPage,
      cartPage,
    }) => {
      await test.step('Search for the product', async () => {
        await productsPage.open();
        await productsPage.search(product.searchTerm);
      });

      await test.step('Product is in search results with correct price', async () => {
        const card = productsPage.productByName(product.productName);
        await expect(card.root).toHaveCount(1);
        await expect(card.price).toHaveText(product.price);
      });

      await test.step('Add product to cart', async () => {
        await productsPage.addProductToCart(product.productName);
        await productsPage.addedToCartModal.viewCart();
      });

      await test.step('Cart contains exactly the right product', async () => {
        await expect(cartPage.rows).toHaveCount(1);

        const row = cartPage.rowByProductName(product.productName);
        await expect(row.name).toHaveText(product.productName);
        await expect(row.price).toHaveText(product.price);
        await expect(row.quantity).toHaveText(String(product.quantity));
      });
    });
  }
});
