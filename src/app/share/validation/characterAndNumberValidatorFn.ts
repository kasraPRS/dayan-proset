import { AbstractControl } from "@angular/forms";

export function characterAndNumberValidatorFn(control: AbstractControl) {
  const charecterAndNumber = /^[a-zA-Z0-9]*$/;
  if (control.value && !charecterAndNumber.test(control.value)) {
    return { invalidCharacterAndNumber: true };
  }
  return null;
}
