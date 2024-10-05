import { Directive, Output, EventEmitter, HostListener } from "@angular/core";

@Directive({
  selector: "[clickOutsideSidebar]",
})
export class ClickOutsideSidebarDirective {
  constructor() {}
  @Output() clickOutside: EventEmitter<boolean> = new EventEmitter<boolean>(
    false,
  );

  @HostListener("document:click", ["$event"]) onMouseEnter(event: MouseEvent) {
    const targetEl: any = event.target;
    const clickOnDatePicker = targetEl?.classList?.contains(
      "mat-calendar-body-cell-content",
    );

    const otherDialog = targetEl.closest(".mdc-dialog__container");

    const clickedInside =
      this.handleSidebarClick(event) || clickOnDatePicker || otherDialog;
    if (!clickedInside) {
      this.clickOutside.emit(false);
    }
  }

  handleSidebarClick(event: MouseEvent) {
    // Get the clicked coordinates relative to the viewport
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Get the sidebar element
    const sidebarElement = document.getElementById("sidebar") as HTMLElement;

    // Get the bounding rectangle of the sidebar element
    const sidebarRect = sidebarElement.getBoundingClientRect();

    // Get the width and height of the sidebar element
    const sidebarWidth = sidebarRect.width;
    const sidebarHeight = sidebarRect.height;

    // Calculate the left and top offsets of the sidebar element
    const sidebarLeft = sidebarRect.left;
    const sidebarTop = sidebarRect.top;

    // Calculate the coordinates relative to the sidebar's viewport
    const mouseXRelativeToSidebar = mouseX - sidebarLeft;
    const mouseYRelativeToSidebar = mouseY - sidebarTop;

    // Check if the click occurred inside the sidebar element
    if (
      mouseXRelativeToSidebar >= 0 &&
      mouseYRelativeToSidebar >= 0 &&
      mouseXRelativeToSidebar <= sidebarWidth &&
      mouseYRelativeToSidebar <= sidebarHeight
    ) {
      return true;
    } else {
      return false;
    }
  }
}
