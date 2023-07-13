import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { SearchComponent } from './pages/search/search.component';
import { BookComponent } from './pages/book/book.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { AddonsComponent } from './pages/book/addons/addons.component';
import { CartBoxComponent } from './shared/components/cart-box/cart-box.component';
import { ConfirmationComponent } from './pages/book/confirmation/confirmation.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { PersonalDetailsComponent } from './pages/book/personal-details/personal-details.component';
import { RecommendationsComponent } from './shared/components/recommendations/recommendations.component';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DealsBar } from './pages/search/deals-bar/deals-bar.component';
import { PackageComponent } from './shared/components/package/package.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DealsComponent } from './pages/deals/deals.component';
import { SearchResultComponent } from './pages/search/search-result/search-result.component';
import { BookingNotificationComponent } from './shared/components/booking-notification/booking-notification.component';
import { StepperComponent } from './pages/book/stepper/stepper.component';
import { OngoingBookingsComponent } from './pages/book/ongoing-bookings/ongoing-bookings.component';
import { NoBookingComponent } from './pages/book/no-booking/no-booking.component';
import { RoomComponent } from './shared/components/room/room.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxPaginationModule } from "ngx-pagination";
import { ImagePopupComponent } from './shared/components/image-popup/image-popup.component';
import { DealDetailsComponent } from './pages/deals/deal-details/deal-details.component';


@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    SearchResultComponent,
    BookComponent,
    PersonalDetailsComponent,
    ConfirmationComponent,
    AddonsComponent,
    StepperComponent,
    OngoingBookingsComponent,
    NoBookingComponent,
    HeaderComponent,
    FooterComponent,
    RecommendationsComponent,
    CartBoxComponent,
    DealsBar,
    PackageComponent,
    RoomComponent,
    DealsComponent,
    BookingNotificationComponent,
    ImagePopupComponent,
    DealDetailsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatCardModule,
    MatSelectModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    MatSnackBarModule,
    NgxPaginationModule

  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
