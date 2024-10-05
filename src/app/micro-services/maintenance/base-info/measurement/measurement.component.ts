import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Measurement, MeasurementApi } from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { FORM_MODE, LIST_EVENTS } from "src/app/share/enums/enums";
import { EventService } from "src/app/share/service/event.service";
import { ProsetDialogService } from "src/app/share/service/proset-dialog.service";
import { ToastService } from "src/app/share/service/toast.service";
import { Config, FieldType } from "../../../../share/datatable/type";
import { FormModalComponent } from "../../../../share/modal-component/form-modal/form-modal.component";
import { LoaderService } from "../../../../share/service/loader.service";
import { ShareService } from "../../../../share/service/share.service";
import { MeasurementFormComponent } from "./measurement-form/measurement-form.component";

@Component({
  selector: "proset-measurement",
  templateUrl: "./measurement.component.html",
  styleUrl: "./measurement.component.less",
})
export class MeasurementComponent implements OnInit {
  protected MeasurementFormComponent = MeasurementFormComponent;
  viewType: FORM_MODE = FORM_MODE.CREATE;

  config: Config;
  formGroup: FormGroup;
  measurementDto: Measurement = {};
  tableRow: Measurement[];
  disableActionButton = true;
  @ViewChild("form") formGroupReference: TemplateRef<FormGroup>;

  permission = UserPermissions;

  ngOnInit(): void {
    this.config = this.initMeasurementTable();
    this.getAllMeasurement();

    this.eventService.listen(LIST_EVENTS.RELOAD_LIST, () => {
      this.getAllMeasurement();
    });
  }

  getAllMeasurement(): void {
    this._loaderService.setLoading(true);
    this._measurementApi
      .getAllMeasurement()
      .pipe(finalize(() => this._loaderService.setLoading(false)))
      .subscribe((response) => {
        this.tableRow = response;
      });
  }

  constructor(
    private _measurementApi: MeasurementApi,
    private _dialogService: ProsetDialogService,
    private _loaderService: LoaderService,
    private _shareService: ShareService,
    private toastService: ToastService,
    private eventService: EventService<LIST_EVENTS>,
  ) {}

  showFormInViewMode(row: Measurement): void {
    this.viewType = FORM_MODE.VIEW;
    this.measurementDto = row;
    this.openMeasurementForm(row, false);
  }

  initMeasurementTable(): Config {
    return {
      limitPerPage: 30,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      id: "MEASUREMENT_TABLE",
      list: [
        {
          type: FieldType.text,
          id: "MEASUREMENT_CODE",
          label: "MEASUREMENT.TABLE.CODE",
          field: "code",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "MEASUREMENT_TITLE",
          label: "MEASUREMENT.TABLE.TITLE",
          field: "name",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "MEASUREMENT_DESCRIPTION",
          label: "MEASUREMENT.TABLE.DESCRIPTION",
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
            return value ? this._shareService.getJalaliDate(value) : "-";
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
            return value ? this._shareService.getJalaliDate(value) : "-";
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
          action: (row): void => this.openMeasurementForm(row, true),
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

  // }

  openMeasurementForm(row: Measurement, editMode: boolean): void {
    this.measurementDto = row;
    this._dialogService
      .showWithFormComponent(FormModalComponent, {
        referenceContent: MeasurementFormComponent,
        title: "MEASUREMENT.TITLE",
        data: {
          viewType: editMode ? FORM_MODE.UPDATE : FORM_MODE.VIEW,
          ...row,
        },
      })
      .afterClosed()
      .subscribe(() => {
        this.viewType = FORM_MODE.CREATE;
        this.measurementDto = {};
      });
  }

  /**
   * Deletes a measurement from the server.
   *
   * @param {Measurement} row - The measurement object to delete.
   * @returns {void}
   */
  deleteRow(row: Measurement): void {
    this._dialogService
      .showConfirm({
        image: "assets/img/modal_icon.png",
        contentMessage: "MESSAGES.DELETE_CONFIRM",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res && row?.id) {
          this._loaderService.setLoading(true);
          this._measurementApi
            .deleteMeasurementById(row?.id)
            .pipe(finalize(() => this._loaderService.setLoading(false)))
            .subscribe({
              next: (value) => {
                this.getAllMeasurement();
                this._dialogService.dismissAll();
                this.toastService.success(
                  "MEASUREMENT.MESSAGES.MEASUREMENT_DELETE",
                );
              },
            });
        }
      });
    this.initMeasurementTable();
  }
}
