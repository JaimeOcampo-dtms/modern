import { Component, computed, input } from '@angular/core';
import { Field, REQUIRED, MIN_LENGTH, MAX_LENGTH } from '@angular/forms/signals';
import { CITY, CITY2 } from '../properties';

@Component({
  selector: 'app-field-meta-data',
  imports: [],
  templateUrl: './field-meta-data.component.html',
  styleUrl: './field-meta-data.component.css',
})
export class FieldMetaDataComponent {
  field = input.required<Field<unknown>>();

  fieldState = computed(() => this.field()());

  isRequired = computed(() => this.fieldState().property(REQUIRED)());
  minLength = computed(() => this.fieldState().property(MIN_LENGTH)() ?? 0);
  maxLength = computed(() => this.fieldState().property(MAX_LENGTH)() ?? 30);
  length = computed(() => `(${this.minLength()}..${this.maxLength()})`);

  city = computed(() => this.fieldState().property(CITY));
  city2 = computed(() => this.fieldState().property(CITY2)());
}
