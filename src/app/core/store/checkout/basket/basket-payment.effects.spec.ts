import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, combineReducers } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { RouteNavigation } from 'ngrx-router';
import { Observable, of, throwError } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { Payment } from 'ish-core/models/payment/payment.model';
import { BasketPaymentService } from 'ish-core/services/basket/basket-payment.service';
import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { coreReducers } from 'ish-core/store/core-store.module';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { BasketPaymentEffects } from './basket-payment.effects';
import * as basketActions from './basket.actions';

describe('Basket Payment Effects', () => {
  let actions$: Observable<Action>;
  let basketPaymentServiceMock: BasketPaymentService;
  let effects: BasketPaymentEffects;
  let store$: Store<{}>;

  beforeEach(() => {
    basketPaymentServiceMock = mock(BasketPaymentService);

    TestBed.configureTestingModule({
      imports: [
        ngrxTesting({
          reducers: {
            ...coreReducers,
            shopping: combineReducers(shoppingReducers),
            checkout: combineReducers(checkoutReducers),
          },
        }),
      ],
      providers: [
        BasketPaymentEffects,
        provideMockActions(() => actions$),
        { provide: BasketPaymentService, useFactory: () => instance(basketPaymentServiceMock) },
      ],
    });

    effects = TestBed.get(BasketPaymentEffects);
    store$ = TestBed.get(Store);
  });

  describe('loadBasketEligiblePaymentMethods$', () => {
    beforeEach(() => {
      when(basketPaymentServiceMock.getBasketEligiblePaymentMethods(anyString())).thenReturn(
        of([BasketMockData.getPaymentMethod()])
      );

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );
    });

    it('should call the basketService for loadBasketEligiblePaymentMethods', done => {
      const action = new basketActions.LoadBasketEligiblePaymentMethods();
      actions$ = of(action);

      effects.loadBasketEligiblePaymentMethods$.subscribe(() => {
        verify(basketPaymentServiceMock.getBasketEligiblePaymentMethods('BID')).once();
        done();
      });
    });

    it('should map to action of type loadBasketEligiblePaymentMethodsSuccess', () => {
      const action = new basketActions.LoadBasketEligiblePaymentMethods();
      const completion = new basketActions.LoadBasketEligiblePaymentMethodsSuccess({
        paymentMethods: [BasketMockData.getPaymentMethod()],
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketEligiblePaymentMethods$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadBasketEligiblePaymentMethodsFail', () => {
      when(basketPaymentServiceMock.getBasketEligiblePaymentMethods(anyString())).thenReturn(
        throwError({ message: 'invalid' })
      );
      const action = new basketActions.LoadBasketEligiblePaymentMethods();
      const completion = new basketActions.LoadBasketEligiblePaymentMethodsFail({
        error: {
          message: 'invalid',
        } as HttpError,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketEligiblePaymentMethods$).toBeObservable(expected$);
    });
  });

  describe('setPaymentAtBasket$ - set payment at basket for the first time', () => {
    beforeEach(() => {
      when(basketPaymentServiceMock.setBasketPayment(anyString(), anyString())).thenReturn(of(undefined));

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
            payment: undefined,
          } as Basket,
        })
      );
    });

    it('should call the basketService for setPaymentAtBasket', done => {
      const id = 'newPayment';
      const action = new basketActions.SetBasketPayment({ id });
      actions$ = of(action);

      effects.setPaymentAtBasket$.subscribe(() => {
        verify(basketPaymentServiceMock.setBasketPayment('BID', id)).once();
        done();
      });
    });

    it('should map to action of type SetBasketPaymentSuccess', () => {
      const id = 'newPayment';
      const action = new basketActions.SetBasketPayment({ id });
      const completion = new basketActions.SetBasketPaymentSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.setPaymentAtBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type SetPaymentFail', () => {
      when(basketPaymentServiceMock.setBasketPayment(anyString(), anyString())).thenReturn(
        throwError({ message: 'invalid' })
      );
      const action = new basketActions.SetBasketPayment({ id: 'newPayment' });
      const completion = new basketActions.SetBasketPaymentFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.setPaymentAtBasket$).toBeObservable(expected$);
    });
  });

  describe('setPaymentAtBasket$ - change payment method at basket', () => {
    beforeEach(() => {
      when(basketPaymentServiceMock.setBasketPayment(anyString(), anyString())).thenReturn(of(undefined));

      store$.dispatch(new basketActions.LoadBasketSuccess({ basket: BasketMockData.getBasket() }));
    });

    it('should call the basketService for setPaymentAtBasket', done => {
      const id = 'newPayment';
      const action = new basketActions.SetBasketPayment({ id });
      actions$ = of(action);

      effects.setPaymentAtBasket$.subscribe(() => {
        verify(basketPaymentServiceMock.setBasketPayment('4711', id)).once();
        done();
      });
    });

    it('should map to action of type SetBasketPaymentSuccess', () => {
      const id = 'newPayment';
      const action = new basketActions.SetBasketPayment({ id });
      const completion = new basketActions.SetBasketPaymentSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.setPaymentAtBasket$).toBeObservable(expected$);
    });

    it('should map invalid addBasketPayment request to action of type SetPaymentFail', () => {
      when(basketPaymentServiceMock.setBasketPayment(anyString(), anyString())).thenReturn(
        throwError({ message: 'invalid' })
      );
      const action = new basketActions.SetBasketPayment({ id: 'newPayment' });
      const completion = new basketActions.SetBasketPaymentFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.setPaymentAtBasket$).toBeObservable(expected$);
    });
  });

  describe('createBasketPaymentInstrument$', () => {
    const paymentInstrument = {
      id: undefined,
      paymentMethod: 'ISH_DirectDebit',
      parameters_: [
        {
          name: 'accountHolder',
          value: 'Patricia Miller',
        },
        {
          name: 'IBAN',
          value: 'DE430859340859340',
        },
      ],
    };

    beforeEach(() => {
      when(basketPaymentServiceMock.createBasketPayment(anyString(), anything())).thenReturn(
        of({ id: 'newPaymentInstrumentId' } as PaymentInstrument)
      );

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
            payment: undefined,
          } as Basket,
        })
      );
    });

    it('should call the basketService for createBasketPayment', done => {
      const action = new basketActions.CreateBasketPayment({ paymentInstrument });
      actions$ = of(action);

      effects.createBasketPaymentInstrument$.subscribe(() => {
        verify(basketPaymentServiceMock.createBasketPayment('BID', anything())).once();
        done();
      });
    });

    it('should map to action of type SetBasketPayment and CreateBasketPaymentSuccess', () => {
      const action = new basketActions.CreateBasketPayment({ paymentInstrument });
      const completion1 = new basketActions.SetBasketPayment({ id: 'newPaymentInstrumentId' });
      const completion2 = new basketActions.CreateBasketPaymentSuccess();
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(cd)', { c: completion1, d: completion2 });

      expect(effects.createBasketPaymentInstrument$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type CreateBasketPaymentFail', () => {
      when(basketPaymentServiceMock.createBasketPayment(anyString(), anything())).thenReturn(
        throwError({ message: 'invalid' })
      );
      const action = new basketActions.CreateBasketPayment({ paymentInstrument });
      const completion = new basketActions.CreateBasketPaymentFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createBasketPaymentInstrument$).toBeObservable(expected$);
    });

    it('should map to action of type LoadEligibleBasketMethod in case of success', () => {
      const action = new basketActions.CreateBasketPaymentSuccess();
      const completion = new basketActions.LoadBasketEligiblePaymentMethods();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketEligiblePaymentMethodsAfterChange$).toBeObservable(expected$);
    });
  });

  describe('sendPaymentRedirectData$', () => {
    beforeEach(() => {
      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );
    });

    it('should trigger updateBasketPayment action if checkout payment/review page is called with query param "redirect"', () => {
      const params = { redirect: 'success', param1: 123 };

      const action = new RouteNavigation({
        path: 'checkout/review',
        queryParams: { redirect: 'success', param1: 123 },
      });
      actions$ = hot('-a', { a: action });

      expect(effects.sendPaymentRedirectData$).toBeObservable(
        cold('-c', { c: new basketActions.UpdateBasketPayment({ params }) })
      );
    });
  });

  describe('updateBasketPayment$', () => {
    const paymentInstrument = {
      id: '456',
      paymentMethod: 'ISH_DirectDebit',
      parameters_: [
        {
          name: 'accountHolder',
          value: 'Patricia Miller',
        },
        {
          name: 'IBAN',
          value: 'DE430859340859340',
        },
      ],
    };

    const params = {
      redirect: 'success',
      param1: '123',
      param2: '456',
    };

    const payment = {
      id: '123',
      paymentInstrument,
      paymentMethod: { id: 'ISH_DirectDebit' } as PaymentMethod,
      redirectRequired: false,
    };

    beforeEach(() => {
      when(basketPaymentServiceMock.updateBasketPayment(anyString(), anything())).thenReturn(of(payment));

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
            payment: payment as Payment,
          } as Basket,
        })
      );
    });

    it('should call the basketService for updateBasketPayment', done => {
      const action = new basketActions.UpdateBasketPayment({ params });
      actions$ = of(action);

      effects.updateBasketPayment$.subscribe(() => {
        verify(basketPaymentServiceMock.updateBasketPayment('BID', anything())).once();
        done();
      });
    });

    it('should map to action of type UpdateBasketPaymentSuccess', () => {
      const action = new basketActions.UpdateBasketPayment({ params });
      const completion = new basketActions.UpdateBasketPaymentSuccess();

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasketPayment$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type UpdateBasketPaymentFail', () => {
      when(basketPaymentServiceMock.updateBasketPayment(anyString(), anything())).thenReturn(
        throwError({ message: 'invalid' })
      );
      const action = new basketActions.UpdateBasketPayment({ params });
      const completion = new basketActions.UpdateBasketPaymentFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasketPayment$).toBeObservable(expected$);
    });

    it('should map to action of type LoadBasket in case of success', () => {
      const action = new basketActions.UpdateBasketPaymentSuccess();
      const completion = new basketActions.LoadBasket();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketAfterBasketChangeSuccess$).toBeObservable(expected$);
    });
  });

  describe('deleteBasketPaymentInstrument$', () => {
    beforeEach(() => {
      when(basketPaymentServiceMock.deleteBasketPaymentInstrument(anyString(), anyString())).thenReturn(of(undefined));

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
            payment: undefined,
          } as Basket,
        })
      );
    });

    it('should call the basketService for deleteBasketPayment', done => {
      const id = 'paymentInstrumentId';
      const action = new basketActions.DeleteBasketPayment({ id });
      actions$ = of(action);

      effects.deleteBasketPaymentInstrument$.subscribe(() => {
        verify(basketPaymentServiceMock.deleteBasketPaymentInstrument('BID', id)).once();
        done();
      });
    });

    it('should map to action of type DeleteBasketPaymentSuccess', () => {
      const id = 'paymentInstrumentId';
      const action = new basketActions.DeleteBasketPayment({ id });
      const completion = new basketActions.DeleteBasketPaymentSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteBasketPaymentInstrument$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type DeleteBasketPaymentFail', () => {
      when(basketPaymentServiceMock.deleteBasketPaymentInstrument(anyString(), anyString())).thenReturn(
        throwError({ message: 'invalid' })
      );
      const action = new basketActions.DeleteBasketPayment({ id: 'newPayment' });
      const completion = new basketActions.DeleteBasketPaymentFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteBasketPaymentInstrument$).toBeObservable(expected$);
    });

    it('should map to action of type GetEligiblePaymentMethods in case of success', () => {
      const action = new basketActions.DeleteBasketPaymentSuccess();
      const completion = new basketActions.LoadBasketEligiblePaymentMethods();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketEligiblePaymentMethodsAfterChange$).toBeObservable(expected$);
    });

    it('should map to action of type LoadBasket in case of success', () => {
      const action = new basketActions.DeleteBasketPaymentSuccess();
      const completion = new basketActions.LoadBasket();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketAfterBasketChangeSuccess$).toBeObservable(expected$);
    });
  });
});
