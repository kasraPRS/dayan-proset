import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  forwardRef,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import {
  FailureDetectionMethod,
  FailureDetectionMethodApi,
} from "@proset/maintenance-client";
import * as _ from "lodash";
import { UserPermissions } from "../../../layouts/menu/enums/menu.enum";
import { NgSelectComponent } from "@ng-select/ng-select";
import { ProsetDialogService } from "../../service/proset-dialog.service";
import { FormModalComponent } from "../../modal-component/form-modal/form-modal.component";
import { FailureMethodDetectionFormComponent } from "src/app/micro-services/maintenance/base-info/failure-method-detection/failure-method-detection-form/failure-method-detection-form.component";
import { FORM_MODE, LIST_EVENTS } from "../../enums/enums";
import { EventService } from "../../service/event.service";

@Component({
  selector: "proset-failure-detection-method-select",
  templateUrl: "./failure-detection-method-select.component.html",
  styleUrls: ["./failure-detection-method-select.component.less"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FailureDetectionMethodSelectComponent),
      multi: true,
    },
  ],
})
export class FailureDetectionMethodSelectComponent
  implements OnInit, OnChanges, ControlValueAccessor
{
  @Output() failureDetectionMethodChange = new EventEmitter<
    FailureDetectionMethod | FailureDetectionMethod[]
  >();
  @Input() required = false;
  @Input() disabled = false;
  @Input() multiple = false;
  @Input() value: FailureDetectionMethod[] | FailureDetectionMethod;
  @ViewChild("selectFailureDetectionMethod", { static: false })
  selectFailureDetectionMethod: NgSelectComponent;
  formGroup: FormGroup;

  failureDetectionMethodDtoList: FailureDetectionMethod[] = [];
  permission = UserPermissions;
  label: string;

  onChange = (_: any) => {};
  onTouched = () => {};

  constructor(
    private _failureDetectionMethodApi: FailureDetectionMethodApi,
    private formBuilder: FormBuilder,
    private eventService: EventService<LIST_EVENTS>,
    private dialogService: ProsetDialogService,
  ) {
    this.formGroup = this.formBuilder.group({
      failureDetectionMethod: [null],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.formGroup.get("failureDetectionMethod")?.setValue(this.value);
  }

  onFailureDetectionMethodSearch(item: any) {
    const searchKey = item.target.value;
    this.selectFailureDetectionMethod.filter(searchKey);
  }

  ngOnInit(): void {
    this.getAllFailureDetectionMethod();
    this.eventService.listen(LIST_EVENTS.RELOAD_LIST, () => {
      this.getAllFailureDetectionMethod();
    });
  }

  getAllFailureDetectionMethod() {
    this._failureDetectionMethodApi
      .getAllFailureDetectionMethod()
      .subscribe(
        (failureDetectionMethodInfoList) =>
          (this.failureDetectionMethodDtoList = failureDetectionMethodInfoList),
      );
  }

  onFailureDetectionMethodChange(
    event: FailureDetectionMethod,
    selectFailureDetectionMethod: any,
  ): void {
    const failureDetectionMethodField = this.formGroup.get(
      "failureDetectionMethod",
    );
    const val = this.multiple
      ? this.getUniqeSelectedList(failureDetectionMethodField?.value)
      : event;

    failureDetectionMethodField?.setValue(val);
    this.onChange(val);
    this.failureDetectionMethodChange.emit(val);
    selectFailureDetectionMethod.close();
  }

  getUniqeSelectedList(items: FailureDetectionMethod[]) {
    return _.uniqBy(items, (obj) => obj);
  }

  goToNewFailureDetectionMethod() {
    this.openFailureMethodForm();
  }
  searchFailureDetectionMethod(
    searchTerm: string,
    item: FailureDetectionMethod,
  ) {
    return item.name?.includes(searchTerm) || item.id?.toString() == searchTerm;
  }

  openFailureMethodForm() {
    this.dialogService
      .showWithFormComponent(FormModalComponent, {
        referenceContent: FailureMethodDetectionFormComponent,
        title: "FAIL_DETECTION.TITLE",
        data: {
          viewType: FORM_MODE.CREATE,
        },
      })
      .afterClosed()
      .subscribe((res) => {});
  }

  writeValue(value: any): void {
    this.formGroup.get("failureDetectionMethod")?.setValue(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
