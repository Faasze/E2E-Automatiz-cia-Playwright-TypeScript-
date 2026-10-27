import type { Page } from '@playwright/test';
import { Header } from '@components/Header';

export abstract class BasePage {
  readonly header: Header;
  protected abstract readonly path: string;

  constructor(protected readonly page: Page) {
    this.header = new Header(page);
  }

  // nečakám na "load" (obrázky, skripty tretích strán) - na prvky čakajú asserty
  async open(): Promise<void> {
    const response = await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
    if (response && response.status() >= 500) {
      throw new Error(`ENVIRONMENT ISSUE: ${this.page.url()} returned HTTP ${response.status()}. Not a product bug.`);
    }
    await this.ensureSiteAvailable();
  }

  // demo stránka je občas preťažená alebo spadne (Cloudflare 5xx) - nech je v reporte jasné, že to nie je bug
  protected async ensureSiteAvailable(): Promise<void> {
    const errorPage = this.page.getByRole('heading', { name: /under heavy load|error code 5\d\d/i });
    if (await errorPage.isVisible()) {
      throw new Error(
        `ENVIRONMENT ISSUE: ${this.page.url()} is unavailable ("${await errorPage.innerText()}"). ` +
          'This is not a product bug – re-run later.',
      );
    }
  }
}
