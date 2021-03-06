import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Address } from 'ish-core/models/address/address.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';

class FormType {
  addresses: Address[]; // address select options
  form: FormGroup;
  emptyOptionLabel: string; // select box label
  isFormCollapsed = true;
  address: Address;
  isAddressDeleteable: boolean;
}

/**
 * The Checkout Address Component renders the checkout address page. On this page the user can change invoice and shipping address and create a new invoice or shipping address, respectively. See also {@link CheckoutAddressPageContainerComponent}
 *
 * @example
 *<ish-checkout-address
     [currentUser]="currentUser$ | async"
     [basket]="basket"
     [addresses]="addresses$ | async"
     [error]="(basketError$ | async) || (addressesError$ | async)"
     (assignAddressToBasket)="assignAddressToBasket($event)"
     (updateAddress)="updateAddress($event)"
     (createAddress)="createAddress($event)"
     (deleteShippingAddress)="deleteCustomerAddress($event)"
     (nextStep)="nextStep()"
  ></ish-checkout-address>
 */
@Component({
  selector: 'ish-checkout-address',
  templateUrl: './checkout-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressComponent implements OnInit, OnChanges, OnDestroy {
  @Input() currentUser: User;
  @Input() basket: Basket;
  @Input() addresses: Address[];
  @Input() error: HttpError;

  @Output() assignAddressToBasket = new EventEmitter<{ addressId: string; scope: 'invoice' | 'shipping' | 'any' }>();
  @Output() createAddress = new EventEmitter<{ address: Address; scope: 'invoice' | 'shipping' | 'any' }>();
  @Output() updateAddress = new EventEmitter<Address>();
  @Output() deleteShippingAddress = new EventEmitter<string>();
  @Output() nextStep = new EventEmitter<void>();

  invoice = new FormType();
  shipping = new FormType();

  submitted = false;

  private destroy$ = new Subject();

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit() {
    // create invoice address form (selectbox)
    this.invoice.form = new FormGroup({
      id: new FormControl(''),
    });

    // trigger set basket invoice address if it changes
    this.invoice.form
      .get('id')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(invoiceAddressId =>
        this.assignAddressToBasket.emit({ addressId: invoiceAddressId, scope: 'invoice' })
      );

    // create shipping address form (selectbox)
    this.shipping.form = new FormGroup({
      id: new FormControl(''),
    });

    // trigger set basket shipping address if it changes
    this.shipping.form
      .get('id')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(shippingAddressId =>
        this.assignAddressToBasket.emit({ addressId: shippingAddressId, scope: 'shipping' })
      );
  }

  ngOnChanges(c: SimpleChanges) {
    if (this.haveBasketOrAddressesChanged(c)) {
      // prepare select box label and content
      this.prepareInvoiceAddressSelectBox();
      this.prepareShippingAddressSelectBox();

      // close possible address forms after address changes
      this.invoice.isFormCollapsed = true;
      this.shipping.isFormCollapsed = true;

      this.calculateShippingAddressDeletable();
    }
  }

  /**
   * determine whether the basket or the customer addresses have changed
   */
  private haveBasketOrAddressesChanged(c: SimpleChanges) {
    return this.basket && this.addresses && (c.addresses || c.basket);
  }

  /**
   * determine whether the shipping address is deleteable
   */
  private calculateShippingAddressDeletable() {
    this.shipping.isAddressDeleteable =
      this.basket.commonShipToAddress &&
      this.currentUser &&
      this.addresses.length > 1 &&
      (!this.currentUser.preferredInvoiceToAddressUrn ||
        this.basket.commonShipToAddress.urn !== this.currentUser.preferredInvoiceToAddressUrn) &&
      (!this.currentUser.preferredShipToAddressUrn ||
        this.basket.commonShipToAddress.urn !== this.currentUser.preferredShipToAddressUrn);
  }

  /**
   * Sets the label of the invoice select box, which depends on whether or not there is already a basket invoice address.
   * Determines addresses of the select box: all invoice addresses are shown except the address which is currently assigned as invoive address to the basket
   */
  prepareInvoiceAddressSelectBox() {
    this.invoice.emptyOptionLabel = this.basket.invoiceToAddress
      ? 'checkout.addresses.select_a_different_address.default'
      : 'checkout.addresses.select_invoice_address.button';

    this.invoice.addresses = this.addresses.filter(
      (address: Address) =>
        ((this.basket.invoiceToAddress && address.id !== this.basket.invoiceToAddress.id) ||
          !this.basket.invoiceToAddress) &&
        address.invoiceToAddress
    );

    // preset (empty) basket invoice address if there is only one invoice address available
    if (this.invoice.addresses.length === 1 && this.basket && !this.basket.invoiceToAddress) {
      this.assignAddressToBasket.emit({ addressId: this.invoice.addresses[0].id, scope: 'invoice' });
    }
  }

  /**
   * Sets the label of the shipping select box, which depends on whether or not there is already a basket shipping address.
   * Determines addresses of the select box: all shipping addresses are shown except the address which is currently assigned as shipping address to the basket
   */
  prepareShippingAddressSelectBox() {
    this.shipping.emptyOptionLabel = this.basket.commonShipToAddress
      ? 'checkout.addresses.select_a_different_address.default'
      : 'checkout.addresses.select_shipping_address.button';

    this.shipping.addresses = this.addresses.filter(
      (address: Address) =>
        ((this.basket.commonShipToAddress && address.id !== this.basket.commonShipToAddress.id) ||
          !this.basket.commonShipToAddress) &&
        address.shipToAddress
    );

    // preset (empty) basket shipping address if there is only one shipping address available
    if (this.shipping.addresses.length === 1 && this.basket && !this.basket.commonShipToAddress) {
      this.assignAddressToBasket.emit({ addressId: this.shipping.addresses[0].id, scope: 'shipping' });
    }
  }

  showInvoiceAddressForm(address?: Address) {
    this.invoice.isFormCollapsed = false;
    this.cancelEditAddress(this.shipping);
    this.invoice.address = address ? address : undefined;
  }

  showShippingAddressForm(address?: Address) {
    this.shipping.isFormCollapsed = false;
    this.cancelEditAddress(this.invoice);
    this.shipping.address = address ? address : undefined;
  }

  /* functions for reactioning on events of the checkout-address-component */
  saveCustomerInvoiceAddress(address: Address) {
    if (this.invoice.address) {
      this.updateAddress.emit(address);
    } else {
      this.createAddress.emit({ address, scope: 'invoice' });
    }
  }

  saveCustomerShippingAddress(address: Address) {
    if (this.shipping.address) {
      this.updateAddress.emit(address);
    } else {
      this.createAddress.emit({ address, scope: 'shipping' });
    }
  }

  cancelEditAddress(formType: FormType) {
    formType.isFormCollapsed = true;
    formType.address = undefined;
  }

  deleteAddress(address: Address) {
    this.deleteShippingAddress.emit(address.id);
  }

  /**
   * leads to next checkout page (checkout shipping)
   */
  goToNextStep() {
    this.submitted = true;
    if (!this.nextDisabled) {
      this.nextStep.emit();
    }
  }

  get nextDisabled() {
    return this.basket && (!this.basket.invoiceToAddress || !this.basket.commonShipToAddress) && this.submitted;
  }

  get sameShippingAndInvoiceAddress() {
    return (
      this.basket &&
      this.basket.invoiceToAddress &&
      this.basket.commonShipToAddress.urn === this.basket.invoiceToAddress.urn
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
