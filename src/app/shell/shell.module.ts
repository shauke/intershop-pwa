import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule, NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DeferLoadModule } from '@trademe/ng-defer-load';
import { ReactiveComponentLoaderModule } from '@wishtack/reactive-component-loader';

import { ClickOutsideDirective } from 'ish-core/directives/click-outside.directive';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { IconModule } from 'ish-core/icon.module';
import { PipesModule } from 'ish-core/pipes.module';

import { QuotingExportsModule } from '../extensions/quoting/exports/quoting-exports.module';

import { FooterComponent } from './footer/components/footer/footer.component';
import { HeaderCheckoutComponent } from './header/components/header-checkout/header-checkout.component';
import { HeaderDefaultComponent } from './header/components/header-default/header-default.component';
import { HeaderSimpleComponent } from './header/components/header-simple/header-simple.component';
import { LazyLoginModalComponent } from './header/components/lazy-login-modal/lazy-login-modal.component';
import { ProductImageComponent } from './header/components/product-image/product-image.component';
import { SubCategoryNavigationComponent } from './header/components/sub-category-navigation/sub-category-navigation.component';
import { UserInformationMobileComponent } from './header/components/user-information-mobile/user-information-mobile.component';
import { HeaderNavigationContainerComponent } from './header/containers/header-navigation/header-navigation.container';
import { HeaderContainerComponent } from './header/containers/header/header.container';
import { LanguageSwitchContainerComponent } from './header/containers/language-switch/language-switch.container';
import { LoginStatusContainerComponent } from './header/containers/login-status/login-status.container';
import { MiniBasketContainerComponent } from './header/containers/mini-basket/mini-basket.container';
import { ProductCompareStatusContainerComponent } from './header/containers/product-compare-status/product-compare-status.container';
import { SearchBoxContainerComponent } from './header/containers/search-box/search-box.container';

const exportedComponents = [
  FooterComponent,
  HeaderContainerComponent,
  ProductImageComponent,
  SearchBoxContainerComponent,
  ServerHtmlDirective,
];

@NgModule({
  imports: [
    CommonModule,
    DeferLoadModule,
    FeatureToggleModule,
    IconModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbModalModule,
    PipesModule.forRoot(),
    QuotingExportsModule,
    ReactiveComponentLoaderModule.withModule({
      moduleId: 'ish-shared',
      loadChildren: '../shared/shared.module#SharedModule',
    }),
    RouterModule,
    TranslateModule,
  ],
  declarations: [
    ...exportedComponents,
    ClickOutsideDirective,
    HeaderCheckoutComponent,
    HeaderDefaultComponent,
    HeaderNavigationContainerComponent,
    HeaderSimpleComponent,
    LanguageSwitchContainerComponent,
    LazyLoginModalComponent,
    LoginStatusContainerComponent,
    MiniBasketContainerComponent,
    ProductCompareStatusContainerComponent,
    SubCategoryNavigationComponent,
    UserInformationMobileComponent,
  ],
  exports: [...exportedComponents],
  entryComponents: [LazyLoginModalComponent],
})
export class ShellModule {}
