import { AbstractControl } from "@angular/forms";

export function usernameValidatorFn(control: AbstractControl) {
  if (control.value) {
    const limitWord = /admin/;
    if (limitWord.test(control.value.toLowerCase()))
      return { invalidUsername: true };
  }
  return null;
}
