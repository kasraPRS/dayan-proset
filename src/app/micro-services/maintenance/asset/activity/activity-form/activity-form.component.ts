import { HttpContext } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  Activity,
  ActivityApi,
  CodeGeneratorApi,
  GeneratorEntityType,
} from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { SHOW_TOAST } from "src/app/interceptors/exception.interceptor";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { FORM_MODE, LIST_EVENTS } from "src/app/share/enums/enums";
import { EventService } from "src/app/share/service/event.service";
import { LoaderService } from "src/app/share/service/loader.service";
import { DialogComponentForm } from "../../../../../share/model/dialog-component-form";

@Component({
  selector: "proset-activity-form",
  templateUrl: "./activity-form.component.html",
  styleUrl: "./activity-form.component.less",
})
export class ActivityFormComponent implements OnInit, DialogComponentForm {
  formGroup: FormGroup;
  activityDto: Activity = {};
  editCode: string;
  permission = UserPermissions;
  tableRow: Activity[] = [];
  viewMode = false;
  isInUsed = false;
  editor: any = DecoupledEditor;

  ngOnInit(): void {}

  constructor(
    private formBuilder: FormBuilder,
    private activityApi: ActivityApi,
    private modalService: NgbModal,
    private loaderService: LoaderService,
    private codeGeneratorService: CodeGeneratorApi,
    private eventService: EventService<LIST_EVENTS>,
  ) {
    this.createForm();
  }

  onClose(): void {}

  initComponent(data: any): void {
    const { viewType, ...formVal } = data;
    this.viewMode = viewType == FORM_MODE.VIEW;

    if (viewType == FORM_MODE.CREATE) {
      this.generateCode();
      this.activityDto = {};
    } else if (formVal.id) {
      this.activityDto = formVal;
      this.getActivityView(formVal.id);
      this.checkInUsed();
    }
    this.resetForm();
  }

  onSave(onSuccess: () => void) {
    this.loaderService.setLoading(true);
    this.activityDto = {
      ...this.activityDto,
      ...this.formGroup.value,
    };

    if (this.activityDto.id) {
      this.activityApi
        .updateActivityById(this.activityDto.id, this.activityDto)
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          next: () => {
            onSuccess();
            this.resetForm();
            this.modalService.dismissAll();
          },
        });
    } else {
      this.activityApi
        .createActivity(this.activityDto)
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          next: () => {
            onSuccess();
            this.resetForm();
            this.modalService.dismissAll();
            this.eventService.emit(LIST_EVENTS.RELOAD_LIST);
          },
        });
    }
  }

  getFormGroup(): FormGroup {
    return this.formGroup;
  }

  /**
   * Updates the activityDto asset property and sets the value of the asset form control.
   *
   * @param {any} event - The event object containing the selected asset.
   * @returns {void}
   */
  onAssetChange(event: any) {
    this.activityDto.asset = event;
    this.formGroup.controls["asset"].setValue(event);
  }

  /**
   * Creates the form group for the activity definition.
   *
   * @returns {void}
   */
  createForm(): void {
    this.formGroup = this.formBuilder.group({
      asset: [null, Validators.required],
      name: [null, Validators.required],
      code: [{ value: null, disabled: true }, Validators.required],
      instruction: [""],
    });

    this.formGroup.valueChanges.subscribe((val) => {
      this.activityDto = {
        ...this.activityDto,
        ...val,
      };
    });
  }

  getActivityView(id: number) {
    this.loaderService.setLoading(true);
    this.activityApi
      .getActivityById(id)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((value) => {
        this.editCode = value.code!;
        this.formGroup.patchValue(value);
        this.formGroup.controls["asset"].setValue(value.asset);
        this.activityDto = value;
      });
  }

  resetForm(): void {
    this.activityDto = {};
    this.formGroup.reset({});
  }

  generateCode() {
    this.codeGeneratorService
      .generateCode(GeneratorEntityType.ACTIVITY)
      .subscribe((result) => {
        if (result) {
          this.activityDto.code = result.code;
          this.formGroup.get("code")?.setValue(result.code);
        }
      });
  }

  checkInUsed() {
    if (this.activityDto.id) {
      this.loaderService.setLoading(true);
      this.activityApi
        .checkActivityIsInUsed(this.activityDto.id, "body", false, {
          context: new HttpContext().set(SHOW_TOAST, false),
        })
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          error: (error) => {
            if (error.status && error.status === 406) {
              this.isInUsed = true;
              this.formGroup.get("asset")?.disable({ emitEvent: false });
            }
          },
        });
    }
  }

  /**
   * Inserts the toolbar element of the editor UI before the editable element.
   */
  public onReadyEditor(editor: any) {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement(),
      );
  }
}
