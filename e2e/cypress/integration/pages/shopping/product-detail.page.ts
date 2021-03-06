import { BreadcrumbModule } from '../breadcrumb.module';
import { HeaderModule } from '../header.module';

import { ProductListModule } from './product-list.module';

export class ProductDetailPage {
  readonly tag = 'ish-product-page-container';

  readonly header = new HeaderModule();
  readonly breadcrumb = new BreadcrumbModule();

  readonly bundleParts = new ProductListModule('ish-product-bundle-parts');
  readonly retailSetParts = new ProductListModule('ish-retail-set-parts');
  readonly variations = new ProductListModule('ish-product-master-variations');

  static navigateTo(sku: string, categoryUniqueId?: string) {
    if (categoryUniqueId) {
      cy.visit(`/category/${categoryUniqueId}/product/${sku}`);
    } else {
      cy.visit(`/product/${sku}`);
    }
  }

  private addToCartButton = () => cy.get('ish-product-detail').find('[data-testing-id="addToCartButton"]');
  private addToCompareButton() {
    return cy.get('ish-product-detail').find('ish-product-detail-actions [data-testing-id*="compare"]');
  }
  private addToQuoteRequestButton = () => cy.get('ish-product-detail').find('[data-testing-id="addToQuoteButton"]');
  private quantityInput = () => cy.get('ish-product-detail').find('[data-testing-id="quantity"]');

  isComplete() {
    return this.addToCartButton().should('be.visible');
  }

  get sku() {
    return cy.get('ish-product-detail').find('span[itemprop="sku"]');
  }

  get price() {
    return cy.get('ish-product-detail').find('div[data-testing-id="current-price"]');
  }

  addProductToCompare() {
    this.addToCompareButton().click();
  }

  addProductToCart() {
    cy.wait(1000);
    cy.server()
      .route('GET', '**/baskets/current*')
      .as('basket');
    this.addToCartButton().click();
    return cy.wait('@basket');
  }

  addProductToQuoteRequest() {
    this.addToQuoteRequestButton().click();
  }

  setQuantity(quantity: number) {
    this.quantityInput().clear();
    this.quantityInput().type(quantity.toString());
  }

  get recentlyViewedItems() {
    return cy.get('[data-testing-id="recently-viewed"] ish-product-tile');
  }

  recentlyViewedItem(sku: string) {
    return this.recentlyViewedItems.find(`[data-testing-sku="${sku}"]`).first();
  }

  gotoRecentlyViewedViewAll() {
    cy.get('[data-testing-id="recently-viewed"] [data-testing-id=view-all]').click();
  }

  accordionItem(id: string) {
    return cy.get('ish-accordion-item a.accordion-toggle').contains(id);
  }

  changeVariationWithSelect(id: string, value: string) {
    // tslint:disable-next-line:ban
    cy.get('#' + id).select(value);
  }

  gotoMasterProduct() {
    cy.get('a.all-variations-link').click();
  }
}
