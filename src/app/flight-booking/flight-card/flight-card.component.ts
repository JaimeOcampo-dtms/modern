import { Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight } from '../../model/flight';
import { CityPipe } from '../../shared/city.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-flight-card',
  imports: [CommonModule, CityPipe, RouterLink],
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.css'],
})
export class FlightCardComponent {

  item = input.required<Flight>();
  selected = model<boolean>(false);
  
  select() {
    this.selected.set(true);
  }

  deselect() {
    this.selected.set(false);
  }
}
