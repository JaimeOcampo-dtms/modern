import {
  Component,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { Flight } from 'src/app/model/flight';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FlightCardComponent],
})
export class FlightSearchComponent {

  // TODO: Get state from store

  from = signal('Graz');
  to = signal('Hamburg');

  flights = signal<Flight[]>([]);
  basket = signal<Record<number, boolean>>({});

  search(): void {
    // TODO
  }

  updateBasket(flightId: number, selected: boolean): void {
    // TODO
  }
}
