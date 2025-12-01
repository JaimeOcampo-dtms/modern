import { Component, inject } from '@angular/core';
import { NextFlightsService } from './next-flights.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-next-flights',
  templateUrl: './next-flights.component.html',
  styleUrls: ['./next-flights.component.css'],
  standalone: false,
})
export class NextFlightsComponent {
  router = inject(Router);
  nextFlightsService = inject(NextFlightsService);
  flights$ = this.nextFlightsService.load();

  checkIn(flightId: number): void {
    this.router.navigate(['/checkin', flightId]);
  }
}
