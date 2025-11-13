import { Component, input } from '@angular/core';
import { Field, FieldTree } from '@angular/forms/signals';
import { Flight } from 'src/app/model/flight';
import { DelayStepperComponent } from 'src/app/shared/delay-stepper/delay-stepper.component';
import { FieldMetaDataComponent } from 'src/app/shared/field-meta-data/field-meta-data.component';
import { ValidationErrorsComponent } from 'src/app/shared/validation-errors/validation-errors.component';

@Component({
  selector: 'app-flight',
  imports: [
    Field,
    ValidationErrorsComponent,
    FieldMetaDataComponent,
  ],
  templateUrl: './flight.component.html',
  styleUrl: './flight.component.css',
})
export class FlightComponent {
  flight = input.required<FieldTree<Flight>>();
}
