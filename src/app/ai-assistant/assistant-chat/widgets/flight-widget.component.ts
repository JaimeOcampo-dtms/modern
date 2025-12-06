import { Component, computed, effect, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlightBookingStore } from 'src/app/flight-booking/flight-booking.store';
import { FlightCardComponent } from 'src/app/flight-booking/flight-card/flight-card.component';
import { Flight } from 'src/app/model/flight';

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
export class FlightWidgetComponent {
  router = inject(Router);
  store = inject(FlightBookingStore);

  flight = input.required<Flight>();
  status = input<'booked' | 'other'>('other');

  isBooked = computed(() => this.status() === 'booked');
  isSelected = computed(() => this.store.basket()[this.flight().id]);

  checkIn(): void {
    this.router.navigate(['/checkin', this.flight().id]);
  }

  select(selected: boolean): void {
    this.store.updateBasket(this.flight().id, selected);
  }
}
