import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Person, UserType, WorkLogPersonnel } from "@proset/maintenance-client";
import { WorkOrderService } from "../../../../service/work-order.service";
import * as _ from "lodash";
import { DialogComponentForm } from "../../../../../../../../share/model/dialog-component-form";
import { ProsetDialogService } from "../../../../../../../../share/service/proset-dialog.service";

@Component({
  selector: "proset-work-log-personnel-dialog",
  templateUrl: "./work-log-personnel-dialog.component.html",
  styleUrl: "./work-log-personnel-dialog.component.less",
})
export class WorkLogPersonnelDialogComponent implements DialogComponentForm {
  personnelFormGroup: FormGroup;
  protected readonly UserType = UserType;
  selectedPerson: Person;
  workLogPersonnel: WorkLogPersonnel;
  isPersonSelected = false;

  constructor(
    private formBuilder: FormBuilder,
    private dialogService: ProsetDialogService,
    private workOrderService: WorkOrderService,
  ) {
    this.createForm();
  }

  createForm() {
    this.personnelFormGroup = this.formBuilder.group({
      person: [null, Validators.required],
      workingHour: [null, Validators.required],
      workingMinute: [null, [Validators.required, Validators.max(59)]],
      overTimeHour: [],
      overTimeMinute: [null, Validators.max(59)],
    });
  }

  getFormGroup(): FormGroup {
    return this.personnelFormGroup;
  }

  initComponent(data: any): void {}

  onClose(): void {}

  onSave(): void {
    if (!this.workOrderService.workLogPersonnelList) {
      this.workOrderService.workLogPersonnelList = [];
    }
    this.workLogPersonnel = this.personnelFormGroup.getRawValue();
    this.workLogPersonnel.person = this.selectedPerson;
    this.workOrderService.workLogPersonnelList.push(this.workLogPersonnel);
    this.workOrderService.workLogPersonnelList = _.uniqBy(
      this.workOrderService.workLogPersonnelList,
      (personnel) => personnel.person?.id,
    );
    this.workOrderService.isWorkLogPersonInvalid.next(false);
    this.dialogService.dismissAll();
  }

  onPersonChange(event: Person) {
    this.selectedPerson = event;
    let person = _.filter(
      this.workOrderService.workLogPersonnelList,
      (person: WorkLogPersonnel) => person.person?.id === event.id,
    );
    this.isPersonSelected = person.length !== 0;
    this.personnelFormGroup.controls["person"].clearValidators();
    this.personnelFormGroup.controls["person"].updateValueAndValidity();
  }
}
