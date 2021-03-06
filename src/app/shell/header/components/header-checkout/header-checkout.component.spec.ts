import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { LoginStatusContainerComponent } from 'ish-shell/header/containers/login-status/login-status.container';

import { HeaderCheckoutComponent } from './header-checkout.component';

describe('Header Checkout Component', () => {
  let component: HeaderCheckoutComponent;
  let fixture: ComponentFixture<HeaderCheckoutComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderCheckoutComponent, MockComponent(LoginStatusContainerComponent)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderCheckoutComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render login status container for logout link', () => {
    expect(findAllIshElements(element)).toContain('ish-login-status-container');
  });

  it('should render home link for navigation to home page', () => {
    fixture.detectChanges();
    expect(element.querySelector('a[data-testing-id=link-home]')).toBeTruthy();
  });
});
