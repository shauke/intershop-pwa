import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { ErrorMessageComponent } from 'ish-shared/common/components/error-message/error-message.component';

import { ShoppingBasketEmptyComponent } from './shopping-basket-empty.component';

describe('Shopping Basket Empty Component', () => {
  let component: ShoppingBasketEmptyComponent;
  let fixture: ComponentFixture<ShoppingBasketEmptyComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent(ErrorMessageComponent), ShoppingBasketEmptyComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingBasketEmptyComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
