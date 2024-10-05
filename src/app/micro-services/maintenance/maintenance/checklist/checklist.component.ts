import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Activity, CheckList, CheckListApi } from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { Config, FieldType } from "../../../../share/datatable/type";
import { LoaderService } from "../../../../share/service/loader.service";
import { ProsetDialogService } from "../../../../share/service/proset-dialog.service";
import { ShareService } from "../../../../share/service/share.service";
import { ToastService } from "../../../../share/service/toast.service";

@Component({
  selector: "proset-checklist",
  templateUrl: "./checklist.component.html",
  styleUrl: "./checklist.component.less",
})
export class ChecklistComponent implements OnInit {
  config: Config;
  tableRow: CheckList[] = [];

  permission = UserPermissions;

  constructor(
    private checkListApi: CheckListApi,
    private loaderService: LoaderService,
    private shareService: ShareService,
    private translateService: TranslateService,
    private dialogService: ProsetDialogService,
    private toastService: ToastService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getAllChecklist();
    this.config = this.initCheckListTable();
  }

  getAllChecklist() {
    this.checkListApi
      .getAllCheckList()
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((response) => {
        this.tableRow = response;
      });
  }

  showFormInViewMode(row: Activity): void {
    this.router.navigate(["maintenance/checklist/form/view", row.id]);
  }

  initCheckListTable(): Config {
    return {
      limitPerPage: 30,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      id: "CheckList_Table",
      list: [
        {
          type: FieldType.text,
          id: "CHECKLIST_TABLE_NAME",
          label: "CHECKLIST.TABLE.NAME",
          field: "name",
          minWidth: 100,
          width: 150,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "CHECKLIST_TABLE_CODE",
          label: "CHECKLIST.TABLE.CODE",
          field: "code",
          minWidth: 50,
          width: 50,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "CHECKLIST_TABLE_TASKS",
          label: "CHECKLIST.TABLE.TASKS",
          field: "taskList",
          minWidth: 50,
          width: 113,
          sortable: false,
          commaSeperatedToolTipFiledName: "name",
          translator: (value) => {
            let translate = "";
            translate = this.translateService.instant(
              "CHECKLIST.TABLE.TASK_NAME",
            );
            return value.length.toString().concat(" ").concat(translate);
          },
        },
        {
          type: FieldType.text,
          id: "GENERAL_CREATED",
          label: "DATATABLE.CREATED",
          field: "created",
          minWidth: 50,
          width: 100,
          sortable: false,
          translator: (value) => {
            return value ? this.shareService.getJalaliDate(value) : "-";
          },
        },
        {
          type: FieldType.text,
          id: "GENERAL.CREATED_BY",
          label: "DATATABLE.CREATED_BY",
          field: "createdByName",
          minWidth: 50,
          width: 122,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "GENERAL_UPDATED",
          label: "DATATABLE.UPDATED",
          field: "updated",
          minWidth: 50,
          width: 152,
          sortable: false,
          translator: (value) => {
            return value ? this.shareService.getJalaliDate(value) : "-";
          },
        },
        {
          type: FieldType.text,
          id: "GENERAL_UPDATED",
          label: "DATATABLE.UPDATED_BY",
          field: "updatedByName",
          minWidth: 50,
          width: 142,
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
          id: "DATATABLE_EDIT",
          icon: "isax isax-trash",
          tooltip: "DATATABLE.DELETE",
          label: "DATATABLE.DELETE",
          action: (row): void => this.deleteRow(row),
          permission: [this.permission.CHECKLIST_DELETE],
        },
      ],
    };
  }

  updateRow(row: CheckList) {
    this.router.navigate([
      "maintenance/maintenance/checklist/form/update",
      row.id,
    ]);
  }

  deleteRow(row: CheckList) {
    this.dialogService
      .showConfirm({
        title: "CHECKLIST.MESSAGES.DELETE_TITLE",
        contentMessage: "CHECKLIST.MESSAGES.DELETE_CONTENT",
      })
      .afterClosed()
      .subscribe((response) => {
        if (response && row.id) {
          this.loaderService.setLoading(true);
          this.checkListApi
            .deleteCheckList(row.id)
            .pipe(finalize(() => this.loaderService.setLoading(false)))
            .subscribe({
              next: (response) => {
                this.toastService.success("ASSET.MESSAGES.DELETE");
                this.getAllChecklist();
              },
            });
        }
      });
    this.checkListApi.deleteCheckList(row.id!);
  }
}
