import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Column, ScopeVars } from "../type";

@Component({
  selector: "proset-column-selector",
  templateUrl: "./column-selector.component.html",
  styleUrls: ["./column-selector.component.less"],
})
export class ColumnSelectorComponent implements OnInit {
  scopeVars: ScopeVars;
  selectedColumns: Column[];
  allColumns: Column[];
  disabled = false;

  constructor(private ngbActiveModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.selectedColumns = this.scopeVars.data;
    this.allColumns = this.scopeVars.data;
  }

  submit(): void {
    this.ngbActiveModal.close(this.selectedColumns);
  }

  onClose() {
    this.ngbActiveModal.close();
  }

  toggle(col: Column) {
    const isChecked = this.isChecked(col);

    if (isChecked) {
      this.selectedColumns = this.selectedColumns.filter((c) => {
        return c.id !== col.id;
      });
    } else {
      this.selectedColumns = [...this.selectedColumns, col];
    }
  }

  isChecked(col: Column) {
    return (
      this.selectedColumns.find((c) => {
        return c.id === col.id;
      }) !== undefined
    );
  }
}
