import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookComponent } from './pages/book/book.component';
import { OngoingBookingsComponent } from './pages/book/ongoing-bookings/ongoing-bookings.component';
import { DealsComponent } from './pages/deals/deals.component';
import { SearchComponent } from './pages/search/search.component';

const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },

  { path: 'search', component: SearchComponent },
  { path: 'search/:hotelId', component: SearchComponent },

  { path: 'search_page', component: SearchComponent },
  { path: 'search_page/:hotelId', component: SearchComponent },

  { path: 'book', component: BookComponent },
  { path: 'book/:hotelId', component: BookComponent },

  { path: 'deals', component: DealsComponent },
  { path: 'deals/:hotelId', component: DealsComponent },

  { path: 'cart', component: OngoingBookingsComponent },
  { path: 'cart/:hotelId', component: OngoingBookingsComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
