import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Customer } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { whenTruthy } from 'ish-core/utils/operators';

/**
 * The Account Profile Company Page Container Component renders a page where the (business) user can change the company data using the {@link AccountProfileCompanyPageComponent}
 */
@Component({
  selector: 'ish-account-profile-company-page-container',
  templateUrl: './account-profile-company-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfileCompanyPageContainerComponent implements OnInit {
  currentCustomer$: Observable<Customer>;
  userError$: Observable<HttpError>;
  userLoading$: Observable<boolean>;

  constructor(private accountFacade: AccountFacade, private router: Router) {}

  ngOnInit() {
    this.currentCustomer$ = this.accountFacade.customer$;
    this.userError$ = this.accountFacade.userError$;
    this.userLoading$ = this.accountFacade.userLoading$;

    // check if the current customer is a business customer, otherwise the profile page is displayed
    this.currentCustomer$
      .pipe(
        whenTruthy(),
        take(1)
      )
      .subscribe(customer => {
        if (!customer.isBusinessCustomer) {
          this.router.navigate(['/account/profile']);
        }
      });
  }

  updateCompanyProfile(customer: Customer) {
    this.accountFacade.updateCustomerProfile(customer);
  }
}
