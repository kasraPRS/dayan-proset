import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ScopeVars } from "../datatable/type";
import { Person } from "@proset/maintenance-client";
@Component({
  selector: "proset-filter-modal",
  templateUrl: "./filter-modal.component.html",
  styleUrl: "./filter-modal.component.less",
})
export class FilterModalComponent implements OnInit {
  @Input() title: string;
  @Input() submitDisabled = false;
  @Input() imageSrc: string;

  @Input() submitHidden = false;
  @Input() closeButtonText: string;
  @Input() extraButtonText: string;
  historySearchParameter: {
    createdBy: Person | null;
    updatedBy: Person | null;
    createdFrom: Date | null;
    createdTo: Date | null;
    updatedFrom: Date | null;
    updatedTo: Date | null;
  };

  scopeVars: ScopeVars;

  constructor(private ngbActiveModal: NgbActiveModal) {}

  onClose() {
    this.ngbActiveModal.close();
  }

  submit(): void {
    this.ngbActiveModal.close(this.historySearchParameter);
  }

  onCreatByChange(event: Person): void {
    this.historySearchParameter.createdBy = event;
  }

  onCreatedFrom(event: Date): void {
    this.historySearchParameter.createdFrom = event;
  }

  onCreatedTo(event: Date): void {
    this.historySearchParameter.createdTo = event;
  }

  onUpdateByChange(event: Person | any): void {
    this.historySearchParameter.updatedBy = event;
  }

  onUpdatedFrom(event: Date): void {
    this.historySearchParameter.updatedFrom = event;
  }

  onUpdatedTo(event: Date): void {
    this.historySearchParameter.updatedTo = event;
  }

  ngOnInit(): void {
    this.historySearchParameter = {
      createdBy: null,
      updatedBy: null,
      createdFrom: null,
      createdTo: null,
      updatedFrom: null,
      updatedTo: null,
    };
  }
}
