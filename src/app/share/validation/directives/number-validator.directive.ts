import { Directive, Input, OnChanges, SimpleChanges } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, Validators } from "@angular/forms";
import { numberValidatorFn } from "../numberValidatorFn";

@Directive({
  selector: "[prosetNgNumberValidator]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NumberValidatorDirective,
      multi: true,
    },
  ],
})
export class NumberValidatorDirective implements Validators, OnChanges {
  @Input() prosetNgNumberValidator: AbstractControl | null;

  validate(control: AbstractControl) {
    return numberValidatorFn(control);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.prosetNgNumberValidator != null) {
      this.prosetNgNumberValidator.updateValueAndValidity();
    }
  }
}
