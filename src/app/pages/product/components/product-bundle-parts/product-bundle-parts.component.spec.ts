import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { ProductBundle } from 'ish-core/models/product/product-bundle.model';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { ProductAddToBasketComponent } from 'ish-shared/product/components/product-add-to-basket/product-add-to-basket.component';
import { ProductItemContainerComponent } from 'ish-shared/product/containers/product-item/product-item.container';

import { ProductBundlePartsComponent } from './product-bundle-parts.component';

describe('Product Bundle Parts Component', () => {
  let component: ProductBundlePartsComponent;
  let fixture: ComponentFixture<ProductBundlePartsComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        MockComponent(ProductAddToBasketComponent),
        MockComponent(ProductItemContainerComponent),
        ProductBundlePartsComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBundlePartsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.product = {
      bundledProducts: [{ sku: '1', quantity: 3 }, { sku: '2', quantity: 1 }],
    } as ProductBundle;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(findAllIshElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-product-add-to-basket",
        "ish-product-item-container",
        "ish-product-item-container",
      ]
    `);
  });
});
