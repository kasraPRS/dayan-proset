import { FormGroup } from "@angular/forms";
import * as moment from "jalali-moment";

export function dateRangeValidator(start: string, end: string) {
  return (formGroup: FormGroup): { [key: string]: any } | null => {
    const startDateControl = formGroup.get(start);
    const endDateControl = formGroup.get(end);

    if (!startDateControl?.value || !endDateControl?.value) {
      endDateControl?.setErrors({ require: true });
      return null;
    }

    const startDate = moment(startDateControl?.value);
    const endDate = moment(endDateControl?.value);

    if (endDate.isAfter(startDate)) {
      endDateControl?.setErrors(null);
      return null;
    } else {
      endDateControl?.setErrors({ dateRangeInvalid: true });
      return { dateRangeInvalid: true };
    }
  };
}
