import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";
import {
  Event,
  IsActiveMatchOptions,
  NavigationStart,
  Router,
} from "@angular/router";
import { PermissionsService } from "src/app/authenticatation/permissions.service";
import { UserPermissions } from "./enums/menu.enum";
import { Menu } from "./model/menuItem";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.less"],
})
export class MenuComponent implements OnInit {
  @ViewChildren(MatMenuTrigger) trigger: QueryList<MatMenuTrigger>;

  options: any = {};
  isExpanded: boolean = false;
  navbarCollapsed: boolean = true;

  leftMenus: Menu[];
  permission = UserPermissions;

  matchSubPathOption: IsActiveMatchOptions = {
    matrixParams: "exact",
    queryParams: "exact",
    paths: "subset",
    fragment: "ignored",
  };

  constructor(
    private router: Router,
    public permissionsService: PermissionsService,
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.trigger.toArray().forEach((item: MatMenuTrigger, i: number) => {
          if (item.menuOpen) {
            item.closeMenu();
          }
        });
      }
    });
  }

  toggleNavbarCollapsing() {
    this.navbarCollapsed = !this.navbarCollapsed;
  }

  ngOnInit(): void {
    this.permissionsService.loadUserPermissions();
    this.menuItems();
    this.options = {
      rtl: true,
    };
  }

  menuItems() {
    this.leftMenus = [
      {
        name: "MENU.HOME",
        route: "/home",
      },
      {
        name: "MENU.BASE_INFO.TITLE",
        permission: [UserPermissions.BASE_TABLE],
        columns: [
          {
            name: "MENU.BASE_INFO.MEASUREMENT",
            route: "maintenance/base-info/measurement/list",
            permission: [UserPermissions.MEASUREMENT],
          },
          {
            name: "MENU.BASE_INFO.LEVEL",
            route: "maintenance/base-info/level/list",
            permission: [UserPermissions.LEVEL],
          },
          {
            name: "MENU.BASE_INFO.GROUP",
            route: "maintenance/base-info/group/list",
            permission: [UserPermissions.GROUP],
          },
          {
            name: "MENU.BASE_INFO.EMPLACEMENT_LOCATION",
            route: "maintenance/base-info/emplacement-location/list",
            permission: [UserPermissions.EMPLACEMENT_LOCATION],
          },
          {
            name: "MENU.BASE_INFO.COST_CENTER",
            route: "maintenance/base-info/cost-center/list",
            permission: [UserPermissions.COST_CENTER],
          },
          {
            name: "MENU.BASE_INFO.PART",
            route: "maintenance/base-info/part/list",
            permission: [UserPermissions.PART],
          },
          {
            name: "MENU.BASE_INFO.FAILURE_DETECTION_METHOD",
            route: "maintenance/base-info/failure-method-detection/list",
            permission: [UserPermissions.FAILURE_DETECTION_METHOD],
          },
        ],
      },
      {
        name: "MENU.ASSET.TITLE",
        columns: [
          {
            name: "MENU.ASSET.TITLE",
            route: "maintenance/asset/asset/list",
            permission: [UserPermissions.ASSET],
          },
          {
            name: "MENU.ASSET.ACTIVITY",
            route: "maintenance/asset/activity/list",
            permission: [UserPermissions.ACTIVITY],
          },
          {
            name: "MENU.ASSET.FAILURE_MODE",
            route: "maintenance/asset/failure-mode/list",
            permission: [UserPermissions.FAILURE_MODE],
          },
          {
            name: "MENU.ASSET.FAILURE_REASON",
            route: "maintenance/asset/failure-reason/list",
            permission: [UserPermissions.FAILURE_REASON],
          },
          {
            name: "MENU.ASSET.FAILURE_MECHANISM",
            route: "maintenance/asset/failure-mechanism/list",
            permission: [UserPermissions.FAILURE_MECHANISM],
          },
        ],
        permission: [UserPermissions.ASSET],
      },
      {
        name: "MENU.MAINTENANCE.TITLE",
        columns: [
          {
            name: "MENU.MAINTENANCE.WORK-REQUEST",
            route: "maintenance/maintenance/work-request/list",
            permission: [UserPermissions.WORK_REQUEST],
          },
          {
            name: "MENU.MAINTENANCE.WORK_ORDERS",
            route: "maintenance/maintenance/work-order/list",
            permission: [UserPermissions.WORK_ORDER],
          },
          {
            name: "MENU.MAINTENANCE.CHECKLIST",
            route: "maintenance/maintenance/checklist/list",
            permission: [UserPermissions.CHECKLIST],
          },
          {
            name: "MENU.MAINTENANCE.REPAIR_PLANNING",
            route: "maintenance/maintenance/repair-planning/list",
            permission: [UserPermissions.REPAIR_PLANNING],
          },
        ],
        permission: [UserPermissions.MAINTENANCE],
      },
      {
        name: "MENU.REPORTS.TITLE",
        route: "maintenance/reports",
        permission: [UserPermissions.REPORT],
        columns: [],
      },
      {
        name: "MENU.SETTINGS.TITLE",
        columns: [
          {
            name: "MENU.SETTINGS.COMPANY",
            route: "setting/organization",
            permission: [UserPermissions.ORGANIZATION],
          },
          {
            name: "MENU.SETTINGS.USER_MANAGEMENT",
            route: "setting/user-management/person",
            permission: [UserPermissions.USER_MANAGEMENT],
          },
          {
            name: "MENU.SETTINGS.START_NUMBER",
            route: "setting/start-code",
            permission: [UserPermissions.START_CODE],
          },
        ],
        permission: [UserPermissions.SETTING],
      },
      {
        name: "MENU.EVENTS.TITLE",
        columns: [
          {
            name: "MENU.EVENTS.ERROR_LOG",
            route: "maintenance/events/error-log/list",
            permission: [UserPermissions.ERROR_LIST],
          },
        ],
        permission: [UserPermissions.ERROR_LIST],
      },
    ].filter(
      (menu) =>
        !menu.permission ||
        this.permissionsService.hasPersmission(menu.permission),
    );
  }

  trackMenuByName(index: number, menu: any) {
    return menu.name;
  }

  openMenu(index: number) {
    this.trigger.toArray().forEach((item: MatMenuTrigger, i: number) => {
      if (i !== index && item.menuOpen) {
        item.closeMenu();
      }
    });
  }

  public isRouteActive(menu: Menu) {
    return menu.columns?.filter(
      (m) => m.route && this.router.isActive(m.route, false),
    ).length;
  }
}
