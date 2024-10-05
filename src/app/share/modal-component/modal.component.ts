import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-modal-component",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.less"],
})
export class ModalComponent implements OnInit {
  @Input() title: string;
  @Input() submitDisabled = false;
  @Input() imageSrc: string;

  @Input() submitHidden = false;

  @Input() submitButtonText: string;
  @Input() closeButtonText: string;
  @Input() extraButtonText: string;
  @Output() onSubmit: EventEmitter<void> = new EventEmitter<void>();
  @Output() onExtraButton: EventEmitter<void> = new EventEmitter<void>();

  constructor(private ngbActiveModal: NgbActiveModal) {}

  onClose() {
    this.ngbActiveModal.close();
  }

  ngOnInit(): void {}

  showExtraButton(): boolean {
    return this.extraButtonText !== undefined;
  }

  submit(): void {
    this.onSubmit.emit();
  }

  clickExtraButton(): void {
    this.onExtraButton.emit();
  }
}
