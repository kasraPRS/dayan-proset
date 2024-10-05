import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import {
  Priority,
  WorkOrderStatus,
  WorkOrderType,
} from "@proset/maintenance-client";
import { KanbanConfigService } from "../service/kanban-config.service";
import { KanbanCardActionType, KanbanCardFieldType } from "../types/type";
import { Subscription } from "rxjs";
import * as moment from "jalali-moment";
import { TaskType } from "../../model/task";

@Component({
  selector: "kanban-card",
  templateUrl: "./kanban-card.component.html",
  styleUrls: ["./kanban-card.component.less"],
})
export class KanbanCardComponent implements OnInit, OnDestroy {
  @Input() card: TaskType;
  @Input() columnIndex: number;
  @Input() cardIndex: number;
  @Input() cardActions: KanbanCardActionType[];

  private configSubscription: Subscription;

  showFields: KanbanCardFieldType[] = [];
  priorityBackground: string;

  constructor(private kanbanConfigService: KanbanConfigService) {}

  ngOnInit(): void {
    this.setPriorityBackground();
    this.showFields = this.kanbanConfigService.config.showFields;
    this.configSubscription = this.kanbanConfigService
      .getConfigObservable()
      .subscribe((conf) => {
        this.showFields = this.kanbanConfigService.config.showFields;
      });
  }

  ngOnDestroy(): void {
    if (this.configSubscription) this.configSubscription.unsubscribe();
  }

  public setPriorityBackground() {
    this.priorityBackground =
      this.card.priority == Priority.LOW
        ? "var(--priority-low-color)"
        : this.card.priority == Priority.MIDDLE
          ? "var(--priority-middle-color)"
          : this.card.priority == Priority.HIGH
            ? "var(--priority-high-color)"
            : this.card.priority == Priority.CRITICAL
              ? "var(--priority-critical-color)"
              : "";
  }

  public isActiveField(field: KanbanCardFieldType) {
    return this.showFields.includes(field);
  }

  get isPassed() {
    return moment().isAfter(this.card.end_date);
  }

  public get WorkOrderStatus() {
    return WorkOrderStatus;
  }

  public get WorkOrderType() {
    return WorkOrderType;
  }

  public get KanbanCardFieldType() {
    return KanbanCardFieldType;
  }
}
