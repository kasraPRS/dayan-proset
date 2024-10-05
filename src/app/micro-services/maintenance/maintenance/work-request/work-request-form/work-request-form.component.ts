import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import {
  AssetInfo,
  CodeGeneratorApi,
  FailureDetectionMethod,
  FailureDetectionMethodApi,
  FailureModeApi,
  GeneratorEntityType,
  Person,
  PersonInfo,
  Priority,
  UserType,
  WorkRequest,
  WorkRequestApi,
  WorkRequestStatus,
} from "@proset/maintenance-client";
import { FailureMode } from "@proset/maintenance-client/model/failureMode";
import { finalize } from "rxjs";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { FORM_MODE } from "src/app/share/enums/enums";
import { LoaderService } from "src/app/share/service/loader.service";
import { ToastService } from "src/app/share/service/toast.service";
import { flattenObject } from "../../../../../share/helper/flatten";
import { DescriptionModel } from "../../../../../share/model/confirm-modal-description.model";
import { ProsetDialogService } from "../../../../../share/service/proset-dialog.service";
import { WORK_ORDER_DATA_ENTRY_TYPES } from "../../work-order/enums/work-order.enum";

@Component({
  selector: "proset-request-form",
  templateUrl: "./work-request-form.component.html",
  styleUrl: "./work-request-form.component.less",
})
export class WorkRequestFormComponent implements OnInit {
  @Input() requestId: number;
  @Input() requestCode: string;
  @Input() viewType: string;
  form: FormGroup;
  code: string;
  userType = UserType;
  person: Person;
  isCodeInvalid: boolean = false;
  asset: AssetInfo = {};
  requestDto: WorkRequest;
  priorityItemList = Object.keys(Priority).reverse();
  viewMode: boolean = false;
  status = WorkRequestStatus;
  todayDate: Date = new Date();
  failureMode: FailureMode[] = [];
  permission = UserPermissions;

  constructor(
    private formBuilder: FormBuilder,
    private dialogService: ProsetDialogService,
    private loaderService: LoaderService,
    private codeGenerator: CodeGeneratorApi,
    private router: Router,
    private toastService: ToastService,
    private requestApi: WorkRequestApi,
    private _failureApi: FailureModeApi,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getParams();
  }

  initForm() {
    this.form = this.formBuilder.group({
      requestDate: [new Date(), Validators.required],
      code: [null, [Validators.required]],
      name: [null, Validators.required],
      applicant: [null, Validators.required],
      asset: [null, Validators.required],
      failureDetectionMethod: [null, Validators.required],
      failureModeList: [{ value: null, disabled: true }, [Validators.required]],
      priority: [null],
      description: [null],
      rejectDescription: [null],
    });
  }

  visibilityAsset(asset: any) {
    if (asset) {
      this.form.get("failureModeList")?.enable();
    } else {
      this.form.get("failureModeList")?.disable();
    }
    this.asset = asset!;
    this.form.controls["asset"].patchValue(this.asset);
  }

  getParams() {
    if (this.requestId) {
      this.getRequestById(this.requestId);
    } else if (this.requestCode) {
      this.getRequestByCode(this.requestCode);
    } else {
      this.generateCode();
    }
    if (this.viewType === FORM_MODE.VIEW) {
      this.visibilityActionAction(true);
    }
  }

  onPersonChange(person: PersonInfo) {
    this.form.controls["applicant"].patchValue(person);
    this.person = person;
  }

  generateCode(): void {
    this.loaderService.setLoading(true);
    this.codeGenerator
      .generateCode(GeneratorEntityType.WORK_REQUEST)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((response) => {
        this.form.controls["code"].setValue(response.code);
      });
  }

  assetChange(asset: AssetInfo[] | AssetInfo) {
    this.failureMode = [];
    this.form.controls["failureModeList"].patchValue(null);
    this.asset = asset as AssetInfo;
    this.form.controls["asset"].patchValue(asset);
    this.getAllFailureModeByAsset(Number(this.asset.id));
    this.visibilityAsset(asset);
  }

  getAllFailureModeByAsset(id: number) {
    this.loaderService.setLoading(true);
    this._failureApi
      .getAllFailureModeByAsset(id)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((response) => {
        if (response) {
          this.failureMode = response;
        }
      });
  }

  actionModalRejected(): void {
    this.dialogService
      .showConfirm({
        image: "assets/img/modal_icon.png",
        contentMessage: "REQUEST.MESSAGES.DELETE_CONFIRM",
        hasDescription: true,
      })
      .afterClosed()
      .subscribe((result: DescriptionModel) => {
        if (result.status) {
          const rejectDescription = result.description;
          this.loaderService.setLoading(true);
          this.requestDto.status = this.status.REJECTED;
          if (result.description !== undefined) {
            this.updateRequestStatus(
              this.requestDto.id!,
              this.requestDto.status,
              rejectDescription,
            );
            this.getRequestById(this.requestDto.id!);
          } else {
            this.updateRequestStatus(
              this.requestDto.id!,
              this.requestDto.status,
            );
          }
          this.getRequestById(this.requestDto.id!);
        } else {
          return;
        }
      });
  }

  goToList() {
    this.dialogService
      .showConfirm({
        size: "l",
        contentMessage: "REQUEST.MESSAGES.RETURN_TO_LIST",
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.router.navigateByUrl(
            "/maintenance/maintenance/work-request/list",
          );
        }
      });
  }

  actionModalAccept() {
    this.dialogService
      .showConfirm({
        size: "l",
        contentMessage: "REQUEST.MODAL.ACCEPTED_REQUEST_TEXT",
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loaderService.setLoading(true);
          this.updateRequestStatus(this.requestDto.id!, this.status.ACCEPTED);

          this.getRequestById(this.requestDto.id!);
        }
      });
  }

  actionModalWaitForAccept() {
    this.dialogService
      .showConfirm({
        size: "l",
        image: "assets/img/modal_icon.png",
        contentMessage: "REQUEST.MODAL.WAIT_FOR_ACCEPT_REQUEST_TEXT",
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loaderService.setLoading(true);
          this.updateRequestStatus(
            this.requestDto.id!,
            this.status.WAIT_FOR_ACCEPT,
          );
          this.getRequestById(this.requestDto.id!);
        }
      });
  }

  getRequestById(requestId: number) {
    this.loaderService.setLoading(true);
    this.requestApi
      .getWorkRequestById(requestId)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe({
        next: (response: WorkRequest) => {
          this.requestDto = {};
          this.requestDto = response;
          this.form.patchValue(this.requestDto);
          this.assetChange(this.requestDto.asset!);
          this.onPersonChange(this.requestDto.applicant as Person);
          this.form.controls["failureModeList"].patchValue(
            this.requestDto.failureModeList,
          );
        },
      });
  }

  getRequestByCode(requestCode: string) {
    this.loaderService.setLoading(true);
    this.requestApi
      .getWorkRequestByCode(requestCode)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe({
        next: (response: WorkRequest) => {
          this.requestDto = {};
          this.requestDto = response;
          this.form.patchValue(this.requestDto);
          this.assetChange(this.requestDto.asset!);
          this.onPersonChange(this.requestDto.applicant as Person);
          this.form.controls["failureModeList"].patchValue(
            this.requestDto.failureModeList,
          );
        },
      });
  }

  updateAction() {
    this.requestDto.requestDate = this.form.value.requestDate;
    this.requestDto.name = this.form.value.name;
    this.requestDto.code = this.form.value.code;
    this.requestDto.asset = this.form.value.asset;
    this.requestDto.priority = this.form.value.priority;
    this.requestDto.description = this.form.value.description;
    this.requestDto.failureModeList = this.form.value.failureModeList;
    this.loaderService.setLoading(true);
    this.updateRequestById(flattenObject(this.requestDto));
  }

  updateRequestById(value: WorkRequest) {
    this.loaderService.setLoading(true);
    this.requestApi
      .updateWorkRequestById(this.requestDto.id!, value)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe({
        next: (response) => {
          this.toastService.success("REQUEST.MESSAGES.UPDATE_SUCCESS");
          this.getRequestById(response.id!);
          this.visibilityActionAction(true);
        },
      });
  }

  updateRequestStatus(
    id: number,
    status: WorkRequestStatus,
    rejectDescription?: string,
  ) {
    this.loaderService.setLoading(true);
    this.requestApi
      .updateStatusById(id, status, rejectDescription)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe({
        next: (response: WorkRequest) => {
          this.toastService.success("REQUEST.MESSAGES.UPDATE_SUCCESS");
          this.getRequestById(response?.id!);
          this.visibilityActionAction(true);
        },
      });
  }

  createRequest() {
    if (this.form.invalid) {
      return;
    } else {
      this.loaderService.setLoading(true);
      this.requestDto = {
        ...this.form.value,
      };
      this.requestApi
        .createWorkRequest(flattenObject(this.requestDto))
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          next: (response: WorkRequest) => {
            this.toastService.success("REQUEST.MESSAGES.INSERT_SUCCESS");
            this.getRequestById(response.id!);
            this.visibilityActionAction(true);
          },
        });
    }
  }

  visibilityActionAction(view: boolean) {
    this.viewMode = view;
    this.form.updateValueAndValidity();
  }

  onSubmitWorkOrder(): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        "maintenance/maintenance/work-order",
        WORK_ORDER_DATA_ENTRY_TYPES.CREATE_WORK_ORDER_FROM_WORK_REQUEST,
        FORM_MODE.CREATE,
        "id",
        this.requestDto?.id,
      ]),
    );
    window.open(url, "_blank");
  }

  onOpenFailureMode() {
    window.open("maintenance/asset/failure-mode/list", "_blank");
  }
}
