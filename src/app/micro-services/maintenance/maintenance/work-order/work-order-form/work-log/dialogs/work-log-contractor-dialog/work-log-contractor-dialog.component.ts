import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  Person,
  UserType,
  WorkLogContractor,
} from "@proset/maintenance-client";
import { WorkOrderService } from "../../../../service/work-order.service";
import * as _ from "lodash";
import { DialogComponentForm } from "../../../../../../../../share/model/dialog-component-form";
import { ProsetDialogService } from "../../../../../../../../share/service/proset-dialog.service";

@Component({
  selector: "proset-work-log-contractor-dialog",
  templateUrl: "./work-log-contractor-dialog.component.html",
  styleUrl: "./work-log-contractor-dialog.component.less",
})
export class WorkLogContractorDialogComponent implements DialogComponentForm {
  contractorFormGroup: FormGroup;
  selectedPerson: Person;
  workLogContractor: WorkLogContractor;
  isPersonSelected = false;

  constructor(
    private formBuilder: FormBuilder,
    private workOrderService: WorkOrderService,
    private dialogService: ProsetDialogService,
  ) {
    this.createForm();
  }

  createForm() {
    this.contractorFormGroup = this.formBuilder.group({
      person: [null, Validators.required],
      workingHour: [],
      workingMinute: [null, Validators.max(59)],
      invoiceNumber: [],
      invoiceFee: [],
    });
  }

  getFormGroup(): FormGroup {
    return this.contractorFormGroup;
  }

  initComponent(data: any): void {}

  onClose(): void {}

  onSave(): void {
    if (!this.workOrderService.workLogContractorList) {
      this.workOrderService.workLogContractorList = [];
    }
    this.workLogContractor = this.contractorFormGroup.getRawValue();
    this.workLogContractor.person = this.selectedPerson;
    this.workOrderService.workLogContractorList.push(this.workLogContractor);
    this.workOrderService.workLogContractorList = _.uniqBy(
      this.workOrderService.workLogContractorList,
      (personnel) => personnel.person?.id,
    );
    this.workOrderService.isWorkLogPersonInvalid.next(false);
    this.dialogService.dismissAll();
  }

  protected readonly UserType = UserType;

  onPersonChange(event: Person) {
    this.selectedPerson = event;
    let person = _.filter(
      this.workOrderService.workLogContractorList,
      (person: WorkLogContractor) => person.person?.id === event.id,
    );
    this.isPersonSelected = person.length !== 0;
    this.contractorFormGroup.controls["person"].clearValidators();
    this.contractorFormGroup.controls["person"].updateValueAndValidity();
  }
}
