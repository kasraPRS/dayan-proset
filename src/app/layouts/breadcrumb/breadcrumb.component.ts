import { Component, OnInit } from "@angular/core";
import { BreadcrumbModel } from "./model/breadcrumb.model";
import { RouterLink } from "@angular/router";
import { NgForOf, NgIf } from "@angular/common";
import { BreadcrumbService } from "./breadcrumb.service";
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: "proset-breadcrumb",
  standalone: true,
  imports: [NgForOf, RouterLink, NgIf, MatDivider],
  templateUrl: "./breadcrumb.component.html",
  styleUrl: "./breadcrumb.component.less",
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: BreadcrumbModel[] = [];

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit(): void {
    this.breadcrumbService.breadcrumbs.subscribe((result) => {
      this.breadcrumbs = result;
    });
  }
}
