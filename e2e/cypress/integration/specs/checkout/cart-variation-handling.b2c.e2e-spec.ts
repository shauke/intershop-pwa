import { at, waitLoadingEnd } from '../../framework';
import { CartPage } from '../../pages/checkout/cart.page';
import { LineItemDialogPage } from '../../pages/checkout/line-item-dialog.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  productSkuInitial: '201807231-01',
  productSkuTarget: '201807231-02',
  selections: [
    {
      attr: '#Attr_harddrivesize',
      value: '512GB',
    },
  ],
};

describe('Variation Handling in Cart', () => {
  before(() => {
    ProductDetailPage.navigateTo(_.productSkuInitial);
  });

  it('user adds one variation-product to basket and switch the variation', () => {
    at(ProductDetailPage, page => {
      page
        .addProductToCart()
        .its('status')
        .should('equal', 200);
      page.header.miniCart.goToCart();
    });
    at(CartPage, page => {
      page.lineItems.should('have.length', 1);
      page.lineItem(0).openVariationEditDialog();
    });
    at(LineItemDialogPage, dialog => {
      dialog.changeVariationSelection(_.selections);
      waitLoadingEnd();
      dialog.save();
    });
    at(CartPage, page => {
      page.lineItem(0).sku.should('contain', _.productSkuTarget);
    });
  });
});
