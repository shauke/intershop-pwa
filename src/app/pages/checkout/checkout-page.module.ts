import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CheckoutAddressPageModule } from '../checkout-address/checkout-address-page.module';
import { CheckoutPaymentPageModule } from '../checkout-payment/checkout-payment-page.module';
import { CheckoutReceiptPageModule } from '../checkout-receipt/checkout-receipt-page.module';
import { CheckoutReviewPageModule } from '../checkout-review/checkout-review-page.module';
import { CheckoutShippingPageModule } from '../checkout-shipping/checkout-shipping-page.module';

import { CheckoutPageContainerComponent } from './checkout-page.container';
import { CheckoutProgressBarComponent } from './components/checkout-progress-bar/checkout-progress-bar.component';

const checkoutPageRoutes: Routes = [
  {
    path: '',
    component: CheckoutPageContainerComponent,
    children: [
      {
        path: 'shipping',
        data: { checkoutStep: 1 },
        component: CheckoutShippingPageModule.component,
      },
      {
        path: 'payment',
        data: { checkoutStep: 2 },
        component: CheckoutPaymentPageModule.component,
      },
      {
        path: 'review',
        data: { checkoutStep: 3 },
        component: CheckoutReviewPageModule.component,
      },
      {
        path: 'receipt',
        data: { checkoutStep: 4 },
        component: CheckoutReceiptPageModule.component,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'shipping',
      },
    ],
  },
];

@NgModule({
  imports: [
    CheckoutAddressPageModule,
    CheckoutPaymentPageModule,
    CheckoutReceiptPageModule,
    CheckoutReviewPageModule,
    CheckoutShippingPageModule,
    RouterModule.forChild(checkoutPageRoutes),
    SharedModule,
  ],
  declarations: [CheckoutPageContainerComponent, CheckoutProgressBarComponent],
})
export class CheckoutPageModule {}
