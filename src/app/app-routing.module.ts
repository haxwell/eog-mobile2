import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CanActivateRouteGuard } from './_routeguards/can-activate.routeguard'

const routes: Routes = [
  { path: '',           		            loadChildren: './../app/login/login.module#LoginPageModule' }
  ,{ path: 'home',        		          loadChildren: './../app/home/home.module#HomePageModule',    			  canActivate: [CanActivateRouteGuard] }
  ,{ path: 'profile/:userId', 			    loadChildren: './../app/profile/profile.module#ProfilePageModule', 	canActivate: [CanActivateRouteGuard] }
  ,{ path: 'offers', 			              loadChildren: './../app/offers/offer.module#OfferPageModule', 	    canActivate: [CanActivateRouteGuard] }
  ,{ path: 'search/:searchString',      loadChildren: './../app/search/search.module#SearchPageModule',     canActivate: [CanActivateRouteGuard] }
  ,{ path: 'requests/incoming',         loadChildren: './../app/requests/incoming/requests-incoming.module#RequestsIncomingPageModule',   canActivate: [CanActivateRouteGuard] }
  ,{ path: 'requests/outgoing',         loadChildren: './../app/requests/outgoing/requests-outgoing.module#RequestsOutgoingPageModule',   canActivate: [CanActivateRouteGuard] }
  ,{ path: 'keywords', 			            loadChildren: './../app/keywords/keywords.module#KeywordsPageModule',                canActivate: [CanActivateRouteGuard] }
  ,{ path: 'notifications', 			      loadChildren: './../app/notifications/notifications.module#NotificationsPageModule', 	         canActivate: [CanActivateRouteGuard] }
  ,{ path: 'recommendations',           loadChildren: './../app/recommendations/recommendations.module#RecommendationsPageModule',   canActivate: [CanActivateRouteGuard] }
  ,{ path: 'about-easyah', 	  		      loadChildren: './about-easyah/about-easyah.module#AboutEasyahPageModule', 	             canActivate: [CanActivateRouteGuard] }  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: false, preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
