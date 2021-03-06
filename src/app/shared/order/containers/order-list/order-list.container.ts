import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Order } from 'ish-core/models/order/order.model';

/**
 * The Order List Container Component fetches order data and displays them all (or only a limited amount) using the {@link OrderListComponent}
 *
 * @example
 * displays all orders in a compact manner.
 * <ish-order-list-container [order]="order" maxListItems="0" [compact]="true"></ish-order-list-container>
 */
@Component({
  selector: 'ish-order-list-container',
  templateUrl: './order-list.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:ccp-no-markup-in-containers
export class OrderListContainerComponent implements OnInit {
  /**
   * The maximum number of items to be displayed.
   * Use 0, if you want to display all items without any restrictions.
   * Default: At most 30 items will be displayed
   */
  @Input() maxListItems = 30;

  /**
   * Indicates whether or not the list should be displayed in a compact view (single row)
   * Default value: see {@link OrderListComponent}
   */
  @Input() compact: boolean;

  orders$: Observable<Order[]>;
  loading$: Observable<boolean>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.orders$ = this.accountFacade.orders$();
    this.loading$ = this.accountFacade.ordersLoading$;
  }
}
