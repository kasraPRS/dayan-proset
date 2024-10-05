import * as moment from "jalali-moment";
export function getDayBetweenTwoDate(
  startDate: moment.Moment,
  endDate: moment.Moment,
) {
  let day = moment(endDate).endOf("day").diff(moment(startDate), "days");
  return day + 1;
}

export function calculateEndDate(startDate: moment.Moment, daysNumber: number) {
  let days = daysNumber - 1;
  let endDate = moment(startDate).add(days, "days");
  return moment(endDate, "YYYY-MM-DD");
}

export function formatNumberWithLeadingZero(input: number | string): string {
  const numericValue = Number(input);
  const stringValue = numericValue.toString();

  if (stringValue.length === 1) {
    return "0" + stringValue;
  } else {
    return stringValue;
  }
}
