import { maxLength, minLength, required, Schema, schema } from "@angular/forms/signals";

export interface FieldDef {
  name: string;
  label: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  type?: string;
}

export function toSchema(meta: FieldDef[]): Schema<unknown> {
  return schema<unknown>((path) => {
    for (const fieldDef of meta) {
      const prop = fieldDef.name;
      const fieldPath = (path as any)[prop];

      if (!fieldPath) {
        continue;
      }
      if (fieldDef.required) {
        required(fieldPath);
      }
      if (typeof fieldDef.minLength !== 'undefined') {
        minLength(fieldPath, fieldDef.minLength);
      }
      if (typeof fieldDef.maxLength !== 'undefined') {
        maxLength(fieldPath, fieldDef.maxLength);
      }
    }
  });
}