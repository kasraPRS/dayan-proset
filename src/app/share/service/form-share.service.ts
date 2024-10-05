import { Injectable } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import * as _ from "lodash";

@Injectable({
  providedIn: "root",
})
export class FormSharedService {
  // resetFormField(form: FormGroup, keysList: FormField[]) {
  //   _.forEach(keysList, (control) => {
  //     form.controls[control.key]?.setValue(null);
  //     if (control.isDisable) form.get(control.key)?.disable();
  //     if (control.isclearValidator) this.clearValidator(control.key, form);
  //   });
  // }
  visibilityAction(form: FormGroup, keysList: string[], condition: boolean) {
    const action = condition ? "disable" : "enable";
    _.forEach(keysList, (control) => {
      form.get(control)![action]();
      form.controls[control]?.updateValueAndValidity();
    });
  }

  clearValidator(key: string, form: FormGroup) {
    form.controls[key]?.clearValidators();
    form.controls[key]?.updateValueAndValidity();
  }

  setValidator(key: string, form: FormGroup) {
    form.controls[key]?.setValidators(Validators.required);
    form.controls[key]?.updateValueAndValidity();
  }

  checkValidator(key: string, form: FormGroup) {
    return (
      form.get(key)?.invalid && (form.get(key)?.dirty || form.get(key)?.touched)
    );
  }

  formStyle(key: string, form: FormGroup) {
    let abstractControl = form.controls[key];
    const isRequired = abstractControl?.hasValidator(Validators.required);
    return isRequired;
  }
  LessThanPrice(formControlKey: string, price: number): { [key: string]: any } {
    return (group: FormGroup) => {
      const invalid = group.controls[formControlKey].value >= price;
      return invalid ? { invalid: true } : null;
    };
  }

  //TODO: why wee need this code !
  // /**
  //  * Returns a validator function that validates that the end date is after or equal to the start date.
  //  * @param startDateControlName The name of the control representing the start date.
  //  * @returns A validator function that returns a ValidationErrors object if the end date is before the start date,
  //  *          or null if the validation passes.
  //  */
  // endDateAfterOrEqualValidator(startDateControlName: string): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const startDate = control.parent?.get(startDateControlName)?.value;
  //     const endDate = control.value;
  //
  //     if (startDate && endDate) {
  //       const startDateMoment = moment(startDate);
  //       const endDateMoment = moment(endDate);
  //
  //       if (endDateMoment.isBefore(startDateMoment)) {
  //         return { endDateBeforeStartDate: true };
  //       }
  //     }
  //
  //     return null;
  //   };
  // }
}
