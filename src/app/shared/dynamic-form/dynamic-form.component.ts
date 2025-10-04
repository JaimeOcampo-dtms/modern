import { Component, input, Signal } from '@angular/core';
import { FieldDef } from './model';
import { Control, FieldState } from '@angular/forms/signals';
import { ValidationErrorsComponent } from '../validation-errors/validation-errors.component';

@Component({
  selector: 'app-dynamic-form',
  imports: [Control, ValidationErrorsComponent],
  template: `
    @for(fieldDef of metaInfo(); track fieldDef.name) { @let field =
    $any(dynamicForm())[fieldDef.name];

    <div class="form-group">
      <label>
        {{ fieldDef.label }}
        <input
          [type]="fieldDef.type"
          [control]="field"
          [class.form-control]="fieldDef.type !== 'checkbox'"
        />
      </label>
      <app-validation-errors
        [errors]="field().errors()"
      ></app-validation-errors>
    </div>
    }
  `,
})
export class DynamicFormComponent {
  metaInfo = input.required<FieldDef[]>();
  dynamicForm = input.required<() => FieldState<unknown>>();
}
