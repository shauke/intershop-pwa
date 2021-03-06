import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { LoadingComponent } from 'ish-shared/common/components/loading/loading.component';
import { ProductItemContainerComponent } from 'ish-shared/product/containers/product-item/product-item.container';

import { RecentlyViewedAllComponent } from './recently-viewed-all.component';

describe('Recently Viewed All Component', () => {
  let component: RecentlyViewedAllComponent;
  let fixture: ComponentFixture<RecentlyViewedAllComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(LoadingComponent),
        MockComponent(ProductItemContainerComponent),
        RecentlyViewedAllComponent,
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentlyViewedAllComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.products = ['sku'];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
