import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Optional,
  Self,
} from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
  selector: "input[numbersOnly]",
})
export class NumbersOnlyDirective {
  @Input() allowFloat: boolean = false;

  constructor(
    private el: ElementRef,
    @Optional() @Self() private ngControl: NgControl,
  ) {}

  navigationKeys: Array<string> = [
    "Backspace",
    "ArrowLeft",
    "ArrowRight",
    "Tab",
  ]; //Add keys as per requirement
  @HostListener("input", ["$event"]) onEvent($event: Event) {
    const initialValue = this.el.nativeElement.value.replace(
      /[۰-۹]/g,
      (match: any) => {
        return "۰۱۲۳۴۵۶۷۸۹".indexOf(match).toString();
      },
    );

    const numberRegex = this.allowFloat ? /[^0-9.]/g : /[^0-9]/g;
    let newValue = initialValue.replace(numberRegex, "").replace(/^0+/, "");

    // If allowFloat is true, ensure that only one dot is present
    if (this.allowFloat) {
      const dotCount = newValue.split(".").length - 1;
      if (dotCount > 1) {
        newValue = newValue.slice(0, -1); // Remove the last character if there are more than one dots
      }
    }
    this.el.nativeElement.value = newValue;
    // Update the form control value if it exists
    if (this.ngControl && this.ngControl.control) {
      this.ngControl.control.setValue(newValue, { emitEvent: false });
    }
  }

  @HostListener("keydown", ["$event"]) onKeyDown(e: KeyboardEvent) {
    if (
      // Allow: Delete, Backspace, Tab, Escape, Enter, etc
      this.navigationKeys.indexOf(e.key) > -1 ||
      (e.key === "a" && e.ctrlKey === true) || // Allow: Ctrl+A
      (e.key === "c" && e.ctrlKey === true) || // Allow: Ctrl+C
      (e.key === "v" && e.ctrlKey === true) || // Allow: Ctrl+V
      (e.key === "x" && e.ctrlKey === true) || // Allow: Ctrl+X
      (e.key === "a" && e.metaKey === true) || // Cmd+A (Mac)
      (e.key === "c" && e.metaKey === true) || // Cmd+C (Mac)
      (e.key === "v" && e.metaKey === true) || // Cmd+V (Mac)
      (e.key === "x" && e.metaKey === true) // Cmd+X (Mac)
    ) {
      return; // let it happen, don't do anything
    }

    const allowedKeys = [
      "۰",
      "۱",
      "۲",
      "۳",
      "۴",
      "۵",
      "۶",
      "۷",
      "۸",
      "۹",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
    ];
    if (e.key === " " || !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  }
}
