import { Injectable } from "@angular/core";
import { BreadcrumbModel } from "./model/breadcrumb.model";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import * as _ from "lodash";
import { BehaviorSubject, filter } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: "root",
})
export class BreadcrumbService {
  //TODO: could be implemented with behavior subject! Ticket: PRS-1021
  // breadcrumbs: BreadcrumbModel[] = [];
  breadcrumbs = new BehaviorSubject<BreadcrumbModel[]>([]);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() =>
        this.breadcrumbs.next(this.buildBreadCrumbs(this.activatedRoute.root)),
      );
  }

  buildBreadCrumbs(
    route: ActivatedRoute,
    url: string = "",
    breadcrumbs: BreadcrumbModel[] = [],
  ): BreadcrumbModel[] {
    const children: ActivatedRoute[] = route.children;
    if (children.length === 0) {
      return breadcrumbs;
    }

    _.forEach(children, (child) => {
      const routeUrl: string = child.snapshot.url
        .map((url) => url.path)
        .join("/");
      if (routeUrl != "") {
        url.concat(routeUrl);
      }
      if (child.snapshot.data["breadcrumb"]) {
        breadcrumbs.push({
          label: this.translateService.instant(
            child.snapshot.data["breadcrumb"].label,
          ),
          link: url,
        });
      }

      return this.buildBreadCrumbs(child, url, breadcrumbs);
    });

    return breadcrumbs;
  }
}
