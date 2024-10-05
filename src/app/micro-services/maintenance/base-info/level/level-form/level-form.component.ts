import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  CodeGeneratorApi,
  GeneratorEntityType,
  Level,
  LevelApi,
} from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { FORM_MODE, LIST_EVENTS } from "src/app/share/enums/enums";
import { EventService } from "src/app/share/service/event.service";
import { LoaderService } from "src/app/share/service/loader.service";
import { ProsetDialogService } from "src/app/share/service/proset-dialog.service";
import { DialogComponentForm } from "../../../../../share/model/dialog-component-form";

@Component({
  selector: "proset-level-form",
  templateUrl: "./level-form.component.html",
  styleUrl: "./level-form.component.less",
})
export class LevelFormComponent implements OnInit, DialogComponentForm {
  formGroup: FormGroup;
  levelDto: Level = {};
  editCode: string;
  permission = UserPermissions;
  tableRow: Level[] = [];
  viewMode = false;

  ngOnInit(): void {}

  constructor(
    private formBuilder: FormBuilder,
    private levelApi: LevelApi,
    private dialogService: ProsetDialogService,
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
      this.levelDto = {};
    } else if (formVal.id) {
      this.levelDto = formVal;
      this.getView(formVal.id);
    }
    this.resetForm();
  }

  onSave() {
    this.loaderService.setLoading(true);
    this.levelDto = {
      ...this.levelDto,
      ...this.formGroup.value,
    };

    if (this.levelDto.id) {
      this.levelApi
        .updateLevelById(this.levelDto.id, this.levelDto)
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          next: () => {
            this.resetForm();
            this.dialogService.dismissAll();
            this.eventService.emit(LIST_EVENTS.RELOAD_LIST);
          },
        });
    } else {
      this.levelApi
        .createLevel(this.levelDto)
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

  getFormGroup(): FormGroup {
    return this.formGroup;
  }

  /**
   * Creates the form level for the level definition.
   *
   * @returns {void}
   */
  createForm(): void {
    this.formGroup = this.formBuilder.group({
      name: [null, Validators.required],
      description: [null],
      code: [{ value: null, disabled: true }, Validators.required],
    });

    this.formGroup.valueChanges.subscribe((val) => {
      this.levelDto = {
        ...this.levelDto,
        ...val,
      };
    });
  }

  getView(id: number) {
    this.loaderService.setLoading(true);
    this.levelApi
      .getLevelById(id)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((value) => {
        this.editCode = value.code!;
        this.formGroup.patchValue(value);
        this.levelDto = value;
      });
  }

  resetForm(): void {
    this.levelDto = {};
    this.formGroup.reset({});
  }

  generateCode() {
    this.codeGeneratorService
      .generateCode(GeneratorEntityType.LEVEL)
      .subscribe((result) => {
        this.levelDto.code = result.code;
        this.formGroup.get("code")?.setValue(result.code);
      });
  }
}
