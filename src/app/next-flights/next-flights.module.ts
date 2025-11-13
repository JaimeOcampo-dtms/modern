import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NextFlightsComponent } from './next-flights.component';
import { CheckinComponent } from './checkin/checkin.component';
import { NextFlightsService } from './next-flights.service';
import { RouterModule } from '@angular/router';
import { NEXT_FLIGHTS_ROUTES } from './next-flights.routes';
import { FlightCardComponent } from '../flight-booking/flight-card/flight-card.component';
import { A11yModule } from "@angular/cdk/a11y";

@NgModule({
  declarations: [NextFlightsComponent, CheckinComponent],
  imports: [CommonModule, FlightCardComponent, RouterModule.forChild(NEXT_FLIGHTS_ROUTES), A11yModule],
  providers: [NextFlightsService],
  exports: [NextFlightsComponent],
})
export class NextFlightsModule {}
