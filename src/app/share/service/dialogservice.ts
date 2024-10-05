import { Injectable } from "@angular/core";

import {
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { ScopeVars } from "../datatable/type";

@Injectable({
  providedIn: "root",
})
export class DialogService {
  constructor(private modalService: NgbModal) {}

  showWithComponent(content: any, scopeVars: ScopeVars): NgbModalRef {
    const option: NgbModalOptions = {
      size: scopeVars.size,
      scrollable: true,
      backdrop: "static",
      keyboard: false,
    };
    const modalRef = this.modalService.open(content, option);
    modalRef.componentInstance.scopeVars = scopeVars;
    return modalRef;
  }
}
