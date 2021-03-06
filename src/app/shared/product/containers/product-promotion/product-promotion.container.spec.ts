import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Product } from 'ish-core/models/product/product.model';
import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { PromotionDetailsComponent } from 'ish-shared/promotion/components/promotion-details/promotion-details.component';

import { ProductPromotionContainerComponent } from './product-promotion.container';

describe('Product Promotion Container', () => {
  let component: ProductPromotionContainerComponent;
  let fixture: ComponentFixture<ProductPromotionContainerComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async(() => {
    shoppingFacade = mock(ShoppingFacade);

    TestBed.configureTestingModule({
      declarations: [
        MockComponent(PromotionDetailsComponent),
        MockComponent(ServerHtmlDirective),
        ProductPromotionContainerComponent,
      ],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPromotionContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.product = {
      promotionIds: ['PROMO_UUID'],
    } as Product;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => component.ngOnChanges()).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the promotion when supplied', () => {
    when(shoppingFacade.promotions$(anything())).thenReturn(
      of([
        {
          id: 'PROMO_UUID',
          title: 'MyPromotion',
          disableMessages: false,
        } as Promotion,
      ])
    );
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <ul class="promotion-list">
        <li class="promotion-list-item">
          <div class="promotion-short-title" ng-reflect-ish-server-html="MyPromotion"></div>
          <br />
          <div><ish-promotion-details></ish-promotion-details></div>
        </li>
      </ul>
    `);
  });
});
