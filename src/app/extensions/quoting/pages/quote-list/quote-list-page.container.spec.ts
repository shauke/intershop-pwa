import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LoadingComponent } from 'ish-shared/common/components/loading/loading.component';

import { QuoteData } from '../../models/quote/quote.interface';
import { LoadQuotes, LoadQuotesSuccess } from '../../store/quote';
import { LoadQuoteRequests } from '../../store/quote-request';
import { quotingReducers } from '../../store/quoting-store.module';

import { QuoteListComponent } from './components/quote-list/quote-list.component';
import { QuoteListPageContainerComponent } from './quote-list-page.container';

describe('Quote List Page Container', () => {
  let component: QuoteListPageContainerComponent;
  let fixture: ComponentFixture<QuoteListPageContainerComponent>;
  let element: HTMLElement;
  let store$: Store<{}>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(LoadingComponent),
        MockComponent(QuoteListComponent),
        QuoteListPageContainerComponent,
      ],
      imports: [
        TranslateModule.forRoot(),
        ngrxTesting({
          reducers: {
            quoting: combineReducers(quotingReducers),
          },
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteListPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    store$ = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render loading component if quotes loading', () => {
    store$.dispatch(new LoadQuotes());
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should render loading component if quote requests loading', () => {
    store$.dispatch(new LoadQuoteRequests());
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should render quote list component if quotes present', () => {
    const quotes = {
      quotes: [
        {
          id: 'test',
        } as QuoteData,
      ],
    };

    store$.dispatch(new LoadQuotesSuccess(quotes));
    fixture.detectChanges();
    expect(element.querySelector('ish-quote-list')).toBeTruthy();
  });
});
