import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

export type ToForm<T> = {
  [P in keyof T]?: AbstractControl<T[P] | undefined | null>;
};
