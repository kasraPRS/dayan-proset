import { DecimalPipe } from "@angular/common";
import { Directive, ElementRef, HostListener, OnInit } from "@angular/core";
import { AbstractControl, FormGroup, NgControl } from "@angular/forms";
import { take } from "rxjs";

@Directive({
  selector: "[inputPrice]",
})
export class InputPriceDirective implements OnInit {
  isEleFocus = false;

  constructor(
    private _DecimalPipe: DecimalPipe,
    private _el: ElementRef,
    private ngControl: NgControl,
  ) {}

  public ngOnInit(): void {
    // This for initial: init form before patchValue
    if (this.ngControl && this.ngControl.control) {
      const formGroup = this.getFormGroup(this.ngControl.control);
      formGroup?.valueChanges.pipe(take(1)).subscribe((res) => {
        const name = this.ngControl.name;
        if (name && res[name]) {
          this.setFormatCurrency(this.ngControl.value);
        }
      });

      this.ngControl.control.valueChanges.subscribe((val) => {
        this.setFormatCurrency(val);
      });
    }

    // This for initial: patchValue before init form
    if (this.ngControl && this.ngControl.value) {
      this.setFormatCurrency(this.ngControl.value);
    }

    this._el.nativeElement.setAttribute("autocomplete", "off");
    this._el.nativeElement.setAttribute("autocorrect", "off");
    this._el.nativeElement.setAttribute("autocapitalize", "none");
    this._el.nativeElement.setAttribute("spellcheck", "false");
  }

  setFormatCurrency(map: any) {
    if (!this.isEleFocus) {
      if (typeof map === "string") {
        map = +this._el.nativeElement.value.replace(/,/g, "");
      }
      if (map) {
        this._el.nativeElement.value = this._DecimalPipe.transform(map, "1.0");
      }
    }
  }

  @HostListener("input", ["$event.target.value"])
  onInput() {
    if (this._el.nativeElement.value != null) {
      const re = /[^0-9.]/g;
      re.test(this._el.nativeElement.value);
      this._el.nativeElement.value = this._el.nativeElement.value.replace(
        re,
        "",
      );
    }
  }

  @HostListener("focus")
  onFocus() {
    this.isEleFocus = true;

    if (this._el.nativeElement.value != null) {
      if (typeof this._el.nativeElement.value === "string") {
        this._el.nativeElement.value = this._el.nativeElement.value.replace(
          /,/g,
          "",
        );
      }
      if (typeof this._el.nativeElement.value === "number") {
        this._el.nativeElement.value = this._DecimalPipe.transform(
          this._el.nativeElement.value,
          "1.0",
        );
      }
    }
  }

  @HostListener("blur")
  onBlur() {
    this.isEleFocus = false;

    if (this._el.nativeElement.value) {
      if (typeof this._el.nativeElement.value === "string") {
        this.ngControl?.control?.setValue(
          +this._el.nativeElement.value.replace(/,/g, ""),
        );
        this._el.nativeElement.value = this._DecimalPipe.transform(
          +this._el.nativeElement.value.replace(/,/g, ""),
          "1.0",
        );
      } else {
        this._el.nativeElement.value = this._DecimalPipe.transform(
          this._el.nativeElement.value,
          "1.0",
        );
      }
    }
  }

  private getFormGroup(control: AbstractControl): FormGroup | null {
    let parent = control.parent;
    while (parent) {
      if (parent instanceof FormGroup) {
        return parent;
      }
      parent = parent.parent;
    }
    return null;
  }
}
