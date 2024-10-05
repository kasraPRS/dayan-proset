import { Pipe, PipeTransform } from "@angular/core";
import { ShareService } from "../service/share.service";

@Pipe({
  name: "jalaliDatetime",
  standalone: true,
})
export class ProsetJalaliDatetimePipe implements PipeTransform {
  constructor(private shareService: ShareService) {}

  transform(date: string | undefined): string {
    if (date) {
      return this.shareService.getJalaliDateTime(new Date(date));
    } else {
      return " - ";
    }
  }
}
