import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import {
  CodeGeneratorApi,
  GeneratorEntityType,
  Part,
  PartApi,
  PartPrice,
  UserType,
} from "@proset/maintenance-client";
import * as _ from "lodash";
import { finalize } from "rxjs";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { Config, FieldType } from "src/app/share/datatable/type";
import { FORM_MODE, LIST_EVENTS } from "src/app/share/enums/enums";
import { FormModalComponent } from "src/app/share/modal-component/form-modal/form-modal.component";
import { EventService } from "src/app/share/service/event.service";
import { LoaderService } from "src/app/share/service/loader.service";
import { ProsetDialogService } from "src/app/share/service/proset-dialog.service";
import { ShareService } from "src/app/share/service/share.service";
import { ToastService } from "src/app/share/service/toast.service";
import { PartPriceFormComponent } from "../part-price-form/part-price-form.component";

@Component({
  selector: "proset-part-form",
  templateUrl: "./part-form.component.html",
  styleUrl: "./part-form.component.less",
})
export class PartFormComponent implements OnInit {
  @Input() id: number;
  @Input() viewType: FORM_MODE = FORM_MODE.CREATE;

  protected PartPriceFormComponent = PartPriceFormComponent;
  config: Config;

  formGroup: FormGroup;
  partDto: Part = {};
  editCode: string;
  permission = UserPermissions;
  partPrices: PartPrice[] = [];
  viewMode = false;

  ngOnInit(): void {
    this.initComponent();
    this.config = this.initPartTable();
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private partApi: PartApi,
    private dialogService: ProsetDialogService,
    private loaderService: LoaderService,
    private codeGeneratorService: CodeGeneratorApi,
    private shareService: ShareService,
    private toastService: ToastService,
    private eventService: EventService<LIST_EVENTS>,
  ) {
    this.createForm();
  }

  initComponent(): void {
    if (this.viewType == FORM_MODE.VIEW) {
      this.viewMode = true;
      this.disableInputs();
    } else {
      this.toChangeUpdateMode();
      this.formGroup.get("code")?.disable();
    }

    if (!this.viewType) {
      this.generateCode();
      this.partDto = {};
    } else if (this.id) {
      this.getView(this.id);
    }
  }

  /**
   * Initializes the configuration for the part table.
   *
   * @returns {Config} The configuration object for the part table.
   */
  initPartTable(): Config {
    return {
      limitPerPage: 30,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      id: "Part_Price_Table",
      list: [
        {
          type: FieldType.date,
          id: "PART_TABLE_START_DATE",
          label: "PART.TABLE.START_DATE",
          field: "fromDate",
          minWidth: 50,
          width: 113,
          sortable: false,
          translator: (value) => {
            return value ? this.shareService.getJalaliDate(value) : "-";
          },
        },
        {
          type: FieldType.date,
          id: "PART_TABLE_END_DATE",
          label: "PART.TABLE.END_DATE",
          field: "toDate",
          minWidth: 50,
          width: 113,
          sortable: false,
          translator: (value) => {
            return value ? this.shareService.getJalaliDate(value) : "-";
          },
        },
        {
          type: FieldType.price,
          id: "PART_TABLE_PRICE",
          label: "PART.TABLE.PRICE",
          field: "price",
          minWidth: 50,
          width: 110,
          sortable: false,
        },
      ],
      actions: [
        {
          id: "DATATABLE_EDIT",
          icon: "isax isax-edit-2",
          tooltip: "DATATABLE.EDIT",
          permission: [this.permission.PART_PRICE_UPDATE],
          label: "DATATABLE.EDIT",
          action: (row): void => this.openPartPriceForm(row, true),
        },
        {
          id: "DATATABLE_EDIT",
          icon: "isax isax-trash",
          tooltip: "DATATABLE.DELETE",
          label: "DATATABLE.DELETE",
          permission: [this.permission.PART_PRICE_DELETE],
          action: (row): void => this.deleteRow(row),
        },
      ],
    };
  }

  onSave() {
    this.loaderService.setLoading(true);
    this.partDto = {
      ...this.partDto,
      ...this.formGroup.value,
    };

    if (this.partDto.id) {
      this.partApi
        .updatePartById(this.partDto.id, this.partDto)
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          next: () => {
            this.viewMode = true;
            this.disableInputs();
            this.toastService.success("PART.MESSAGES.UPDATE_SUCCESS_PART");
          },
        });
    } else {
      this.partApi
        .createPart(this.partDto)
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          next: (res) => {
            this.partDto = res;
            this.disableInputs();
            this.toastService.success("PART.MESSAGES.CREATION_SUCCESS_PART");
          },
        });
    }
  }

  /**
   * Enables all form controls and updates their values and validity.
   *
   * @returns {void}
   */
  toChangeUpdateMode(): void {
    this.viewMode = false;
    _.forEach(this.formGroup.controls, (control) => {
      control.enable();
      control.updateValueAndValidity();
    });
  }

  /**
   * Disable all form controls and updates their values and validity.
   *
   * @returns {void}
   */
  disableInputs(): void {
    _.forEach(this.formGroup.controls, (control) => {
      control.disable();
      control.updateValueAndValidity();
    });
  }

  /**
   * Creates the form part for the part definition.
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
      this.partDto = {
        ...this.partDto,
        ...val,
      };
    });
  }

  getView(id: number) {
    this.loaderService.setLoading(true);
    this.partApi
      .getPartById(id)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((value) => {
        this.loaderService.setLoading(true);
        this.editCode = value.code!;
        this.formGroup.patchValue(value);
        this.partDto = value;
        this.partPrices = this.partDto.partPriceList || [];
      });
  }

  deleteRow(row: any): void {
    this.dialogService
      .showConfirm({
        image: "assets/img/modal_icon.png",
        contentMessage: "MESSAGES.DELETE_CONFIRM",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res && row?.id) {
          this.partApi.deletePartPriceById(row?.id).subscribe({
            next: () => {
              this.dialogService.dismissAll();
              this.partDto.id && this.getView(this.partDto.id);
              this.toastService.success("PART.MESSAGES.COST_DELETE");
            },
          });
        }
      });
  }

  generateCode() {
    this.codeGeneratorService
      .generateCode(GeneratorEntityType.PART)
      .subscribe((result) => {
        if (result) {
          this.partDto.code = result.code;
          this.formGroup.get("code")?.setValue(result.code);
        }
      });
  }

  showFormInViewMode(row: any): void {
    if (!this.viewMode) {
      this.viewType = FORM_MODE.VIEW;
      this.openPartPriceForm(row, false);
    }
  }

  openPartPriceForm(row: any, editMode: boolean): void {
    this.dialogService
      .showWithFormComponent(FormModalComponent, {
        referenceContent: PartPriceFormComponent,
        title: "PART.FORM.PRICE",
        data: {
          viewType: editMode ? FORM_MODE.UPDATE : FORM_MODE.VIEW,
          ...row,
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res.saved) {
          this.getView(this.partDto.id!);
        }
        this.viewType = FORM_MODE.CREATE;
      });
  }

  goToList() {
    this.dialogService
      .showConfirm({
        title: "ASSET.MESSAGES.BACK_TO_LIST_TITLE",
        contentMessage: "ASSET.MESSAGES.BACK_TO_LIST",
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.router.navigate(["maintenance/base-info/part/list"]);
        }
      });
  }

  protected readonly UserType = UserType;
}
