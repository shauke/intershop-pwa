import { TestBed, async } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { Product } from 'ish-core/models/product/product.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { ICM_BASE_URL } from 'ish-core/utils/state-transfer/factories';

import { ProductsService } from './products.service';

describe('Products Service', () => {
  let productsService: ProductsService;
  let apiServiceMock: ApiService;

  const productSku = 'SKU';
  const categoryId = 'CategoryID';
  const productsMockData = {
    elements: [
      {
        type: 'Link',
        uri: '/categories/CategoryID/products/ProductA',
        title: 'Product A',
        attributes: [{ name: 'sku', type: 'String', value: 'ProductA' }],
      },
      {
        type: 'Link',
        uri: '/categories/CategoryID/products/ProductB',
        title: 'Product B',
        attributes: [{ name: 'sku', type: 'String', value: 'ProductB' }],
      },
    ],
    type: 'ResourceCollection',
    sortKeys: ['name-desc', 'name-asc'],
    name: 'products',
  };

  beforeEach(async(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
        { provide: ICM_BASE_URL, useValue: 'http://www.example.org' },
      ],
    });
    productsService = TestBed.get(ProductsService);
  }));

  it("should get Product data when 'getProduct' is called", done => {
    when(apiServiceMock.get(`products/${productSku}`, anything())).thenReturn(of({ sku: productSku } as Product));
    productsService.getProduct(productSku).subscribe(data => {
      expect(data.sku).toEqual(productSku);
      verify(apiServiceMock.get(`products/${productSku}`, anything())).once();
      done();
    });
  });

  it("should get a list of products SKUs for a given Category when 'getCategoryProducts' is called", done => {
    when(apiServiceMock.get(`categories/${categoryId}/products`, anything())).thenReturn(of(productsMockData));
    productsService.getCategoryProducts(categoryId, 0, 3).subscribe(data => {
      expect(data.products.map(p => p.sku)).toEqual(['ProductA', 'ProductB']);
      expect(data.categoryUniqueId).toEqual(categoryId);
      expect(data.sortKeys).toEqual(['name-desc', 'name-asc']);
      verify(apiServiceMock.get(`categories/${categoryId}/products`, anything())).once();
      done();
    });
  });

  it('should get products based on the given search term', () => {
    const searchTerm = 'aaa';

    when(apiServiceMock.get(anything(), anything())).thenReturn(of(productsMockData));
    productsService.searchProducts(searchTerm, 0, 10);

    verify(apiServiceMock.get(anything(), anything())).once();
  });
});
