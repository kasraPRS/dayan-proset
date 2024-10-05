import { Component, Input, OnChanges, OnInit } from "@angular/core";
import {
  KanbanCardActionType,
  KanbanCardSortOrderType,
  KanbanCardSortType,
  KanbanColumnType,
  KanbanConfig,
} from "../types/type";
import { KanbanConfigComponent } from "../kanban-config/kanban-config.component";
import { KanbanConfigService } from "../service/kanban-config.service";
import * as _ from "lodash";
import * as moment from "jalali-moment";
import { TaskType } from "../../model/task";
import { DialogService } from "../../service/dialogservice";

@Component({
  selector: "kanban-board",
  templateUrl: "./kanban-board.component.html",
  styleUrls: ["./kanban-board.component.less"],
})
export class KanbanBoardComponent implements OnInit, OnChanges {
  /**
   * Initializes an array of KanbanColumnType objects with predefined values.
   * Each KanbanColumnType object represents a column in a kanban board.
   *
   * @returns {KanbanColumnType[]} The array of KanbanColumnType objects.
   */
  @Input({ required: true }) columns: KanbanColumnType[];
  @Input({ required: true }) tasks: TaskType[];
  @Input({ required: true }) cardActions: KanbanCardActionType[];

  constructor(
    private dialogService: DialogService,
    private kanbanConfigService: KanbanConfigService,
  ) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.populateColumnsWithWorkOrders();
  }

  /**
   * Populates the columns with work orders.
   *
   * Iterates through each work order in the list and finds the corresponding column in the columns array based on the status of the work order.
   * If a matching column is found, the work order is added to the cards array of that column.
   *
   * @returns {void}
   */
  private populateColumnsWithWorkOrders() {
    _.forEach(this.columns, (column: KanbanColumnType) => {
      column.tasks = [];
      _.forEach(this.tasks, (task: TaskType) => {
        if (column.status == task.status) column.tasks?.push(task);
      });
    });

    this.sortColumns();
  }

  onConfigClick() {
    this.dialogService
      .showWithComponent(KanbanConfigComponent, {
        size: "s",
      })
      .result.then((response: KanbanConfig) => {
        if (response) {
          this.kanbanConfigService.config = response;
          this.sortColumns();
        }
      });
  }

  /**
   * Sorts the cards in each column based on the configured sort field and sort order.
   *
   * Updates the 'cards' array of each column with the sorted cards.
   *
   * @returns {void}
   */
  sortColumns() {
    const sortField = this.kanbanConfigService.config.sortField;
    const sortOrder = this.kanbanConfigService.config.sortOrder;
    _.forEach(this.columns, (column) => {
      if (column.tasks)
        column.tasks = this.sortByField(column.tasks, sortField, sortOrder);
    });
  }

  sortByField(
    columnList: any[],
    field: any,
    sortOrder: KanbanCardSortOrderType = KanbanCardSortOrderType.ASC,
  ): any[] {
    return columnList.sort((a: TaskType, b: TaskType) => {
      if (field === KanbanCardSortType.PRIORITY) {
        const priorityOrder: any = { CRITICAL: 4, HIGH: 3, MIDDLE: 2, LOW: 1 };
        const aVal: any = a.priority;
        const bVal: any = b.priority;
        const x = priorityOrder[aVal];
        const y = priorityOrder[bVal];

        return sortOrder === KanbanCardSortOrderType.ASC
          ? x < y
            ? -1
            : x > y
              ? 1
              : 0
          : x > y
            ? -1
            : x < y
              ? 1
              : 0;
      } else if (field === KanbanCardSortType.START_DATE) {
        const aVal: any = a.start_date;
        const bVal: any = b.end_date;
        const x = moment(aVal);
        const y = moment(bVal);
        return sortOrder === KanbanCardSortOrderType.ASC
          ? x.diff(y)
          : y.diff(x);
      } else {
        const aVal: any = a.id;
        const bVal: any = b.id;
        const x = Number(aVal);
        const y = Number(bVal);
        return sortOrder === KanbanCardSortOrderType.ASC
          ? x > y
            ? 1
            : x < y
              ? -1
              : 0
          : x < y
            ? 1
            : x > y
              ? -1
              : 0;
      }
    });
  }
}
