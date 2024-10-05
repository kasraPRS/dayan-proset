import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { flattenObjectToArray } from "../helper/flatten";
@Injectable({
  providedIn: "root",
})
export class SidebarService {
  filterList: any[] = [];
  private sidenavMode = new BehaviorSubject<boolean>(false);
  sidenavMode$ = this.sidenavMode.asObservable();

  set_sidenavMode(sidenavMode: boolean) {
    this.sidenavMode.next(sidenavMode);
  }
  updateFilterList(obj: any) {
    if (obj) {
      return [...this.filterList, ...flattenObjectToArray(obj)];
    } else {
      return this.filterList;
    }
  }
}
