import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CanActivateRouteGuard } from '../../app/_routeguards/can-activate.routeguard'

import { OfferPage } from './_pages/offer.page';
import { OfferListPage } from './_pages/offer-list/offer-list.page'
import { OfferEditPage } from './_pages/offer-edit.page';
import { OfferRequestPage } from './_pages/offer-request.page';

const routes: Routes = [
  { path: '', 			component: OfferListPage,			canActivate: [CanActivateRouteGuard] }
  ,{ path: ':offerId', 			component: OfferPage,			canActivate: [CanActivateRouteGuard] }
  ,{ path: 'new', 				component: OfferEditPage,		canActivate: [CanActivateRouteGuard] }
  ,{ path: ':offerId/edit', 		component: OfferEditPage,		canActivate: [CanActivateRouteGuard] }
  ,{ path: ':offerId/request', 	component: OfferRequestPage, 	canActivate: [CanActivateRouteGuard] }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class OfferRoutingModule {}
