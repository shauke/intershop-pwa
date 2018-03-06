import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';

@Injectable()
export class SearchService {

  private serviceIdentifier = 'products';

  constructor(
    private apiService: ApiService
  ) { }

  /**
   * REST API - Get search product data
   * @param searchTerm  term to search for
   * @returns           array of product SKUs
   */
  searchForProductSkus(searchTerm: string): Observable<string[]> {
    if (!searchTerm) {
      return ErrorObservable.create('searchForProductSkus() called without searchTerm');
    }

    const params = new HttpParams().set('searchTerm', searchTerm).set('attrs', 'sku');

    return this.apiService.get(this.serviceIdentifier, params, null, true, false).pipe(
      map((resultArray: any[]) => resultArray.map(element => element.attributes[0].value))
    );
  }

}
