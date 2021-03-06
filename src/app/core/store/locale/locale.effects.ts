import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ofRoute } from 'ngrx-router';
import { filter, mapTo, mergeMapTo, take, tap } from 'rxjs/operators';

import { AVAILABLE_LOCALES } from 'ish-core/configurations/injection-keys';
import { Locale } from 'ish-core/models/locale/locale.model';
import { mapToProperty, whenTruthy } from 'ish-core/utils/operators';

import * as fromActions from './locale.actions';
import { getAvailableLocales, getCurrentLocale } from './locale.selectors';

@Injectable()
export class LocaleEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{}>,
    private translateService: TranslateService,
    @Inject(AVAILABLE_LOCALES) private availableLocales: Locale[]
  ) {}

  @Effect({ dispatch: false })
  setLocale$ = this.store.pipe(
    select(getCurrentLocale),
    mapToProperty('lang'),
    whenTruthy(),
    tap(lang => this.translateService.use(lang))
  );

  /**
   * set available locales on app init
   */
  @Effect()
  loadAllLocales$ = this.actions$.pipe(
    ofRoute(),
    take(1),
    mergeMapTo(
      this.store.pipe(
        select(getAvailableLocales),
        filter(locales => !locales.length)
      )
    ),
    mapTo(new fromActions.SetAvailableLocales({ locales: this.availableLocales }))
  );
}
