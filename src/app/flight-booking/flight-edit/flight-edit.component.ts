import {
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  numberAttribute,
} from '@angular/core';

import { FlightDetailStore } from '../flight-detail.store';
import { Control, form, required, submit, apply, validateStandardSchema, StandardSchemaValidationError, minLength, ValidationError } from '@angular/forms/signals';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

import { debounceSignal } from '../../shared/debounce-signal';
import { FlightSchema } from '../../model/flight';
import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-flight-edit',
  imports: [
    Control,
    JsonPipe,
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.css'],
})
export class FlightEditComponent {
  private store = inject(FlightDetailStore);

  id = input.required({
    transform: numberAttribute,
  });

  isPending = debounceSignal(this.store.saveFlightIsPending, 300);
  error = this.store.saveFlightError;

  flight = linkedSignal(() => this.store.flightValue());

  flightForm = form(this.flight, (schema) => {
    validateStandardSchema(schema, FlightSchema);
  });

  errorMessages = computed(() => toErrorMessages(this.flightForm().errorSummary()));

  constructor() {
    this.store.updateFilter(this.id);
  }

  save(): void {

    submit(this.flightForm, async (form) => {
      const result = await this.store.saveFlight(form().value());

      if (result.status === 'error') {
        return {
          kind: 'processingError',
          error: result.error,
          message: toProcessingErrorMessage(result.error)
        };
      }
      return null;
    });
  }
}

function toProcessingErrorMessage(error: unknown)  {
  if (error instanceof HttpErrorResponse) {
    const response = error;
    return response.error;
  }
  return String(error);
}

function toErrorMessages(errors: ValidationError[]) {
  return errors.map(error => {
    if (error instanceof StandardSchemaValidationError) {
      const path = error.issue.path;
      return toPathPrefix(path) + error.issue.message;
    }
    else {
      return error.message;
    }
  });
}

function toPathPrefix(path: readonly unknown[] | undefined) {
  if (!path || path.length === 0) {
    return '';
  }
  return path[0] + ': ';
}

