import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CanActivateRouteGuard } from '../../app/_routeguards/can-activate.routeguard'

import { OfferPage } from './offer.page';
import { OfferEditPage } from './offer-edit.page';
import { OfferRequestPage } from './_pages/offer-request.page';

const routes: Routes = [
  { path: 'offer/:offerId', 			component: OfferPage,			canActivate: [CanActivateRouteGuard] }
  ,{ path: 'offer/new', 				component: OfferEditPage,		canActivate: [CanActivateRouteGuard] }
  ,{ path: 'offer/:offerId/edit', 		component: OfferEditPage,		canActivate: [CanActivateRouteGuard] }
  ,{ path: 'offer/:offerId/request', 	component: OfferRequestPage, 	canActivate: [CanActivateRouteGuard] }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class OfferRoutingModule {}
