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
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { EmplacementLocationTreeDialogComponent } from "../emplacement-locations-tree-dialog/emplacement-locations-tree-dialog.component";

@Component({
  selector: "proset-emplacement-locations-tree-select",
  templateUrl: "./emplacement-locations-tree-select.component.html",
  styleUrls: ["./emplacement-locations-tree-select.component.less"],
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
      useExisting: forwardRef(() => EmplacementLocationTreeSelectComponent),
      multi: true,
    },
  ],
})
export class EmplacementLocationTreeSelectComponent
  implements OnInit, ControlValueAccessor
{
  @Output() emplacementLocationChange = new EventEmitter<any>();
  @Input() required = false;
  @Input() disabled = false;
  @Input() multiple = false;
  @Input() objective = true;
  @Input() placeholder = "";
  @Input() emplacementLocationId: number;
  form: FormGroup;
  selectedEmplacementLocations: any = [];

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
  ) {
    this.form = this.formBuilder.group({
      emplacementLocationInput: [{ value: "", disabled: this.disabled }],
    });
  }

  ngOnInit(): void {
    this.form
      .get("emplacementLocationInput")
      ?.valueChanges.subscribe((value) => {
        this.onTouched();
      });
  }

  writeValue(value: any): void {
    if (value) {
      if (!this.objective) {
        this.selectedEmplacementLocations = this.multiple
          ? value.map((a: any) => a.id)
          : value[0].id;
      } else {
        this.selectedEmplacementLocations = this.multiple ? value : value[0];
      }

      this.selectedEmplacementLocations = Array.isArray(value)
        ? value
        : [value];
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
      this.form.get("emplacementLocationInput")?.disable();
    } else {
      this.form.get("emplacementLocationInput")?.enable();
    }
  }

  openEmplacementLocationDialog() {
    const dialogRef = this.dialog.open(EmplacementLocationTreeDialogComponent, {
      minWidth: "600px",
      height: "calc(100% - 30px)",
      maxHeight: "100%",
      data: {
        emplacementLocationId: this.emplacementLocationId,
        multiple: this.multiple,
        initialSelection: this.selectedEmplacementLocations,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedEmplacementLocations = result;
        this.updateInputValue();
        let emitValue: any;
        if (!this.objective) {
          emitValue = this.multiple
            ? this.selectedEmplacementLocations.map((a: any) => a.id)
            : this.selectedEmplacementLocations[0].id;
        } else {
          emitValue = this.multiple
            ? this.selectedEmplacementLocations
            : this.selectedEmplacementLocations[0];
        }
        this.emplacementLocationChange.emit(emitValue);
        this.onChange(emitValue);
        this.onTouched();
      }
    });
  }

  private updateInputValue() {
    const inputValue = this.selectedEmplacementLocations
      .map((emplacementLocation: any) => emplacementLocation.name)
      .join(", ");
    this.form.get("emplacementLocationInput")?.setValue(inputValue);
  }

  clear() {
    this.form.reset();
    this.emplacementLocationChange.emit(null);
    this.onChange(null as any);
    this.onTouched();
    this.selectedEmplacementLocations = [];
  }
}
