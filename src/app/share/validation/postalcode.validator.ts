import { AbstractControl } from "@angular/forms";

export function postalCodeValidator(control: AbstractControl) {
  if (control.value) {
    const postalCode = /\b(?!(\d)\1{3})[13-9]{4}[1346-9][013-9]{5}\b/gm;
    if (!postalCode.test(control.value)) {
      return { invalidPostalCode: true };
    }
  }
  return null;
}
