import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CanActivateRouteGuard } from './_routeguards/can-activate.routeguard'

const routes: Routes = [
  { path: '',           		loadChildren: './login/login.module#LoginPageModule' }
  ,{ path: 'home',        		loadChildren: './home/home.module#HomePageModule',    			canActivate: [CanActivateRouteGuard] }
  ,{ path: 'profile', 			loadChildren: './profile/profile.module#ProfilePageModule', 	canActivate: [CanActivateRouteGuard] }
  ,{ path: 'search', 			loadChildren: './search/search.module#SearchPageModule', 	canActivate: [CanActivateRouteGuard] }
  ,{ path: 'requests/incoming', loadChildren: './requests/requests.module#RequestPageModule', 	canActivate: [CanActivateRouteGuard] }
  ,{ path: 'requests/outgoing', loadChildren: './requests/requests.module#RequestPageModule', 	canActivate: [CanActivateRouteGuard] }
  ,{ path: 'offer', 			loadChildren: './../app/offers/offer.module#OfferPageModule', 	canActivate: [CanActivateRouteGuard] }
  //,{ path: 'keywords', 			loadChildren: './keywords/keywords.module#KeywordsPageModule', 	canActivate: [CanActivateRouteGuard] }
  //,{ path: 'recommendations', 			loadChildren: './recommendations/recommendations.module#RecommendationPageModule', 	canActivate: [CanActivateRouteGuard] }
  //,{ path: 'notifications', 			loadChildren: './notifications/notifications.module#NotificationPageModule', 	canActivate: [CanActivateRouteGuard] }
  //,{ path: 'about-easyah', 			loadChildren: './about-easyah/about-easyah.module#AboutEasyahPageModule', 	canActivate: [CanActivateRouteGuard] }  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
