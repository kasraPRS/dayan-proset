import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { RepairPlanning } from "@proset/maintenance-client";

@Injectable({
  providedIn: "root",
})
export class RepairPlanningTransferService {
  transferData = new BehaviorSubject<RepairPlanning>({});
}
