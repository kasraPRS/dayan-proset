import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Person, UserType } from "@proset/maintenance-client";
import * as _ from "lodash";
import { BaseReactive } from "../directives/base-reactive.directive";
import { flattenObject, flattenObjectToArray } from "../helper/flatten";
import { HistorySearchParameter } from "../model/history-search-parameter";
import { SidebarService } from "./sidebar-service";
export interface SidebarFilterEvent {
  value: HistorySearchParameter;
  isReset: boolean;
}
@Component({
  selector: "proset-sidebar-filter",
  templateUrl: "./sidebar-filter.component.html",
  styleUrl: "./sidebar-filter.component.less",
})
export class SidebarFilterComponent extends BaseReactive implements OnInit {
  form: FormGroup;
  isOpen = false;
  @Output() onFilterForm = new EventEmitter<{
    value: HistorySearchParameter;
    isReset: boolean;
  }>();
  userType = UserType;

  constructor(
    private sidebarService: SidebarService,
    private formBuilder: FormBuilder,
  ) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
    this.sidebarService.sidenavMode$
      .pipe(this.takeUntilDestroy())
      .subscribe((item) => (this.isOpen = item));
  }
  createForm(): void {
    this.form = this.formBuilder.group({
      updatedTo: [null],
      updatedFrom: [null],
      createdTo: [null],
      createdFrom: [null],
      updatedBy: [null],
      createdBy: [null],
    });
  }
  sidebarView(viewMode: boolean) {
    this.sidebarService.set_sidenavMode(viewMode);
  }
  resetForm() {
    this.form.reset();
    this.sidebarService.filterList = [];
    this.onFilterForm.emit({
      value: this.form.value,
      isReset: true,
    });
  }
  onChangePerson(event: Person, formField: string): void {
    this.form.controls[formField].patchValue(event);
  }

  submit(): void {
    let obj = flattenObject(this.form.value);
    if (!_.isEmpty(obj)) {
      if (obj.createdBy) obj.createdBy = obj.createdBy.map((m: any) => m.uuid);
      if (obj.updatedBy) obj.updatedBy = obj.updatedBy.map((m: any) => m.uuid);

      this.sidebarService.filterList = flattenObjectToArray(obj!);
    } else {
      this.sidebarService.filterList = [];
    }
    this.onFilterForm.emit({
      value: obj,
      isReset: false,
    });
    this.sidebarView(false);
  }
}
