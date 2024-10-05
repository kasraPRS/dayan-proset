import { NumbersOnlyDirective } from "./numbers-only.directive";
import { ElementRef } from "@angular/core";
import { NgControl } from "@angular/forms";

describe("NumbersOnlyDirective", () => {
  let _el: ElementRef;
  let control: NgControl;
  it("should create an instance", () => {
    const directive = new NumbersOnlyDirective(_el, control);
    expect(directive).toBeTruthy();
  });
});
