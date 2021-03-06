import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountOverviewPageModule } from '../account-overview/account-overview-page.module';

import { AccountPageContainerComponent } from './account-page.container';
import { AccountNavigationComponent } from './components/account-navigation/account-navigation.component';

const accountPageRoutes: Routes = [
  {
    path: '',
    component: AccountPageContainerComponent,
    children: [
      {
        path: 'addresses',
        data: { breadcrumbData: [{ key: 'account.saved_addresses.link' }] },
        loadChildren: () =>
          import('../account-addresses/account-addresses-page.module').then(m => m.AccountAddressesPageModule),
      },
      {
        path: 'orders',
        data: { breadcrumbData: [{ key: 'account.order_history.link' }] },
        loadChildren: () =>
          import('../account-order-history/account-order-history-page.module').then(
            m => m.AccountOrderHistoryPageModule
          ),
      },
      {
        path: 'orders/:orderId',
        data: {
          breadcrumbData: [
            { key: 'account.order_history.link', link: '/account/orders' },
            { key: 'account.orderdetails.breadcrumb' },
          ],
        },
        loadChildren: () => import('../account-order/account-order-page.module').then(m => m.AccountOrderPageModule),
      },
      {
        path: 'overview',
        data: { breadcrumbData: [{ key: 'account.overview.link' }] },
        component: AccountOverviewPageModule.component,
      },
      {
        path: 'profile',
        data: { breadcrumbData: [{ key: 'account.profile.link' }] },
        loadChildren: () =>
          import('../account-profile/account-profile-page.module').then(m => m.AccountProfilePageModule),
      },
      {
        path: 'quote-list',
        data: { breadcrumbData: [{ key: 'quote.quotes.link' }] },
        loadChildren: () =>
          import('../../extensions/quoting/pages/quote-list/quote-list-page.module').then(m => m.QuoteListPageModule),
      },
      {
        path: 'quote',
        data: { breadcrumbData: [{ key: 'quote.quotes.link' }] },
        loadChildren: () =>
          import('../../extensions/quoting/pages/quote-edit/quote-edit-page.module').then(m => m.QuoteEditPageModule),
      },
      {
        path: 'quote-request',
        data: {
          breadcrumbData: [
            { key: 'quote.quotes.link', link: '/account/quote-list' },
            { key: 'quote.quote_details.link' },
          ],
        },
        loadChildren: () =>
          import('../../extensions/quoting/pages/quote-request-edit/quote-request-edit-page.module').then(
            m => m.QuoteRequestEditPageModule
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
    ],
  },
];
@NgModule({
  imports: [AccountOverviewPageModule, RouterModule.forChild(accountPageRoutes), SharedModule],
  declarations: [AccountNavigationComponent, AccountPageContainerComponent],
})
export class AccountPageModule {}
