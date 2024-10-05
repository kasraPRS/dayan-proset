import { Directive, Input, OnChanges, SimpleChanges } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, Validators } from "@angular/forms";
import { nationalCodeValidatorFn } from "../nationalCodeValidatorFn";

@Directive({
  selector: "[prosetNgNationalCodeValidator]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NationalCodeValidatorDirective,
      multi: true,
    },
  ],
  standalone: true,
})
export class NationalCodeValidatorDirective implements Validators, OnChanges {
  @Input() prosetNgNationalCodeValidator: AbstractControl | null;

  validate(control: AbstractControl) {
    return nationalCodeValidatorFn(control);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.prosetNgNationalCodeValidator != null) {
      this.prosetNgNationalCodeValidator.updateValueAndValidity();
    }
  }
}
