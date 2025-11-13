import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Flight, initFlight } from '../../model/flight';
import { CityPipe } from '../../shared/city.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-flight-card',
  imports: [CommonModule, CityPipe, RouterLink],
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.css'],
})
export class FlightCardComponent {

  @Input({ required: true }) item!: Flight;
  @Input({ required: true }) selected!: boolean;
  @Output() selectedChange = new EventEmitter<boolean>();

  ngOnInit() {}

  select() {
    this.selected = true;
    this.selectedChange.emit(this.selected);
  }

  deselect() {
    this.selected = false;
    this.selectedChange.emit(this.selected);
  }
}
