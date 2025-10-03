import { Component, input } from '@angular/core';
import { Control, Field } from '@angular/forms/signals';
import { Flight } from 'src/app/model/flight';
import { DelayStepperComponent } from 'src/app/shared/delay-stepper/delay-stepper.component';
import { ValidationErrorsComponent } from 'src/app/shared/validation-errors/validation-errors.component';
import { FieldMetaDataComponent } from "src/app/shared/field-meta-data/field-meta-data.component";

@Component({
  selector: 'app-flight',
  imports: [
    Control,
    ValidationErrorsComponent,
    DelayStepperComponent,
    FieldMetaDataComponent
],
  templateUrl: './flight.component.html',
  styleUrl: './flight.component.css',
})
export class FlightComponent {
  flight = input.required<Field<Flight>>();
}
