import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { NgbCalendarPersian } from "@ng-bootstrap/ng-bootstrap";
import { filter } from "rxjs";
import { AuthenticationService } from "../../authenticatation/authentication.service";
import { UserPermissions } from "../menu/enums/menu.enum";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.less"],
})
export class HeaderComponent implements OnInit {
  date: any;
  breadcrumbs = "";
  user: string;

  constructor(
    private router: Router,
    private authenticatedService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    let _calendar = new NgbCalendarPersian();
    this.date =
      _calendar.getToday().year +
      "/" +
      _calendar.getToday().month +
      "/" +
      _calendar.getToday().day;
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.breadcrumbs = "User";
      });
  }

  logout() {
    this.authenticatedService.logout();
  }
  getPersionWeekDayName(): string {
    let _calendar = new NgbCalendarPersian();
    let dayNumber = _calendar.getWeekday(_calendar.getToday());
    switch (dayNumber) {
      case 1:
        return "WEEKDAY.MONDAY";
      case 2:
        return "WEEKDAY.TUESDAY";
      case 3:
        return "WEEKDAY.WEDNESDAY";
      case 4:
        return "WEEKDAY.THURSDAY";
      case 5:
        return "WEEKDAY.FRIDAY";
      case 6:
        return "WEEKDAY.SATURDAY";
      case 7:
        return "WEEKDAY.SUNDAY";
      default:
        return "";
    }
  }

  protected UserPermissions = UserPermissions;
}
