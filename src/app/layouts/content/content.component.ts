import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import * as _ from "lodash";
import { Menu_ENUM } from "../menu/enums/menu.enum";

@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.less"],
})
export class ContentComponent implements OnInit {
  pageTitle: string = "";

  constructor(
    private router: Router,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      let url: string = "";
      let translateKey: any;
      val instanceof NavigationEnd ? (url = val.url) : null;
      _.find(Object.keys(Menu_ENUM) as (keyof typeof Menu_ENUM)[], (key) => {
        if (key === url) {
          translateKey = Menu_ENUM[key];
        }
      });
      if (translateKey) {
        this.translateService.stream(translateKey).subscribe((value) => {
          this.pageTitle = value;
        });
      }
    });
  }
}
