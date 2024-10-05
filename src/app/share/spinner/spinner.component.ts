import { Component, OnInit } from "@angular/core";
import { LoaderService } from "../service/loader.service";

@Component({
  selector: "app-spinner",
  templateUrl: "./spinner.component.html",
  styleUrls: ["./spinner.component.less"],
})
export class SpinnerComponent implements OnInit {
  constructor(public loader: LoaderService) {}

  ngOnInit(): void {}
}
