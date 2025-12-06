import { Component, computed, effect, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlightBookingStore } from 'src/app/flight-booking/flight-booking.store';
import { FlightCardComponent } from 'src/app/flight-booking/flight-card/flight-card.component';
import { Flight, initFlight } from 'src/app/model/flight';
import { FlightInfo } from './flight-info';

@Component({
  selector: 'app-flight-widget',
  imports: [FlightCardComponent],
  template: `
    <div class="flight">
      <app-flight-card [item]="flight()" [selected]="isSelected()">
        <div>
          @if(isBooked()) {
          <button class="btn btn-default" (click)="checkIn()">Check in</button>
          } @else if (isSelected()){
          <button class="btn btn-default" (click)="select(false)">
            Remove
          </button>
          } @else {
          <button class="btn btn-default" (click)="select(true)">Select</button>
          }
        </div>
      </app-flight-card>
    </div>
  `,
  styles: `
    .flight {
      margin: 20px 0;
    }
  `,
})
export class FlightWidgetComponent implements OnInit {
  ngOnInit(): void {
    console.log('flightInfo', this.flightInfo());
  }
  router = inject(Router);
  store = inject(FlightBookingStore);

  flightInfo = input.required<FlightInfo>();

  isBooked = computed(() => this.flightInfo().status === 'booked');
  isDelayed = computed(() => this.flightInfo().delay > 0);

  isSelected = computed(() => this.store.basket()[this.flight().id]);

  flight = computed(
    () =>
      ({
        ...initFlight,
        id: this.flightInfo().id,
        from: this.flightInfo().from,
        to: this.flightInfo().to,
        date: this.flightInfo().date,
        delayed: this.isDelayed(),
      } as Flight)
  );

  checkIn(): void {
    this.router.navigate(['/checkin', this.flight().id]);
  }

  select(selected: boolean): void {
    this.store.updateBasket(this.flight().id, selected);
  }
}
