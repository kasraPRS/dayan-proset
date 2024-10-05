import { Injectable } from "@angular/core";
import { Jalali } from "jalali-ts";
import * as moment from "jalali-moment";
import { formatCurrency } from "@angular/common";
import { Currency } from "../enums/enums";

@Injectable({
  providedIn: "root",
})
export class ShareService {
  constructor() {}

  getJalaliDate(gregorianDate: Date): string {
    return moment(gregorianDate, "YYYY-MM-DD")
      .locale("fa")
      .format("YYYY/MM/DD");
  }

  getJalaliDateTime(gregorianDate: Date): string {
    return moment(gregorianDate, "YYYY-MM-DD HH:mm:ss")
      .locale("fa")
      .format("HH:mm:ss YYYY/MM/DD");
  }
}
