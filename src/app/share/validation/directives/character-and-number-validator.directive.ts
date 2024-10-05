import { Directive, Input, OnChanges, SimpleChanges } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, Validators } from "@angular/forms";
import { characterAndNumberValidatorFn } from "../characterAndNumberValidatorFn";

@Directive({
  selector: "[prosetNgCharacterAndNumberValidator]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CharacterAndNumberValidatorDirective,
      multi: true,
    },
  ],
})
export class CharacterAndNumberValidatorDirective
  implements Validators, OnChanges
{
  @Input() prosetNgCharacterAndNumberValidator: AbstractControl | null;

  validate(control: AbstractControl) {
    return characterAndNumberValidatorFn(control);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.prosetNgCharacterAndNumberValidator != null) {
      this.prosetNgCharacterAndNumberValidator.updateValueAndValidity();
    }
  }
}
