import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { s } from '@hashbrownai/core';
import { FlightCardComponent } from 'src/app/flight-booking/flight-card/flight-card.component';
import { Flight, initFlight } from 'src/app/model/flight';

export interface FlightInfo extends Omit<Flight, 'delayed'> {
  status: 'booked' | 'other',
  delayInfo: 'delayed' | 'in time'
}

export const FlightInfoSchema = s.object('Flight to be displayed', {
  id: s.number('the flight id'),
  from: s.string('Departure city. No code but the city name'),
  to: s.string('Arrival city. No code but the city name'),
  date: s.string('Departure date in ISO format'),
  delay: s.number('If delayed, this represents the delay in minutes'),
  status: s.enumeration('Whether the flight is booked or not', ['booked', 'other']),
  delayInfo: s.enumeration('Whether the flight is delayed or in time', ['delayed', 'in time']),
});

@Component({
  selector: 'app-flight-widget',
  imports: [FlightCardComponent],
  template: `
    <div class="flight">
      <app-flight-card [item]="flight()">
        <div>
          @if(isBooked()) {
            <button class="btn btn-default" (click)="checkIn()">Check in</button>
          }
        </div>
      </app-flight-card>
    </div>
  `,
  styles: `
    .flight {
      margin: 20px 0;
    }
  `
})
export class FlightWidgetComponent {

  router = inject(Router);

  flightInfo = input.required<FlightInfo>();

  isBooked = computed(() => this.flightInfo().status === 'booked');
  isDelayed = computed(() => this.flightInfo().delayInfo === 'delayed')

  flight = computed(() => ({
    ...initFlight,
    id: this.flightInfo().id,
    from: this.flightInfo().from,
    to: this.flightInfo().to,
    date: this.flightInfo().date,
    delayed: this.isDelayed(),
  }) as Flight);

  checkIn(): void {
    this.router.navigate(['/checkin', this.flight().id]);
  }

}
