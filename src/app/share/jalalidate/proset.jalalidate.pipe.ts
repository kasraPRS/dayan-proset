import { Pipe, PipeTransform } from "@angular/core";
import { ShareService } from "../service/share.service";

@Pipe({
  name: "jalaliDate",
})
export class ProsetJalaliDatePipe implements PipeTransform {
  constructor(private shareService: ShareService) {}

  transform(date: string | undefined, withTime?: boolean): string {
    if (date) {
      return withTime
        ? this.shareService.getJalaliDateTime(new Date(date))
        : this.shareService.getJalaliDate(new Date(date));
    } else {
      return " - ";
    }
  }
}
