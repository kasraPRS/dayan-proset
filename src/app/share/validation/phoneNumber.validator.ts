import { AbstractControl } from "@angular/forms";

export function phoneNumberValidator(control: AbstractControl) {
  if (control.value) {
    const phoneNumber = /^09\d{9}$/;
    if (!phoneNumber.test(control.value)) return { invalidPhoneNumber: true };
  }
  return null;
}
