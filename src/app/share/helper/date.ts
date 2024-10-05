import { FormGroup } from "@angular/forms";
import * as moment from "jalali-moment";
export function getDayBetweenTwoDate(startDate: string, endDate: string) {
  let start = moment(startDate, "YYYY-MM-DD");
  let end = moment(endDate, "YYYY-MM-DD");
  let day = moment.duration(end.diff(start)).asDays();
  return day + 1;
}

export function getGregorianDate(date: Date): string {
  return moment(date).locale("en").format("YYYY-MM-DD");
}

export function calculateEndDate(startDate: string, daysNumber: number) {
  let days = daysNumber - 1;
  return calculateNextDate(startDate, days);
}

export function calculateNextDate(startDate: string, daysNumber: number) {
  let nextDate = moment(startDate, "YYYY-MM-DD").add(daysNumber, "days");
  return moment(nextDate).locale("en").format("YYYY-MM-DD");
}
export function calculateBeforeDate(startDate: string, daysNumber: number) {
  let beforeDate = moment(startDate, "YYYY-MM-D").subtract(daysNumber, "days");
  return moment(beforeDate).locale("en").format("YYYY-MM-DD");
}

export function isAfterDate(date1: string, date2: string): boolean {
  return moment(date1).isAfter(moment(date2));
}

export function isSameDate(date1: string, date2: string): boolean {
  return moment(date1).isSame(moment(date2), "day");
}

export function endDateLessThanStartDate(startTime: string, endTime: string) {
  return (group: FormGroup) => {
    const startDate = group.controls[startTime].value;
    const endDate = group.controls[endTime].value;

    if (startDate && endDate) {
      const startDateMoment = moment(startDate);
      const endDateMoment = moment(endDate);

      if (
        endDateMoment.isBefore(startDateMoment) ||
        endDateMoment.isSame(startDateMoment)
      ) {
        return { invalid: true };
      }
    }

    return null;
  };
}
