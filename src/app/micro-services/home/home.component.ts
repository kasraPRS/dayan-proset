import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  WorkOrder,
  WorkOrderApi,
  WorkOrderStatus,
} from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { PermissionsService } from "src/app/authenticatation/permissions.service";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { FORM_MODE } from "src/app/share/enums/enums";
import {
  KanbanCardActionType,
  KanbanColumnType,
} from "src/app/share/kanban/types/type";
import { TaskType } from "src/app/share/model/task";
import { LoaderService } from "src/app/share/service/loader.service";
import { ProsetDialogService } from "src/app/share/service/proset-dialog.service";
import { ToastService } from "src/app/share/service/toast.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.less"],
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private workOrderApi: WorkOrderApi,
    private dialogService: ProsetDialogService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private permissionsService: PermissionsService,
  ) {}

  permissions = UserPermissions;
  workOrderList: WorkOrder[];

  ngOnInit(): void {
    this.onSearchWorkOrder();
  }

  kanbanColumns: KanbanColumnType[] = [
    {
      name: "KANBAN_BOARD_COLUMN.OPEN",
      status: WorkOrderStatus.OPEN,
      color: this.assignPriorityColorToEvent(WorkOrderStatus.OPEN),
    },
    {
      name: "KANBAN_BOARD_COLUMN.UNDER_EXECUTION",
      status: WorkOrderStatus.UNDER_EXECUTION,
      color: this.assignPriorityColorToEvent(WorkOrderStatus.UNDER_EXECUTION),
    },
    {
      name: "KANBAN_BOARD_COLUMN.WORK_LOG",
      status: WorkOrderStatus.WORK_LOG,
      color: this.assignPriorityColorToEvent(WorkOrderStatus.WORK_LOG),
    },
    {
      name: "KANBAN_BOARD_COLUMN.FINISHED",
      status: WorkOrderStatus.FINISHED,
      color: this.assignPriorityColorToEvent(WorkOrderStatus.FINISHED),
    },
  ];
  workOrderTasks: TaskType[] = [];
  workOrderTasksActions: KanbanCardActionType[] = [
    {
      title: "KANBAN_CARD_MENU.DELETE",
      status: WorkOrderStatus.OPEN,
      action: (task) => {
        this.deleteWorkOrderById(task);
      },
    },
    {
      title: "KANBAN_CARD_MENU.EDIT",
      status: WorkOrderStatus.OPEN,
      action: (task) => {
        this.updateRowFromKanban(task);
      },
    },
    {
      title: "KANBAN_CARD_MENU.PRINT",
      action(task) {},
    },
  ];

  onSearchWorkOrder() {
    if (this.permissionsService.hasPersmission([UserPermissions.WORK_ORDER])) {
      this.loaderService.setLoading(true);
      this.workOrderApi
        .searchWorkOrder()
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe((response: WorkOrder[]) => {
          this.workOrderList = response.map((item: WorkOrder) => {
            return {
              ...item,
            };
          });
          this.initKanban();
        });
    }
  }
  initKanban() {
    this.workOrderTasks = this.workOrderList.map((m: WorkOrder) => {
      return {
        link: `/maintenance/work-order/view/` + m.id,
        assignee: m?.executionManager,
        author: m?.executionManager,
        title: m?.name,
        priority: m?.priority,
        start_date: m.startDate,
        id: m.id?.toString(),
        code: m.code,
        end_date: m.endDate,
        status: m.status,
        isRejected: m.isRejected,
        orgEntity: m,
        color: "",
        labels: [
          {
            title: "WORK_ORDERS.WORK_ORDER_TYPE_KANBAN." + m.type,
            color: "#E30000",
          },
          {
            title: m.asset?.name,
            color: "#009878",
          },
        ],
      } as TaskType;
    });
  }

  assignPriorityColorToEvent(status: any) {
    switch (status) {
      case WorkOrderStatus.OPEN:
        return "#D1A6F4";
      case WorkOrderStatus.UNDER_EXECUTION:
        return "#FDAB3D";
      case WorkOrderStatus.WORK_LOG:
        return "#62A0FF";
      case WorkOrderStatus.FINISHED:
        return "#46BB6E";
      default:
        return ""; // Or any default color if needed
    }
  }

  deleteWorkOrderById(row: any): void {
    if (row.status === WorkOrderStatus.OPEN) {
      this.dialogService
        .showConfirm({
          size: "l",
          image: "assets/img/modal_icon.png",
          contentMessage: "MESSAGES.DELETE_CONFIRM",
        })
        .afterClosed()
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe((response) => {
          if (response && row.id) {
            this.workOrderApi.deleteWorkOrderById(row.id).subscribe({
              next: (): void => {
                this.toastService.success(
                  "WORK_ORDERS.MESSAGES.ACTION_MESSAGE_SUCCESS",
                );
                this.onSearchWorkOrder();
              },
              error: (): void => {
                this.toastService.error(
                  "WORK_ORDERS.MESSAGES.ACTION_MESSAGE_FAIL",
                );
              },
            });
          }
        });
    } else {
      this.dialogService.showInfo({
        title: "GENERAL.ERROR_TITLE",
        contentMessage: "WORK_ORDERS.MESSAGES.WORK_ORDER_NOT_DELETABLE",
      });
    }
  }

  updateRowFromKanban(row: any) {
    if (row.status === WorkOrderStatus.OPEN) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree([
          "maintenance/work-order/",
          FORM_MODE.UPDATE,
          row.id,
        ]),
      );
      window.open(url, "_blank");
    } else {
      this.dialogService.showInfo({
        title: "GENERAL.ERROR_TITLE",
        contentMessage: "WORK_ORDERS.MESSAGES.WORK_ORDER_NOT_UPDATABLE",
      });
    }
  }
}
