import {
  Component,
  Input,
  forwardRef,
  OnInit,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";
import { AssetApi } from "@proset/maintenance-client";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { AssetTreeDialogComponent } from "../asset-tree-dialog/asset-tree-dialog.component";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "proset-asset-tree-select",
  templateUrl: "./asset-tree-select.component.html",
  styleUrls: ["./asset-tree-select.component.less"],
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AssetTreeSelectComponent),
      multi: true,
    },
  ],
})
export class AssetTreeSelectComponent implements OnInit, ControlValueAccessor {
  @Output() assetChange = new EventEmitter<any>();
  @Input() required = false;
  @Input() disabled = false;
  @Input() multiple = false;
  @Input() objective = true;
  @Input() placeholder = "";
  @Input() assetId: number;
  form: FormGroup;
  selectedAssets: any = [];

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
  ) {
    this.form = this.formBuilder.group({
      assetInput: [{ value: "", disabled: this.disabled }],
    });
  }

  ngOnInit(): void {
    this.form.get("assetInput")?.valueChanges.subscribe((value) => {
      this.onTouched();
    });
  }

  writeValue(value: any): void {
    if (value) {
      if (!this.objective) {
        this.selectedAssets = this.multiple
          ? value.map((a: any) => a.id)
          : value[0].id;
      } else {
        this.selectedAssets = this.multiple ? value : value[0];
      }

      this.selectedAssets = Array.isArray(value) ? value : [value];
      this.updateInputValue();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (!this.disabled) {
      this.disabled = isDisabled;
    }

    if (this.disabled) {
      this.form.get("assetInput")?.disable();
    } else {
      this.form.get("assetInput")?.enable();
    }
  }

  openAssetDialog() {
    const dialogRef = this.dialog.open(AssetTreeDialogComponent, {
      minWidth: "600px",
      height: "calc(100% - 30px)",
      maxHeight: "100%",
      data: {
        assetId: this.assetId,
        multiple: this.multiple,
        initialSelection: this.selectedAssets,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedAssets = result;
        this.updateInputValue();
        let emitValue: any;
        if (!this.objective) {
          emitValue = this.multiple
            ? this.selectedAssets.map((a: any) => a.id)
            : this.selectedAssets[0].id;
        } else {
          emitValue = this.multiple
            ? this.selectedAssets
            : this.selectedAssets[0];
        }
        this.assetChange.emit(emitValue);
        this.onChange(emitValue);
        this.onTouched();
      }
    });
  }

  private updateInputValue() {
    const inputValue = this.selectedAssets
      .map((asset: any) => asset.name)
      .join(", ");
    this.form.get("assetInput")?.setValue(inputValue);
  }

  clear() {
    this.form.reset();
    this.assetChange.emit(null);
    this.onChange(null as any);
    this.onTouched();
    this.selectedAssets = [];
  }
}
