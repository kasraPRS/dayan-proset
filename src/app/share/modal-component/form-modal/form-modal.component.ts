import { NgTemplateOutlet } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContainer,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from "@angular/material/dialog";
import { MatAccordion } from "@angular/material/expansion";
import { TranslateModule } from "@ngx-translate/core";
import { ScopeVars } from "../../datatable/type";
import { FORM_MODE } from "../../enums/enums";
import { DialogComponentForm } from "../../model/dialog-component-form";

@Component({
  selector: "proset-form-modal",
  templateUrl: "./form-modal.component.html",
  styleUrl: "./form-modal.component.less",
  standalone: true,
  imports: [
    MatDialogContent,
    NgTemplateOutlet,
    MatButton,
    MatDialogActions,
    TranslateModule,
    MatDialogContainer,
    MatAccordion,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogModule,
  ],
})
export class FormModalComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("targetComponent", { read: ViewContainerRef })
  vcRef!: ViewContainerRef;
  private componentRef!: ComponentRef<DialogComponentForm>;

  @Input() title: string;
  @Input() submitDisabled = false;
  @Input() imageSrc: string;

  @Input() submitHidden = false;
  @Input() closeButtonText: string;
  @Input() extraButtonText: string;
  @Output() onSubmit: EventEmitter<void> = new EventEmitter<void>();
  scopeVars: ScopeVars;
  formGroup: FormGroup;
  viewMode = false;

  constructor(
    private dialogRef: MatDialogRef<FormModalComponent>,
    private detectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      component: any;
      data: any;
    },
  ) {
    this.scopeVars = data;
  }

  ngAfterViewInit() {
    this.componentRef = this.vcRef.createComponent(
      this.scopeVars.referenceContent,
    );
    this.viewMode = this.scopeVars.data?.viewType == FORM_MODE.VIEW;
    this.componentRef.instance.initComponent({ ...this.scopeVars.data });
    this.formGroup = this.componentRef.instance.getFormGroup();
    this.detectorRef.detectChanges();
  }
  onClose() {
    this.componentRef.instance.onClose();
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.title = this.scopeVars.title!;
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
  onSave(): void {
    this.componentRef.instance.onSave(() => {
      this.componentRef.instance.onClose();
      this.dialogRef.close({ saved: true, data: this.formGroup.getRawValue() });
    });
  }
}
