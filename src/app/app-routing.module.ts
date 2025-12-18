import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookComponent } from './pages/book/book.component';
import { OngoingBookingsComponent } from './pages/book/ongoing-bookings/ongoing-bookings.component';
import { DealsComponent } from './pages/deals/deals.component';
import { SearchComponent } from './pages/search/search.component';

const routes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'search/:bookingEngineId', component: SearchComponent },

  { path: 'search_page', component: SearchComponent },
  { path: 'search_page/:bookingEngineId', component: SearchComponent },

  { path: 'book', component: BookComponent },
  { path: 'book/:bookingEngineId', component: BookComponent },

  { path: 'deals', component: DealsComponent },
  { path: 'deals/:bookingEngineId', component: DealsComponent },

  { path: 'cart', component: OngoingBookingsComponent },
  { path: 'cart/:bookingEngineId', component: OngoingBookingsComponent },

  { 
    path: '', 
    redirectTo: 'search', 
    pathMatch: 'full'
  },

  { path: '**', redirectTo: 'search' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { 
    scrollPositionRestoration: 'enabled', 
    initialNavigation: 'enabled',
    paramsInheritanceStrategy: 'always'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
