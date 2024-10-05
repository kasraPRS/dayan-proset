import { AbstractControl } from "@angular/forms";
import * as _ from "lodash";

export function nationalCodeValidatorFn(control: AbstractControl) {
  const fakeCodeTen = [
    "0000000000",
    "1111111111",
    "2222222222",
    "3333333333",
    "4444444444",
    "5555555555",
    "6666666666",
    "7777777777",
    "8888888888",
    "9999999999",
  ];
  const fakeCodeEleven = [
    "00000000000",
    "11111111111",
    "22222222222",
    "33333333333",
    "44444444444",
    "55555555555",
    "66666666666",
    "77777777777",
    "88888888888",
    "99999999999",
  ];
  if (control.value) {
    if (
      isNaN(control.value) ||
      fakeCodeTen.indexOf(control.value) !== -1 ||
      fakeCodeEleven.indexOf(control.value) !== -1
    ) {
      return { invalidNationalCode: true };
    }
    if (control.value && control.value.length === 10) {
      let nationalVal = 0;
      let num: number;
      _.forEach(control.value, (_length: number, index: number) => {
        num = _.multiply(control.value[index], _.subtract(10, index));
        nationalVal += num;
      });

      let x = nationalVal % 11;

      if (x === 0) {
        return null;
      }
      return { invalidNationalCode: true };
    }
    if (control.value && control.value.length === 11) {
      const nationalCodeWithoutControlDigit = control.value.substring(
        0,
        control.value?.length - 1,
      );
      const controlDigit = control.value.substring(
        control.value.length - 1,
        control.value.length,
      );
      const deci = control.value.substring(
        control.value.length - 2,
        control.value.length - 1,
      );
      const decimal = parseInt(deci) + 2;
      const multiplier = [29, 27, 23, 19, 17, 29, 27, 23, 19, 17];
      let sum = 0;
      let i = 0;
      _.forEach(
        nationalCodeWithoutControlDigit,
        (item: string, index: number) => {
          const temp = (parseInt(item) + decimal) * multiplier[index];
          sum += temp;
        },
      );
      let modBy11 = sum % 11;
      if (modBy11 === 10) {
        modBy11 = 0;
      }
      if (modBy11 === parseInt(controlDigit)) {
        return null;
      }
      return { invalidNationalCode: true };
    }
    return { invalidNationalCode: true };
  }
  return null;
}
