import * as using from 'jasmine-data-provider';

import { AttributeGroup } from 'ish-core/models/attribute-group/attribute-group.model';
import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';

import { ProductDataStub } from './product.interface';
import { Product, ProductCompletenessLevel, ProductHelper } from './product.model';

describe('Product Helper', () => {
  describe('image', () => {
    let product: Product;
    beforeEach(() => {
      product = { sku: 'sku' } as Product;
      product.images = [
        {
          name: 'front S',
          type: 'Image',
          imageActualHeight: 110,
          imageActualWidth: 110,
          viewID: 'front',
          effectiveUrl: '/assets/product_img/a.jpg',
          typeID: 'S',
          primaryImage: true,
        },
        {
          name: 'front S',
          type: 'Image',
          imageActualHeight: 110,
          imageActualWidth: 110,
          viewID: 'front',
          effectiveUrl: '/assets/product_img/a.jpg',
          typeID: 'S',
          primaryImage: false,
        },
        {
          name: 'front L',
          type: 'Image',
          imageActualHeight: 500,
          imageActualWidth: 500,
          viewID: 'front',
          effectiveUrl: '/assets/product_img/a.jpg',
          typeID: 'L',
          primaryImage: true,
        },
        {
          name: 'side L',
          type: 'Image',
          imageActualHeight: 500,
          imageActualWidth: 500,
          viewID: 'side',
          effectiveUrl: '/assets/product_img/a.jpg',
          typeID: 'L',
          primaryImage: false,
        },
      ];
    });

    describe('getPrimaryImage()', () => {
      it('should return primary image when called with image type as L(Large size)', () => {
        expect(ProductHelper.getPrimaryImage(product, 'L').primaryImage).toBeTruthy();
      });

      it('should return undefined  when called with invalid image type', () => {
        expect(ProductHelper.getPrimaryImage(product, 'W')).toBeUndefined();
      });

      it('should return undefined when images are not available', () => {
        product.images = [];
        expect(ProductHelper.getPrimaryImage(product, 'L')).toBeUndefined();
      });

      it('should return undefined when images is not defined', () => {
        product = { sku: 'sku' } as Product;
        expect(ProductHelper.getPrimaryImage(product, 'L')).toBeUndefined();
      });
    });

    describe('getImageByImageTypeAndImageView()', () => {
      it('should return image when called with image type as L(Large size) and image view as front', () => {
        expect(ProductHelper.getImageByImageTypeAndImageView(product, 'L', 'front')).toEqual(product.images[2]);
      });

      it('should return undefined when called with invalid image type and invalid image view', () => {
        expect(ProductHelper.getImageByImageTypeAndImageView(product, 'W', 'left')).toBeUndefined();
      });

      it('should return undefined when images are not available', () => {
        product.images = [];
        expect(ProductHelper.getImageByImageTypeAndImageView(product, 'L', 'front')).toBeUndefined();
      });

      it('should return undefined when images is not defined', () => {
        product = { sku: 'sku' } as Product;
        expect(ProductHelper.getImageByImageTypeAndImageView(product, 'L', 'front')).toBeUndefined();
      });
    });

    describe('getImageViewIDsExcludePrimary()', () => {
      it('should return list of image viewIDs  excluding primary image viewID when called with image type as L(Large size)', () => {
        expect(ProductHelper.getImageViewIDsExcludePrimary(product, 'L').length).toBeGreaterThan(0);
      });

      it('should return empty list when called with invalid image type', () => {
        expect(ProductHelper.getImageViewIDsExcludePrimary(product, 'W')).toBeEmpty();
      });

      it('should return empty list when images are not available', () => {
        product.images = [];
        expect(ProductHelper.getImageViewIDsExcludePrimary(product, 'L')).toBeEmpty();
      });

      it('should return empty list when images is not defined', () => {
        product = { sku: 'sku' } as Product;
        expect(ProductHelper.getImageViewIDsExcludePrimary(product, 'L')).toBeEmpty();
      });
    });
  });

  describe('isMasterProduct()', () => {
    function dataProvider() {
      return [
        { product: { type: 'Product' }, expected: false },
        { product: { type: 'VariationProduct' }, expected: false },
        { product: { type: 'VariationProductMaster' }, expected: true },
      ];
    }

    using(dataProvider, dataSlice => {
      it(`should return ${dataSlice.expected} when supplying product '${JSON.stringify(dataSlice.product)}'`, () => {
        expect(ProductHelper.isMasterProduct(dataSlice.product)).toEqual(dataSlice.expected);
      });
    });
  });

  describe('get attributes', () => {
    it('should return attribute when attribute is defined', () => {
      const productData = {
        attributes: [{ name: 'sku', type: 'string', value: '01234567' }],
        description: '',
      } as ProductDataStub;
      expect(AttributeHelper.getAttributeValueByAttributeName<string>(productData.attributes, 'sku')).toBe('01234567');
    });

    it('should return attribute of attribute group when attribute group is defined', () => {
      const attributeGroup = {
        attributes: [{ name: 'sale', type: 'string', value: 'sale' }],
      } as AttributeGroup;
      const product = {
        name: 'FakeProduct',
        sku: 'sku',
        attributeGroups: {
          [AttributeGroupTypes.ProductLabelAttributes]: attributeGroup,
        } as { [id: string]: AttributeGroup },
      } as Product;
      const attributes = ProductHelper.getAttributesOfGroup(product, AttributeGroupTypes.ProductLabelAttributes);
      expect(attributes).not.toBeEmpty();
      expect(attributes[0].name).toBe('sale');
    });
  });

  describe('isFailedLoading()', () => {
    using(
      [
        { product: undefined, expected: false },
        { product: {}, expected: false },
        { product: { failed: false }, expected: false },
        { product: { failed: true }, expected: true },
      ],
      ({ product, expected }) => {
        it(`should return ${expected} when supplying product '${JSON.stringify(product)}'`, () => {
          expect(ProductHelper.isFailedLoading(product)).toEqual(expected);
        });
      }
    );
  });

  describe('isSufficientlyLoaded()', () => {
    using(
      [
        { product: undefined, expected: false },
        { product: { completenessLevel: 0 }, expected: false },
        { product: { completenessLevel: ProductCompletenessLevel.List }, expected: true },
        { product: { completenessLevel: ProductCompletenessLevel.Detail }, expected: true },
      ],
      ({ product, expected }) => {
        it(`should return ${expected} when supplying product '${JSON.stringify(product)}'`, () => {
          expect(ProductHelper.isSufficientlyLoaded(product, ProductCompletenessLevel.List)).toEqual(expected);
        });
      }
    );
  });

  describe('isReadyForDisplay()', () => {
    using(
      [
        { product: undefined, expected: false },
        { product: { completenessLevel: ProductCompletenessLevel.List }, expected: true },
        { product: { completenessLevel: ProductCompletenessLevel.Detail }, expected: true },
        { product: { failed: true }, expected: true },
      ],
      ({ product, expected }) => {
        it(`should return ${expected} when supplying product '${JSON.stringify(product)}'`, () => {
          expect(ProductHelper.isReadyForDisplay(product, ProductCompletenessLevel.List)).toEqual(expected);
        });
      }
    );
  });

  describe('calculatePriceRange()', () => {
    it('should return empty object when no products are supplied', () => {
      expect(ProductHelper.calculatePriceRange(undefined)).toBeEmpty();
      expect(ProductHelper.calculatePriceRange([])).toBeEmpty();
    });

    it('should return the single object if only one element is supplied', () => {
      const product = { salePrice: { value: 1 } } as Product;
      expect(ProductHelper.calculatePriceRange([product])).toEqual(product);
    });

    it('should calculate a range when multiple elements are supplied', () => {
      const product1 = {
        salePrice: { value: 1, currency: 'EUR' },
        listPrice: { value: 2, currency: 'EUR' },
      } as Product;
      const product2 = {
        salePrice: { value: 3, currency: 'EUR' },
        listPrice: { value: 4, currency: 'EUR' },
      } as Product;
      const product3 = {
        salePrice: { value: 5, currency: 'EUR' },
        listPrice: { value: 6, currency: 'EUR' },
      } as Product;
      expect(ProductHelper.calculatePriceRange([product1, product2, product3])).toMatchInlineSnapshot(`
        Object {
          "minListPrice": Object {
            "currency": "EUR",
            "type": undefined,
            "value": 2,
          },
          "minSalePrice": Object {
            "currency": "EUR",
            "type": undefined,
            "value": 1,
          },
          "summedUpListPrice": Object {
            "currency": "EUR",
            "type": undefined,
            "value": 12,
          },
          "summedUpSalePrice": Object {
            "currency": "EUR",
            "type": undefined,
            "value": 9,
          },
        }
      `);
    });
  });

  describe('compare', () => {
    let product: Product;
    let compareProduct1: Product;
    let compareProduct2: Product;

    beforeEach(() => {
      product = { sku: '110', inStock: true, availability: true } as Product;
      product.attributes = [
        {
          name: 'Optical zoom',
          type: 'String',
          value: '20 x',
        },
        {
          name: 'Focal length (35mm film equivalent)',
          type: 'String',
          value: '40 - 800 mm',
        },
        {
          name: 'Image formats supported',
          type: 'String',
          value: '1920 x 1080, 1600 x 1200, 640 x 480',
        },
      ];
      compareProduct1 = {
        ...product,
        sku: '111',
        attributes: [
          {
            name: 'Optical zoom',
            type: 'String',
            value: '20 x',
          },
        ],
      };
      compareProduct2 = {
        ...product,
        sku: '112',
        attributes: [
          {
            name: 'Optical zoom',
            type: 'String',
            value: '20 x',
          },
          {
            name: 'Image formats supported',
            type: 'String',
            value: '1920 x 1080, 1600 x 1200, 640 x 480',
          },
        ],
      };
    });

    describe('getCommonAttributeNames()', () => {
      it('should return empty object when no products are supplied', () => {
        expect(ProductHelper.getCommonAttributeNames(undefined)).toBeUndefined();
        expect(ProductHelper.getCommonAttributeNames([])).toBeUndefined();
      });

      it('should return all attribute names of product if only one element is supplied', () => {
        expect(ProductHelper.getCommonAttributeNames([product])).toEqual(
          new Set(['Optical zoom', 'Focal length (35mm film equivalent)', 'Image formats supported'])
        );
      });

      it('should return the correct set of attributes for different list of products', () => {
        expect(ProductHelper.getCommonAttributeNames([product, compareProduct1])).toMatchInlineSnapshot(`
          Set {
            "Optical zoom",
          }
        `);
        expect(ProductHelper.getCommonAttributeNames([product, compareProduct2])).toMatchInlineSnapshot(`
          Set {
            "Optical zoom",
            "Image formats supported",
          }
        `);
        expect(ProductHelper.getCommonAttributeNames([product, compareProduct1, compareProduct2]))
          .toMatchInlineSnapshot(`
          Set {
            "Optical zoom",
          }
        `);
      });
    });

    describe('getProductWithoutCommonAttributes()', () => {
      it('should return undefined when no product or no compare products are supplied', () => {
        expect(ProductHelper.getProductWithoutCommonAttributes(undefined, undefined)).toBeUndefined();
      });

      it('should return product with correct filtered attributes for different list of compare products', () => {
        expect(ProductHelper.getProductWithoutCommonAttributes(product, [compareProduct1])).toMatchInlineSnapshot(`
          Object {
            "attributes": Array [
              Object {
                "name": "Focal length (35mm film equivalent)",
                "type": "String",
                "value": "40 - 800 mm",
              },
              Object {
                "name": "Image formats supported",
                "type": "String",
                "value": "1920 x 1080, 1600 x 1200, 640 x 480",
              },
            ],
            "availability": true,
            "inStock": true,
            "sku": "110",
          }
        `);
        expect(ProductHelper.getProductWithoutCommonAttributes(product, [compareProduct2])).toMatchInlineSnapshot(`
          Object {
            "attributes": Array [
              Object {
                "name": "Focal length (35mm film equivalent)",
                "type": "String",
                "value": "40 - 800 mm",
              },
            ],
            "availability": true,
            "inStock": true,
            "sku": "110",
          }
        `);
        expect(ProductHelper.getProductWithoutCommonAttributes(product, [compareProduct1, compareProduct2]))
          .toMatchInlineSnapshot(`
          Object {
            "attributes": Array [
              Object {
                "name": "Focal length (35mm film equivalent)",
                "type": "String",
                "value": "40 - 800 mm",
              },
              Object {
                "name": "Image formats supported",
                "type": "String",
                "value": "1920 x 1080, 1600 x 1200, 640 x 480",
              },
            ],
            "availability": true,
            "inStock": true,
            "sku": "110",
          }
        `);
      });
    });
  });
});
