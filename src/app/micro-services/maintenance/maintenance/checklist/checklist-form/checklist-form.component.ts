import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import {
  CheckList,
  CheckListApi,
  CodeGeneratorApi,
  GeneratorEntityType,
  Task,
} from "@proset/maintenance-client";
import * as _ from "lodash";
import { finalize } from "rxjs";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { Config, FieldType } from "../../../../../share/datatable/type";
import { FormModalComponent } from "../../../../../share/modal-component/form-modal/form-modal.component";
import { LoaderService } from "../../../../../share/service/loader.service";
import { ProsetDialogService } from "../../../../../share/service/proset-dialog.service";
import { ChecklistTaskComponent } from "./checklist-task/checklist-task.component";
import { FORM_MODE } from "src/app/share/enums/enums";

@Component({
  selector: "proset-checklist-form",
  templateUrl: "./checklist-form.component.html",
  styleUrl: "./checklist-form.component.less",
})
export class ChecklistFormComponent implements OnInit {
  @Input() id: number;
  @Input() viewType: FORM_MODE = FORM_MODE.CREATE;
  viewMode = false;
  formGroup: FormGroup;
  checklistDto: CheckList;
  task: Task = {};
  taskList: Task[] = [];
  config: Config;
  permissions = UserPermissions;

  ngOnInit(): void {
    this.createForm();
    this.config = this.initCheckListTable();
    this.viewMode = this.viewType == FORM_MODE.VIEW;

    if (this.id) {
      this.initForm();
    } else {
      this.generateCode();
    }
  }

  permission = UserPermissions;

  constructor(
    private formBuilder: FormBuilder,
    private codeGeneratorService: CodeGeneratorApi,
    private checkListApi: CheckListApi,
    private loaderService: LoaderService,
    private dialogService: ProsetDialogService,
    private translateService: TranslateService,
    private router: Router,
  ) {}

  initForm() {
    this.loaderService.setLoading(true);
    this.checkListApi
      .getCheckListById(this.id)
      .pipe(
        finalize(() => {
          this.loaderService.setLoading(false);
        }),
      )
      .subscribe((result) => {
        this.checklistDto = result;
        this.taskList = this.checklistDto.taskList!;
        this.formGroup.patchValue(this.checklistDto);

        if (this.viewMode) {
          this.formGroup.disable();
        }
      });
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      name: [null, Validators.required],
      code: [{ value: null, disabled: true }, Validators.required],
      description: [],
    });
  }

  generateCode() {
    this.codeGeneratorService
      .generateCode(GeneratorEntityType.CHECKLIST)
      .subscribe((result) => {
        if (result) {
          this.formGroup.controls["code"]?.setValue(result.code);
        }
      });
  }

  onSubmit() {
    this.loaderService.setLoading(true);
    this.checklistDto = this.formGroup.getRawValue();
    this.checklistDto.taskList = this.taskList;
    if (!this.id) {
      this.createCheckList();
    } else {
      this.updateCheckList();
    }
  }

  goToList() {
    this.dialogService
      .showConfirm({
        title: "MESSAGES.BACK_TO_LIST_TITLE",
        contentMessage: "MESSAGES.BACK_TO_LIST",
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.router.navigate(["maintenance/maintenance/checklist/list"]);
        }
      });
  }

  createCheckList() {
    this.checkListApi
      .createCheckList(this.checklistDto)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((response) => {
        this.formGroup.reset();
        this.dialogService.dismissAll();
        this.taskList = [];
        this.router.navigate(["/maintenance/checklist/list"]);
      });
  }

  updateCheckList() {
    this.checkListApi
      .updateCheckList(this.id, this.checklistDto)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((response) => {
        this.formGroup.reset();
        this.dialogService.dismissAll();
        this.router.navigate(["/maintenance/checklist/list"]);
      });
  }

  onAddTask() {
    this.dialogService
      .showWithFormComponent(FormModalComponent, {
        referenceContent: ChecklistTaskComponent,
        title: "CHECKLIST.TITLE",
        width: 600,
        data: {
          checkUniqTasks: this.checkUniqTasks(this.taskList),
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.taskList = [...this.taskList, result];
        }
      });
  }

  checkUniqTasks(taskList: Task[]) {
    return (task: Task) => {
      const tasks = [task, ...taskList];
      return (
        _.uniqWith(
          tasks,
          (taskA, taskB) =>
            taskA.name === taskB.name && taskA.type === taskB.type,
        ).length === tasks.length
      );
    };
  }

  initCheckListTable(): Config {
    return {
      limitPerPage: 30,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      id: "checklistTaskTable",
      list: [
        {
          type: FieldType.text,
          id: "CHECKLIST_TABLE_TASK_NAME",
          label: "CHECKLIST.TABLE.TASK.NAME",
          field: "name",
          minWidth: 100,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "CHECKLIST_TABLE_TASK_TYPE",
          label: "CHECKLIST.TABLE.TASK.TYPE",
          field: "type",
          minWidth: 10,
          width: 10,
          sortable: false,
          commaSeperatedToolTipFiledName: "name",
          translator: (value) => {
            return value
              ? this.translateService.instant(
                  "CHECKLIST.FORM.TASK_TYPE." + value,
                )
              : "-";
          },
        },
        {
          type: FieldType.text,
          id: "CHECKLIST_TABLE_TASK_MEASUREMENT",
          label: "CHECKLIST.TABLE.TASK.MEASUREMENT",
          field: "measurement.name",
          minWidth: 10,
          width: 10,
          sortable: false,
        },
        {
          type: FieldType.status,
          id: "CHECKLIST_TABLE_STATUS",
          label: "CHECKLIST.TABLE.STATUS",
          field: "active",
          minWidth: 10,
          width: 10,
          sortable: false,
        },
      ],
      actions: [
        {
          id: "DATATABLE_EDIT",
          icon: "isax isax-edit-2",
          tooltip: "DATATABLE.EDIT",
          label: "DATATABLE.EDIT",
          action: (row): void => this.updateRow(row),
          permission: [this.permission.CHECKLIST_UPDATE],
        },
        {
          id: "DATATABLE_DELETE",
          icon: "isax isax-trash",
          tooltip: "DATATABLE.DELETE",
          label: "DATATABLE.DELETE",
          action: (row): void => this.deleteRow(row),
          permission: [this.permission.CHECKLIST_DELETE],
        },
      ],
    };
  }

  deleteRow(row: Task) {
    this.dialogService
      .showConfirm({
        size: "l",
        image: "assets/img/modal_icon.png",
        contentMessage: "MESSAGES.DELETE_CONFIRM",
      })
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.taskList = _.remove(this.taskList, (task) => task !== row);
        }
      });
  }

  updateRow(row: Task) {
    this.dialogService
      .showWithFormComponent(FormModalComponent, {
        referenceContent: ChecklistTaskComponent,
        title: "CHECKLIST.TITLE",
        data: {
          task: row,
          checkUniqTasks: this.checkUniqTasks(this.taskList),
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          result = _.assign({}, row, result);
          this.taskList = _.map(this.taskList, (task) =>
            _.isEqual(task, row) ? result : task,
          );
        }
      });
  }
}
