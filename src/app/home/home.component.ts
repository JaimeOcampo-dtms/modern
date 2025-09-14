import { Component, inject } from '@angular/core';
import { FlightService } from '../flight-booking/flight-search/flight.service';
import { mergeOp } from '@angular-architects/ngrx-toolkit';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  private flightService = inject(FlightService);

  private saveFlight = this.flightService.createSaveMutation({
    onSuccess: (result, params) => {
      console.log('Flight saved', { result, params });
    },
    onError: (error, params) => {
      console.error('Error saving flight', { error, params });
    },
    operator: mergeOp,
  });

  private saveFlightIsPending = this.saveFlight.isPending;
  private saveFlightError = this.saveFlight.error;
  private saveFlightValue = this.saveFlight.value;
  private saveFlightParams = this.saveFlight.isSuccess;

  save(): void {
    this.saveFlight({
      id: 0,
      from: 'Graz',
      to: 'Hamburg',
      date: new Date(),
      delayed: false,
    });
  }
}
