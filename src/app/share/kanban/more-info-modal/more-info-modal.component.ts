import { Component, Inject, TemplateRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ScopeVars } from "../../datatable/type";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-more-info-modal",
  templateUrl: "./more-info-modal.component.html",
})
export class KanbanMoreInfoModalComponent {
  scopeVars: ScopeVars;

  constructor(private ngbActiveModal: NgbActiveModal) {}

  ngOnInit(): void {}

  closeDialog(): void {
    this.ngbActiveModal.close();
  }
}
