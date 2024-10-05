import { Injectable } from "@angular/core";
import {
  PartApi,
  PartPrice,
  WorkLogActivity,
  WorkLogCheckListTask,
  WorkLogContractor,
  WorkLogPart,
  WorkLogPersonnel,
  WorkOrder,
} from "@proset/maintenance-client";
import * as _ from "lodash";
import { TranslateService } from "@ngx-translate/core";
import { WorkLogPersonnelModel } from "../model/WorkLogPersonnel.model";
import { WorkLogContractorModel } from "../model/WorkLogContractor.model";
import { BehaviorSubject } from "rxjs";
import * as moment from "jalali-moment";
import { WorkLogTaskModel } from "../model/workLogTask.model";

@Injectable({
  providedIn: "root",
})
export class WorkOrderService {
  constructor(
    private translateService: TranslateService,
    private partApi: PartApi,
  ) {}
  private _workOrder: WorkOrder;
  set workOrder(workOrder: WorkOrder) {
    this._workOrder = workOrder;
  }

  get workOrder(): WorkOrder {
    return this._workOrder;
  }

  workLogPersonnelList: WorkLogPersonnel[] = [];
  workLogContractorList: WorkLogContractor[] = [];
  workLogPartList: WorkLogPart[] = [];
  workLogActivityList: WorkLogActivity[] = [];
  workLogCheckListTasks: WorkLogTaskModel[] = [];
  isWorkLogActivityInvalid = new BehaviorSubject<boolean>(true);
  isWorkLogPersonInvalid = new BehaviorSubject<boolean>(true);
  prepareWorkingLogPersonnelPresent(): WorkLogPersonnelModel[] {
    let personnelPresentList: WorkLogPersonnelModel[] = [];
    const hour: string = this.translateService.instant("GENERAL.HOUR");
    const minute: string = this.translateService.instant("GENERAL.MINUTE");
    _.forEach(this.workLogPersonnelList, (personnel) => {
      let workLogPersonnelModel: WorkLogPersonnelModel = {};
      const workingHour =
        personnel.workingHour != null ? personnel.workingHour : 0;
      const workingMinute =
        personnel.workingMinute != null ? personnel.workingMinute : 0;
      const overTimeHour =
        personnel.overTimeHour != null ? personnel.overTimeMinute : 0;
      const overTimeMinute =
        personnel.overTimeMinute != null ? personnel.overTimeMinute : 0;
      workLogPersonnelModel.person = personnel.person;
      workLogPersonnelModel.workingHourPresent =
        workingHour + hour + " , " + workingMinute + minute;
      workLogPersonnelModel.overTimeHourPresent =
        overTimeHour + hour + " , " + overTimeMinute + minute;
      workLogPersonnelModel.sum = personnel.sum;
      personnelPresentList.push(workLogPersonnelModel);
    });
    return personnelPresentList;
  }

  prepareWorkingLogContractorPresent(): WorkLogContractorModel[] {
    let contractorPresentList: WorkLogContractorModel[] = [];
    const hour: string = this.translateService.instant("GENERAL.HOUR");
    const minute: string = this.translateService.instant("GENERAL.MINUTE");
    _.forEach(this.workLogContractorList, (contractor) => {
      let workLogContractorModel: WorkLogContractorModel = {};
      const workingHour =
        contractor.workingHour != null ? contractor.workingHour : 0;
      const workingMinute =
        contractor.workingMinute != null ? contractor.workingMinute : 0;
      workLogContractorModel.person = contractor.person;
      workLogContractorModel.workingHourPresent =
        workingHour + hour + " , " + workingMinute + minute;
      workLogContractorModel.invoiceNumber = contractor.invoiceNumber;
      workLogContractorModel.invoiceFee = contractor.invoiceFee;
      contractorPresentList.push(workLogContractorModel);
    });
    return contractorPresentList;
  }

  //TODO: refactor need !
  retrieveCostForPart(workLogPart: WorkLogPart): WorkLogPart {
    let workLogPartWithCost: WorkLogPart = {};
    this.partApi.getPartById(workLogPart.partId!).subscribe((part) => {
      workLogPartWithCost.partId = workLogPart.partId;
      workLogPartWithCost.partCost = workLogPartWithCost.partCount =
        workLogPart.partCount;
      workLogPartWithCost.partName = workLogPart.partName;
      workLogPartWithCost.partCost = this.currentPartPrice(part.partPriceList!);
    });
    return workLogPart;
  }

  //TODO: refactor need !

  currentPartPrice(partPriceList: PartPrice[]): number | undefined {
    let price: number | undefined = 0;
    if (partPriceList) {
      let today = moment();
      price = _.map(partPriceList, (price) => {
        if (
          moment(price.fromDate).isBefore(today) &&
          moment(price.toDate).isAfter(today)
        ) {
          return price.price;
        } else {
          return 0;
        }
      })[0];
    }
    return price;
  }
}
