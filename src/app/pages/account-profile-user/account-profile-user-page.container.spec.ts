import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';

import { AVAILABLE_LOCALES } from 'ish-core/configurations/injection-keys';
import { Locale } from 'ish-core/models/locale/locale.model';
import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LoadingComponent } from 'ish-shared/common/components/loading/loading.component';

import { AccountProfileUserPageContainerComponent } from './account-profile-user-page.container';
import { AccountProfileUserComponent } from './components/account-profile-user/account-profile-user.component';

describe('Account Profile User Page Container', () => {
  let component: AccountProfileUserPageContainerComponent;
  let fixture: ComponentFixture<AccountProfileUserPageContainerComponent>;
  let element: HTMLElement;
  let locales: Locale[];

  beforeEach(async(() => {
    locales = [
      { lang: 'en_US', currency: 'USD', value: 'en' },
      { lang: 'de_DE', currency: 'EUR', value: 'de' },
    ] as Locale[];

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ngrxTesting({ reducers: coreReducers })],
      declarations: [
        AccountProfileUserPageContainerComponent,
        MockComponent(AccountProfileUserComponent),
        MockComponent(LoadingComponent),
      ],
      providers: [{ provide: AVAILABLE_LOCALES, useValue: locales }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfileUserPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
