import { HttpContext } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgSelectComponent } from "@ng-select/ng-select";
import {
  CodeGeneratorApi,
  GeneratorEntityType,
  Group,
  GroupApi,
  Level,
  LevelApi,
} from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { SHOW_TOAST } from "src/app/interceptors/exception.interceptor";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { FORM_MODE, LIST_EVENTS } from "src/app/share/enums/enums";
import { EventService } from "src/app/share/service/event.service";
import { LoaderService } from "src/app/share/service/loader.service";
import { ProsetDialogService } from "src/app/share/service/proset-dialog.service";
import { DialogComponentForm } from "../../../../../share/model/dialog-component-form";

@Component({
  selector: "proset-group-form",
  templateUrl: "./group-form.component.html",
  styleUrl: "./group-form.component.less",
})
export class GroupFormComponent implements OnInit, DialogComponentForm {
  formGroup: FormGroup;
  groupDto: Group = {};
  editCode: string;
  permission = UserPermissions;
  tableRow: Group[] = [];
  viewMode = false;
  levels: Level[] = [];

  ngOnInit(): void {}

  constructor(
    private formBuilder: FormBuilder,
    private groupApi: GroupApi,
    private levelApi: LevelApi,
    private dialogService: ProsetDialogService,
    private loaderService: LoaderService,
    private codeGeneratorService: CodeGeneratorApi,
    private eventService: EventService<LIST_EVENTS>,
  ) {
    this.createForm();
    this.getLevels();
  }

  getLevels() {
    this.levelApi.getAllLevel().subscribe((res) => {
      this.levels = res;
    });
  }

  onClose(): void {}

  initComponent(data: any): void {
    const { viewType, ...formVal } = data;
    this.viewMode = viewType == FORM_MODE.VIEW;

    if (viewType == FORM_MODE.CREATE) {
      this.generateCode();
      this.groupDto = {};
    } else if (formVal.id) {
      this.groupDto = formVal;
      this.getView(formVal.id);
      this.checkInUsed();
    }
    this.resetForm();
  }

  onSave() {
    this.loaderService.setLoading(true);
    this.groupDto = {
      ...this.groupDto,
      ...this.formGroup.value,
    };

    if (this.groupDto.id) {
      this.groupApi
        .updateGroupById(this.groupDto.id, this.groupDto)
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          next: () => {
            this.resetForm();
            this.dialogService.dismissAll();
            this.eventService.emit(LIST_EVENTS.RELOAD_LIST);
          },
        });
    } else {
      this.groupApi
        .createGroup(this.groupDto)
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          next: () => {
            this.resetForm();
            this.dialogService.dismissAll();
            this.eventService.emit(LIST_EVENTS.RELOAD_LIST);
          },
        });
    }
  }

  onSearch(event: any, select: NgSelectComponent) {
    const searchTerm = event.target.value;
    select.filter(searchTerm);
  }

  onNewLevel() {
    window.open("maintenance/base-info/level/list", "_blank");
  }

  getFormGroup(): FormGroup {
    return this.formGroup;
  }

  /**
   * Creates the form group for the group definition.
   *
   * @returns {void}
   */
  createForm(): void {
    this.formGroup = this.formBuilder.group({
      name: [null, Validators.required],
      description: [null],
      code: [{ value: null, disabled: true }, Validators.required],
      level: [null, Validators.required],
    });

    this.formGroup.valueChanges.subscribe((val) => {
      this.groupDto = {
        ...this.groupDto,
        ...val,
      };
    });
  }

  getView(id: number) {
    this.loaderService.setLoading(true);
    this.groupApi
      .getGroupById(id)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((value) => {
        this.editCode = value.code!;
        this.formGroup.patchValue(value);
        this.groupDto = value;
      });
  }

  resetForm(): void {
    this.groupDto = {};
    this.formGroup.reset({});
  }

  generateCode() {
    this.codeGeneratorService
      .generateCode(GeneratorEntityType.GROUP)
      .subscribe((result) => {
        if (result) {
          this.groupDto.code = result.code;
          this.formGroup.get("code")?.setValue(result.code);
        }
      });
  }

  checkInUsed() {
    if (this.groupDto.id) {
      this.loaderService.setLoading(true);
      this.groupApi
        .checkGroupIsInUsed(this.groupDto.id, "body", false, {
          context: new HttpContext().set(SHOW_TOAST, false),
        })
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          error: (error) => {
            if (error.status && error.status === 406) {
              this.formGroup.get("level")?.disable({ emitEvent: false });
            }
          },
        });
    }
  }
}
