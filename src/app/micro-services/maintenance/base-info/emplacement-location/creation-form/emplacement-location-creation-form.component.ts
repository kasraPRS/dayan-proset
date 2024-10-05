import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  CodeGeneratorApi,
  EmplacementLocationApi,
  GeneratorEntityType,
} from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { LoaderService } from "src/app/share/service/loader.service";
import { ProsetDialogService } from "src/app/share/service/proset-dialog.service";
import { EmplacementLocationWithParent } from "../types/emplacement-location-with-parent";
import { MessageType } from "../types/message";
import { DialogComponentForm } from "src/app/share/model/dialog-component-form";
import { FORM_MODE, LIST_EVENTS } from "src/app/share/enums/enums";
import { FormModalComponent } from "src/app/share/modal-component/form-modal/form-modal.component";
import { EventService } from "src/app/share/service/event.service";

@Component({
  selector: "proset-emplacement-location-form",
  templateUrl: "./emplacement-location-creation-form.component.html",
  styleUrl: "./emplacement-location-creation-form.component.less",
})
export class EmplacementLocationCreationFormComponent
  implements OnInit, DialogComponentForm
{
  @Output() closeEmplacementLocationForm = new EventEmitter<boolean>();
  @Output() triggerToShowMessage = new EventEmitter<MessageType>();

  submitType: FORM_MODE;
  emplacementLocationObject: EmplacementLocationWithParent;

  permission = UserPermissions;

  emplacementLocationFormData: FormGroup;
  isDuplicatedCode = false;

  FORM_MODE = FORM_MODE;
  viewMode = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogService: ProsetDialogService,
    private _emplacementLocationApi: EmplacementLocationApi,
    private _codeGeneratorService: CodeGeneratorApi,
    private _loaderService: LoaderService,
    private _eventService: EventService<LIST_EVENTS>,
  ) {
    this.emplacementLocationFormData = this._formBuilder.group({
      code: [{ value: null, disabled: true }, Validators.required],
      name: [null, Validators.required],
      address: [null],
      description: [null],
      parentId: [null],
    });
  }

  ngOnInit(): void {}

  initComponent(data: any): void {
    const { viewType, ...formVal } = data;
    this.viewMode = viewType == FORM_MODE.VIEW;
    this.submitType = viewType;
    this.emplacementLocationObject = formVal;
    switch (viewType) {
      case FORM_MODE.VIEW:
        this.setValueToUpdateEmplacementLocation();
        this.emplacementLocationFormData.disable();
        break;
      case FORM_MODE.UPDATE:
        this.setValueToUpdateEmplacementLocation();
        break;
      case FORM_MODE.CREATE:
        this.resetForm();
        this.emplacementLocationFormData.enable();
        this.emplacementLocationFormData.get("code")?.disable();
        this.generateCode(this.emplacementLocationObject?.parent?.id);
        break;
    }
  }
  onSave(onSuccess: (e?: any) => void): void {
    let value = this.emplacementLocationFormData.getRawValue();
    switch (this.submitType) {
      case FORM_MODE.CREATE:
        value.parentId = this.emplacementLocationObject.parent?.id;
        this.submit(value);
        break;
      case FORM_MODE.UPDATE:
        this.emplacementLocationObject.id &&
          this.updateEmplacementLocationById(
            this.emplacementLocationObject.id,
            value,
          );
        break;
    }
  }

  onClose(): void {
    this.close();
  }

  onEdit() {
    this.close();
    this._dialogService
      .showWithFormComponent(FormModalComponent, {
        referenceContent: EmplacementLocationCreationFormComponent,
        title: "EMPLACEMENT_LOCATION.FORM.DEFINITION",
        minWidth: 500,
        data: {
          viewType: FORM_MODE.UPDATE,
          ...this.emplacementLocationObject,
        },
      })
      .afterClosed()
      .subscribe(() => {
        this._eventService.emit(LIST_EVENTS.RELOAD_LIST);
      });
  }

  getFormGroup(): FormGroup {
    return this.emplacementLocationFormData;
  }

  setValueToUpdateEmplacementLocation() {
    const { children, ...value } = this.emplacementLocationObject;
    this.emplacementLocationFormData.patchValue(value);
  }

  close() {
    this._dialogService.dismissAll();
    this.closeEmplacementLocationForm.emit(false);
  }

  submit(emplacementLocation: EmplacementLocationWithParent) {
    this._loaderService.setLoading(true);

    this._emplacementLocationApi
      .createEmplacementLocation(emplacementLocation)
      .pipe(
        finalize(() => {
          this._loaderService.setLoading(false);
        }),
      )
      .subscribe({
        next: () => {
          this.triggerToShowMessage.emit({
            type: "success",
            text: "EMPLACEMENT_LOCATION.MESSAGES.CREATION_SUCCESS_EMPLACEMENT_LOCATION",
          });
          this.close();
        },
        error: (error) => {
          if (error.status !== 406) {
            this.triggerToShowMessage.emit({
              type: "error",
              text: "MESSAGES.SERVER_ERROR",
            });
          }
        },
      });
  }

  resetForm() {
    this.emplacementLocationFormData.reset();
  }

  deletEmplacementLocationById(id?: number) {
    this._dialogService
      .showConfirm({
        title: "EMPLACEMENT_LOCATION.FORM.EMPLACEMENT_LOCATION",
        contentMessage:
          "EMPLACEMENT_LOCATION.MESSAGES.DELETE_EMPLACEMENT_LOCATION",
      })
      .afterClosed()
      .subscribe((result) => {
        if (result && id) {
          this._loaderService.setLoading(true);
          this._emplacementLocationApi
            .deleteEmplacementLocationById(id)
            .pipe(
              finalize(() => {
                this._loaderService.setLoading(false);
              }),
            )
            .subscribe({
              next: () => {
                this.close();
                this._eventService.emit(LIST_EVENTS.RELOAD_LIST);
              },
              error: (error) => {
                this._loaderService.setLoading(false);
              },
            });
        }
      });
  }

  updateEmplacementLocationById(
    id: number,
    emplacementLocation: EmplacementLocationWithParent,
  ) {
    this._loaderService.setLoading(true);
    this._emplacementLocationApi
      .updateEmplacementLocationById(id, emplacementLocation)
      .pipe(
        finalize(() => {
          this._loaderService.setLoading(false);
        }),
      )
      .subscribe({
        next: () => {
          this.triggerToShowMessage.emit({
            type: "success",
            text: "EMPLACEMENT_LOCATION.MESSAGES.UPDATE_SUCCESS_EMPLACEMENT_LOCATION",
          });
          this.close();
        },
        error: (err) => {
          this._loaderService.setLoading(false);
        },
      });
  }

  generateCode(parentId?: number) {
    this._loaderService.setLoading(true);
    this._codeGeneratorService
      .generateCode(GeneratorEntityType.EMPLACEMENT_LOCATION, parentId)
      .pipe(
        finalize(() => {
          this._loaderService.setLoading(false);
        }),
      )
      .subscribe((result) => {
        if (result) {
          this.emplacementLocationFormData
            .get("code")
            ?.patchValue(result.code, { emitEvent: false });
        }
      });
  }
}
