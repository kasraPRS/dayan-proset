import { HttpContext } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgSelectComponent } from "@ng-select/ng-select";
import {
  CodeGeneratorApi,
  GeneratorEntityType,
  Team,
  TeamApi,
  Person,
  PersonApi,
  UserType,
} from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { FORM_MODE, LIST_EVENTS } from "src/app/share/enums/enums";
import { DialogComponentForm } from "src/app/share/model/dialog-component-form";
import { EventService } from "src/app/share/service/event.service";
import { LoaderService } from "src/app/share/service/loader.service";
import { ProsetDialogService } from "src/app/share/service/proset-dialog.service";

@Component({
  selector: "proset-team-form",
  templateUrl: "./team-form.component.html",
  styleUrl: "./team-form.component.less",
})
export class TeamFormComponent implements OnInit, DialogComponentForm {
  formTeam: FormGroup;
  teamDto: Team = {};
  editCode: string;
  permission = UserPermissions;
  userType = UserType;
  tableRow: Team[] = [];
  viewMode = false;
  persons: Person[] = [];

  ngOnInit(): void {}

  constructor(
    private formBuilder: FormBuilder,
    private teamApi: TeamApi,
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
      this.teamDto = {};
    } else if (formVal.id) {
      this.teamDto = formVal;
      this.getView(formVal.id);
    }
    this.resetForm();
  }

  onSave() {
    this.loaderService.setLoading(true);
    this.teamDto = {
      ...this.teamDto,
      ...this.formTeam.value,
    };

    if (this.teamDto.id) {
      this.teamApi
        .updateTeamById(this.teamDto.id, this.teamDto)
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          next: () => {
            this.resetForm();
            this.dialogService.dismissAll();
            this.eventService.emit(LIST_EVENTS.RELOAD_LIST);
          },
        });
    } else {
      this.teamApi
        .createTeam(this.teamDto)
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

  onPersonChange(value: any) {
    if (value) {
      this.formTeam.controls["personList"].patchValue(value);
    }
  }

  getFormGroup(): FormGroup {
    return this.formTeam;
  }

  /**
   * Creates the form team for the team definition.
   *
   * @returns {void}
   */
  createForm(): void {
    this.formTeam = this.formBuilder.group({
      personList: [null, Validators.required],
      name: [null, Validators.required],
      description: [null],
      id: [null],
      code: [{ value: null, disabled: true }, Validators.required],
    });

    this.formTeam.valueChanges.subscribe((val) => {
      this.teamDto = {
        ...this.teamDto,
        ...val,
      };
    });
  }

  getView(id: number) {
    this.loaderService.setLoading(true);
    this.teamApi
      .getTeamById(id)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((value) => {
        this.editCode = value.code!;
        this.formTeam.patchValue(value);
        this.teamDto = value;
        this.persons = value.personList!;
      });
  }

  resetForm(): void {
    this.teamDto = {};
    this.formTeam.reset({});
  }

  generateCode() {
    this.codeGeneratorService
      .generateCode(GeneratorEntityType.TEAM)
      .subscribe((result) => {
        if (result) {
          this.teamDto.code = result.code;
          this.formTeam.get("code")?.setValue(result.code);
        }
      });
  }
}
