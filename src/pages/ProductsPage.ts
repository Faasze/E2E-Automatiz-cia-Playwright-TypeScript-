import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ProductCard } from '@components/ProductCard';
import { AddedToCartModal } from '@components/AddedToCartModal';

export class ProductsPage extends BasePage {
  protected readonly path = '/products';

  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly listingTitle: Locator;
  readonly productCards: Locator;
  readonly addedToCartModal: AddedToCartModal;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.listingTitle = page.locator('.features_items > h2.title');
    this.productCards = page.locator('.features_items .product-image-wrapper');
    this.addedToCartModal = new AddedToCartModal(page);
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchButton.click();
    await this.page.waitForURL(/[?&]search=/, { waitUntil: 'domcontentloaded' });
    await this.ensureSiteAvailable();
    await expect(this.listingTitle).toHaveText(/searched products/i);
  }

  // podľa presného názvu - vyhľadávanie môže vrátiť viac produktov
  productByName(name: string): ProductCard {
    const root = this.productCards.filter({
      has: this.page.locator('.productinfo p').getByText(name, { exact: true }),
    });
    return new ProductCard(root, this.page);
  }

  async productNames(): Promise<string[]> {
    return this.productCards.locator('.productinfo p').allTextContents();
  }

  async addProductToCart(name: string): Promise<void> {
    const card = this.productByName(name);
    await expect(card.root, `product "${name}" should be in the results`).toHaveCount(1);
    await card.addToCart();
    await this.addedToCartModal.expectVisible();
  }
}
