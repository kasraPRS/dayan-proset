import { AbstractControl } from "@angular/forms";

export function numberValidatorFn(control: AbstractControl) {
  if (control.value) {
    const number = /^[0-9]*$/;
    if (!number.test(control.value) || parseInt(control.value) === 0)
      return { invalidNumber: true };
  }
  return null;
}
