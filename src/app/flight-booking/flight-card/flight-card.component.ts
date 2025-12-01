import { Component, EventEmitter, inject, input, Input, model, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Flight, initFlight } from '../../model/flight';
import { CityPipe } from '../../shared/city.pipe';
import { RouterLink } from '@angular/router';

export interface FlightCardFlight extends Omit<Flight, 'delayed'> {
  delayed?: boolean;
}

@Component({
  selector: 'app-flight-card',
  imports: [CommonModule, CityPipe, RouterLink],
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.css'],
})
export class FlightCardComponent {

  item = input.required<FlightCardFlight>();
  selected = model<boolean>(false);
  
  ngOnInit() {}

  select() {
    this.selected.set(true);
  }

  deselect() {
    this.selected.set(false);
  }
}
