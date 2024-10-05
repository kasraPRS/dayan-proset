import { Directive, Input, OnChanges, SimpleChanges } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, Validators } from "@angular/forms";
import { usernameValidatorFn } from "../username.validatorFn";

@Directive({
  selector: "[prosetNgUsernameValidator]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: UsernameValidatorDirective,
      multi: true,
    },
  ],
})
export class UsernameValidatorDirective implements Validators, OnChanges {
  @Input() prosetNgUsernameValidator: AbstractControl | null;

  validate(control: AbstractControl) {
    return usernameValidatorFn(control);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.prosetNgUsernameValidator != null) {
      this.prosetNgUsernameValidator.updateValueAndValidity();
    }
  }
}
