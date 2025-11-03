import { Component, input } from '@angular/core';
import { Field, FieldTree } from '@angular/forms/signals';
import { Aircraft } from 'src/app/model/aircraft';
import { ValidationErrorsComponent } from 'src/app/shared/validation-errors/validation-errors.component';

@Component({
  selector: 'app-aircraft',
  imports: [Field, ValidationErrorsComponent],
  templateUrl: './aircraft.component.html',
  styleUrl: './aircraft.component.css',
})
export class AircraftComponent {
  aircraft = input.required<FieldTree<Aircraft>>();
}
