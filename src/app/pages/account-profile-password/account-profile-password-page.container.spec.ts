import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LoadingComponent } from 'ish-shared/common/components/loading/loading.component';

import { AccountProfilePasswordPageContainerComponent } from './account-profile-password-page.container';
import { AccountProfilePasswordComponent } from './components/account-profile-password/account-profile-password.component';

describe('Account Profile Password Page Container', () => {
  let component: AccountProfilePasswordPageContainerComponent;
  let fixture: ComponentFixture<AccountProfilePasswordPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ngrxTesting({ reducers: coreReducers })],
      declarations: [
        AccountProfilePasswordPageContainerComponent,
        MockComponent(AccountProfilePasswordComponent),
        MockComponent(LoadingComponent),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfilePasswordPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
