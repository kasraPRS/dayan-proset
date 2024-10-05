import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Part, PartApi, WorkLogPart } from "@proset/maintenance-client";
import { WorkOrderService } from "../../../../service/work-order.service";
import * as _ from "lodash";
import { DialogComponentForm } from "../../../../../../../../share/model/dialog-component-form";
import { ProsetDialogService } from "../../../../../../../../share/service/proset-dialog.service";

@Component({
  selector: "proset-work-log-part-dialog",
  templateUrl: "./work-log-part-dialog.component.html",
  styleUrl: "./work-log-part-dialog.component.less",
})
export class WorkLogPartDialogComponent implements OnInit, DialogComponentForm {
  partFormGroup: FormGroup;
  partList: Part[];
  workLogPart: WorkLogPart = {};
  isPartSelected = false;

  constructor(
    private formBuilder: FormBuilder,
    private partApi: PartApi,
    private workOrderService: WorkOrderService,
    private dialogService: ProsetDialogService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.partApi.getAllPart().subscribe((response) => {
      this.partList = response;
    });
  }

  createForm() {
    this.partFormGroup = this.formBuilder.group({
      part: [null, Validators.required],
      count: [null, Validators.required],
    });
  }

  getFormGroup(): FormGroup {
    return this.partFormGroup;
  }

  initComponent(data: any): void {}

  onClose(): void {}

  onSave(): void {
    if (!this.workOrderService.workLogPartList) {
      this.workOrderService.workLogPartList = [];
    }
    this.workLogPart.partCount = this.partFormGroup.controls["count"].value;
    this.workOrderService.workLogPartList.push(this.workLogPart);
    this.dialogService.dismissAll();
  }

  onPartChange(event: Part) {
    this.workLogPart.partId = event.id;
    this.workLogPart.partCode = event.code;
    this.workLogPart.partName = event.name;
    let part = _.filter(
      this.workOrderService.workLogPartList,
      (part: WorkLogPart) => part.partId === event.id,
    );
    this.isPartSelected = part.length !== 0;
  }
}
