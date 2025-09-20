import { Component, computed, input } from '@angular/core';
import { Control, Field, REQUIRED, MIN_LENGTH } from '@angular/forms/signals';
import { Flight } from 'src/app/model/flight';
import { DelayStepperComponent } from 'src/app/shared/delay-stepper/delay-stepper.component';
import { ValidationErrorsComponent } from 'src/app/shared/validation-errors/validation-errors.component';

@Component({
  selector: 'app-flight',
  imports: [Control, ValidationErrorsComponent, DelayStepperComponent],
  templateUrl: './flight.component.html',
  styleUrl: './flight.component.css'
})
export class FlightComponent {
  flight = input.required<Field<Flight>>();
  isFromRequired = computed(() => this.flight().from().property(REQUIRED)());
}
