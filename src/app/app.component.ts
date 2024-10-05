import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"],
})
export class AppComponent {
  constructor(private translateService: TranslateService) {
    translateService.addLangs(["en", "ir"]);
    translateService.setDefaultLang("ir");
  }
}
