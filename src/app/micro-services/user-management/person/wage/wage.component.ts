import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Wage } from "@proset/maintenance-client";
import * as moment from "jalali-moment";
import { Moment } from "../../../../share/datepicker/proset-datepicker.component";
import { ProsetDialogService } from "../../../../share/service/proset-dialog.service";
import { UserManagementService } from "../../usermanagement.service";
import { distinctUntilChanged, take, takeWhile } from "rxjs";
import { isEqual } from "lodash";

@Component({
  selector: "proset-wage",
  templateUrl: "./wage.component.html",
  styleUrl: "./wage.component.less",
})
export class WageComponent implements OnInit {
  wageFormGroup: FormGroup;
  recordList: Wage[] = [];
  @Input()
  personId: number;

  constructor(
    private formBuilder: FormBuilder,
    private prosetDialogService: ProsetDialogService,
    private userManagementService: UserManagementService,
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  get entryList(): FormArray {
    return this.wageFormGroup.get("entryList") as FormArray;
  }
  createForm() {
    this.wageFormGroup = this.formBuilder.group({
      entryList: this.formBuilder.array([this.initFormEntry()]),
    });

    this.userManagementService.wageList.subscribe((val) => {
      this.wageFormGroup.get("entryList")?.patchValue(val);
    });

    this.wageFormGroup.valueChanges
      .pipe(
        distinctUntilChanged((prev, curr) =>
          isEqual(prev.entryList, curr.entryList),
        ),
      )
      .subscribe((val) => {
        this.userManagementService.wageList.next(val.entryList);
      });
  }

  initFormEntry(): FormGroup {
    return this.formBuilder.group({
      workingHourCost: [null, Validators.required],
      overtimeCost: [],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
    });
  }

  onNewRecord(index: number) {
    this.entryList.insert(index + 1, this.initFormEntry());
  }
  onDeleteRecord(index: number) {
    if (index === 0) {
      this.prosetDialogService
        .showConfirm({
          contentMessage: "PERSON.MESSAGES.IS_THE_LAST_WAGE",
        })
        .afterClosed()
        .subscribe((value) => {
          this.entryList.at(0).reset();
        });
    } else {
      this.entryList.removeAt(index);
    }
  }

  onFromDateChange(event: Moment, index: number) {
    let formGroup = this.entryList.at(index) as FormGroup;
    let momentEndDate = moment(formGroup.controls["toDate"].value);
    this.checkStartDate(event, momentEndDate)
      ? formGroup.controls["fromDate"].setErrors({ invalidFromDate: true })
      : formGroup.controls["fromDate"].setErrors(null);
    this.checkEndDate(event, momentEndDate)
      ? formGroup.controls["toDate"].setErrors({ invalidToDate: true })
      : formGroup.controls["toDate"].setErrors(null);
  }

  onToDateChange(event: Moment, index: number) {
    let formGroup = this.entryList.at(index) as FormGroup;
    let momentStartDate = moment(formGroup.controls["fromDate"].value);
    this.checkStartDate(momentStartDate, event)
      ? formGroup.controls["fromDate"].setErrors({ invalidFromDate: true })
      : formGroup.controls["fromDate"].setErrors(null);
    this.checkEndDate(momentStartDate, event)
      ? formGroup.controls["toDate"].setErrors({ invalidToDate: true })
      : formGroup.controls["toDate"].setErrors(null);
  }

  checkStartDate(startDate: Moment, endDate: Moment): boolean {
    return endDate.isValid() && startDate.isAfter(endDate);
  }

  checkEndDate(startDate: Moment, endDate: Moment): boolean {
    return startDate.isValid() && endDate.isBefore(startDate);
  }
}
