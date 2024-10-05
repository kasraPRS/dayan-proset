import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { KanbanConfigService } from "../service/kanban-config.service";
import {
  KanbanCardFieldType,
  KanbanCardSortOrderType,
  KanbanCardSortType,
  KanbanConfig,
} from "../types/type";

/**
 * Component for configuring a kanban board.
 */
@Component({
  selector: "proset-kanban-config",
  templateUrl: "./kanban-config.component.html",
  styleUrls: ["./kanban-config.component.less"],
})
export class KanbanConfigComponent implements OnInit {
  config: KanbanConfig;

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private configService: KanbanConfigService,
  ) {}

  ngOnInit(): void {
    this.config = this.configService.config;
  }

  /**
   * Saves the selected configuration to local storage and closes the configuration modal.
   */
  submit(): void {
    this.ngbActiveModal.close(this.config);
  }

  /**
   * Closes the configuration modal without saving any changes.
   */
  onClose(): void {
    this.ngbActiveModal.close();
  }

  /**
   * Toggles the selection of a field.
   * @param col The field to toggle.
   */
  toggle(col: any): void {
    const isChecked = this.isChecked(col);
    let newFields = this.config.showFields;
    if (isChecked) {
      newFields = newFields.filter((c) => c !== col);
    } else {
      newFields = [...new Set([...newFields, col])];
    }
    this.config = {
      ...this.config,
      showFields: newFields,
    };
  }

  /**
   * Checks if a field is selected.
   * @param col The field to check.
   * @returns True if the field is selected, false otherwise.
   */
  isChecked(col: any): boolean {
    return this.config.showFields.includes(col);
  }

  toggleSortOrder() {
    this.config.sortOrder =
      this.config.sortOrder == KanbanCardSortOrderType.ASC
        ? KanbanCardSortOrderType.DESC
        : KanbanCardSortOrderType.ASC;
  }

  get KanbanCardSortOrderType() {
    return KanbanCardSortOrderType;
  }

  get sortList() {
    return Object.keys(KanbanCardSortType);
  }

  get fieldList() {
    return Object.keys(KanbanCardFieldType).filter(
      (f) =>
        f != KanbanCardFieldType.TITLE &&
        f != KanbanCardFieldType.STATUS &&
        f != KanbanCardFieldType.AUTHOR,
    );
  }
}
