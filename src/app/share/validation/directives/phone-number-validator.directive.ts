import { Directive, OnChanges, SimpleChanges } from "@angular/core";
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  Validators,
} from "@angular/forms";
import { phoneNumberValidator } from "../phoneNumber.validator";

@Directive({
  selector: "[prosetNgPhoneNumberValidator][formControlName]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PhoneNumberValidatorDirective,
      multi: true,
    },
  ],
})
export class PhoneNumberValidatorDirective implements Validator {
  static instance: PhoneNumberValidatorDirective;

  constructor() {
    PhoneNumberValidatorDirective.instance = this;
  }

  static getInstance(): PhoneNumberValidatorDirective {
    if (!PhoneNumberValidatorDirective.instance) {
      PhoneNumberValidatorDirective.instance =
        new PhoneNumberValidatorDirective();
    }
    return PhoneNumberValidatorDirective.instance;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const validationError = phoneNumberValidator(control);
    return validationError ? { invalidPhoneNumber: true } : null;
  }
}
