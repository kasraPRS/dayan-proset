import { Directive, Input, OnChanges, SimpleChanges } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, Validators } from "@angular/forms";
import { postalCodeValidator } from "../postalcode.validator";

@Directive({
  selector: "[prosetNgPostalCodeValidator]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PostalCodeValidatorDirective,
      multi: true,
    },
  ],
})
export class PostalCodeValidatorDirective implements Validators, OnChanges {
  @Input() prosetNgPostalCodeValidator: AbstractControl | null;

  validate(control: AbstractControl) {
    return postalCodeValidator(control);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.prosetNgPostalCodeValidator != null) {
      this.prosetNgPostalCodeValidator.updateValueAndValidity();
    }
  }
}
