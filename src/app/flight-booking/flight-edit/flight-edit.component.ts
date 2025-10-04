import {
  Component,
  inject,
  input,
  linkedSignal,
  numberAttribute,
  WritableSignal,
} from '@angular/core';

import { FlightDetailStore } from '../flight-detail.store';
import {
  form,
  required,
  schema,
  apply,
  Control,
} from '@angular/forms/signals';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Flight, flightSchema } from '../../model/flight';
import { toLocalDateTimeString } from '../../utils/date';
import { ValidationErrorsComponent } from 'src/app/shared/validation-errors/validation-errors.component';
import { FieldDef, toSchema } from 'src/app/shared/dynamic-form/model';
import { DynamicFormComponent } from "src/app/shared/dynamic-form/dynamic-form.component";

export const flightFormSchema = schema<Flight>((path) => {
  apply(path, flightSchema);
  required(path.id);
});

@Component({
  selector: 'app-flight-edit',
  imports: [
    MatDatepickerModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ValidationErrorsComponent,
    DynamicFormComponent
],
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.css'],
})
export class FlightEditComponent {
  private store = inject(FlightDetailStore);

  flight = linkedSignal(() => normalize(this.store.flightValue()));
  error = this.store.flightError;

  id = input.required({
    transform: numberAttribute,
  });

  meta: FieldDef[] = [
    { name: 'id', label: 'Id', required: true },
    {
      name: 'from',
      label: 'From',
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    { name: 'to', label: 'To', required: true, minLength: 3, maxLength: 20 },
    { name: 'date', label: 'Date', required: true, type: 'datetime-local' },
    { name: 'delayed', label: 'Delayed', type: 'checkbox' },
  ];

  // Let's assume we don't know the structure of the entity
  // upfront but we have fitting meta data
  entity = this.flight as WritableSignal<unknown>;
  dynamicForm = form(this.entity, toSchema(this.meta));

  constructor() {
    this.store.updateFilter(this.id);
  }

  save(): void {
    console.log('save', this.dynamicForm().value());
  }
}

function normalize(flight: Flight): Flight {
  return {
    ...flight,
    date: toLocalDateTimeString(flight.date),
  };
}
