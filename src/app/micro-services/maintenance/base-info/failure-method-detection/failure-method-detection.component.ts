import { Component, OnInit } from "@angular/core";
import { UserPermissions } from "../../../../layouts/menu/enums/menu.enum";
import { MeasurementFormComponent } from "../measurement/measurement-form/measurement-form.component";
import {
  FailureDetectionMethod,
  FailureDetectionMethodApi,
  Measurement,
} from "@proset/maintenance-client";
import { Config, FieldType } from "../../../../share/datatable/type";
import { ShareService } from "../../../../share/service/share.service";
import { FailureModeFormComponent } from "../../asset/failure-mode/failure-mode-form/failure-mode-form.component";
import { FORM_MODE, LIST_EVENTS } from "../../../../share/enums/enums";
import { FormModalComponent } from "../../../../share/modal-component/form-modal/form-modal.component";
import { ProsetDialogService } from "../../../../share/service/proset-dialog.service";
import { FailureMethodDetectionFormComponent } from "./failure-method-detection-form/failure-method-detection-form.component";
import { LoaderService } from "../../../../share/service/loader.service";
import { EventService } from "../../../../share/service/event.service";
import { finalize } from "rxjs";
import { DialogService } from "../../../../share/service/dialogservice";
import { ToastService } from "../../../../share/service/toast.service";

@Component({
  selector: "proset-failure-method-detection",
  templateUrl: "./failure-method-detection.component.html",
  styleUrl: "./failure-method-detection.component.less",
})
export class FailureMethodDetectionComponent implements OnInit {
  protected readonly permission = UserPermissions;
  tableRow: FailureDetectionMethod[] = [];
  config: Config;
  viewType: FORM_MODE = FORM_MODE.CREATE;
  failureDetectionMethodDto: FailureDetectionMethod = {};

  ngOnInit(): void {
    this.config = this.initFailureMethodTable();
    this.getAllFailureMethodDetection();

    this.eventService.listen(LIST_EVENTS.RELOAD_LIST, () => {
      this.getAllFailureMethodDetection();
    });
  }

  constructor(
    private shareService: ShareService,
    private dialogService: ProsetDialogService,
    private failureDetectionMethodApi: FailureDetectionMethodApi,
    private loaderService: LoaderService,
    private eventService: EventService<LIST_EVENTS>,
    private toastService: ToastService,
  ) {}

  getAllFailureMethodDetection() {
    this.loaderService.setLoading(true);
    this.failureDetectionMethodApi
      .getAllFailureDetectionMethod()
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((response) => (this.tableRow = [...response]));
  }
  initFailureMethodTable(): Config {
    return {
      limitPerPage: 30,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      id: "FAIL_DETECTION_TABLE",
      list: [
        {
          type: FieldType.text,
          id: "FAIL_DETECTION_CODE",
          label: "FAIL_DETECTION.TABLE.CODE",
          field: "code",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "FAIL_DETECTION_TITLE",
          label: "FAIL_DETECTION.TABLE.NAME",
          field: "name",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "FAIL_DETECTION_DESCRIPTION",
          label: "FAIL_DETECTION.TABLE.DESCRIPTION",
          field: "description",
          minWidth: 50,
          width: 100,
          sortable: false,
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
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "GENERAL_UPDATED",
          label: "DATATABLE.UPDATED",
          field: "updated",
          minWidth: 50,
          width: 100,
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
          width: 100,
          sortable: false,
        },
      ],
      actions: [
        {
          id: "DATATABLE_EDIT",
          icon: "isax isax-edit-2",
          tooltip: "DATATABLE.EDIT",
          label: "DATATABLE.EDIT",
          permission: [this.permission.MEASUREMENT_UPDATE],
          action: (row): void => this.openFailureMethodForm(row, true),
        },
        {
          id: "DATATABLE_DELETE",
          icon: "isax isax-trash",
          tooltip: "DATATABLE.DELETE",
          label: "DATATABLE.DELETE",
          permission: [this.permission.MEASUREMENT_DELETE],
          action: (row): void => this.deleteRow(row),
        },
      ],
    };
  }

  openFailureMethodForm(row: FailureDetectionMethod, editMode: boolean) {
    this.failureDetectionMethodDto = row;
    this.dialogService
      .showWithFormComponent(FormModalComponent, {
        referenceContent: FailureMethodDetectionFormComponent,
        title: "FAIL_DETECTION.TITLE",
        data: {
          viewType: editMode ? FORM_MODE.UPDATE : FORM_MODE.VIEW,
          ...row,
        },
      })
      .afterClosed()
      .subscribe(() => {
        this.viewType = FORM_MODE.CREATE;
        this.failureDetectionMethodDto = {};
      });
  }
  deleteRow(row: FailureDetectionMethod) {
    this.dialogService
      .showConfirm({
        image: "assets/img/modal_icon.png",
        contentMessage: "MESSAGES.DELETE_CONFIRM",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res && row?.id) {
          this.loaderService.setLoading(true);
          this.failureDetectionMethodApi
            .deleteFailureDetectionMethodById(row?.id)
            .pipe(finalize(() => this.loaderService.setLoading(false)))
            .subscribe({
              next: (value) => {
                this.getAllFailureMethodDetection();
                this.dialogService.dismissAll();
                this.toastService.success("MESSAGES.DELETE_SUCCESSFUL");
              },
            });
        }
      });
    this.initFailureMethodTable();
  }

  showFormInViewMode(row: Measurement): void {
    this.viewType = FORM_MODE.VIEW;
    this.failureDetectionMethodDto = row;
    this.openFailureMethodForm(row, false);
  }

  protected readonly FailureMethodDetectionFormComponent =
    FailureMethodDetectionFormComponent;
}
