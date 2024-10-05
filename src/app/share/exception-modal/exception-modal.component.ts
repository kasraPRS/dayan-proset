import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-exception-modal",
  templateUrl: "./exception-modal.component.html",
  styleUrls: ["./exception-modal.component.less"],
})
export class ExceptionModalComponent {
  @Input() title: string;

  constructor(private ngbActiveModal: NgbActiveModal) {}

  onClose(): void {
    this.ngbActiveModal.close();
  }
}
