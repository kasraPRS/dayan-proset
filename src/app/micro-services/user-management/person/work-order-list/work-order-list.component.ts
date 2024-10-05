import { Component, OnInit } from "@angular/core";
import { Config, FieldType } from "../../../../share/datatable/type";
import { WorkOrder } from "@proset/maintenance-client";

@Component({
  selector: "proset-work-order-list",
  templateUrl: "./work-order-list.component.html",
  styleUrl: "./work-order-list.component.less",
})
export class WorkOrderListComponent implements OnInit {
  workOrderList: any[];
  config: Config;
  constructor() {}
  ngOnInit(): void {
    this.config = this.initWorkOrderTable();
  }

  initWorkOrderTable(): Config {
    return {
      id: "PERSON_WORK_ORDER_TABLE",
      limitPerPage: 0,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      list: [
        {
          type: FieldType.text,
          id: "PERSON_WORK_ORDER_NUMBER",
          label: "PERSON.WORK_ORDER.NUMBER",
          field: "workOrderNumber",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "PERSON_WORK_ORDER_TYPE",
          label: "PERSON.WORK_ORDER.TYPE",
          field: "form.formDate",
          minWidth: 100,
          width: 150,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "PERSON_WORK_ORDER_STATUS",
          label: "PERSON.WORK_ORDER.STATUS",
          field: "request.code",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "PERSON_WORK_ORDER_CREATE_DATE",
          label: "PERSON.WORK_ORDER.CREATE_DATE",
          field: "request.requestDate",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "PERSON_WORK_ORDER_START_DATE",
          label: "PERSON.WORK_ORDER.START_DATE",
          field: "request.requestName",
          minWidth: 100,
          width: 150,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "PERSON_WORK_ORDER_END_DATE",
          label: "PERSON.WORK_ORDER.END_DATE",
          field: "form.formTitle",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "PERSON_WORK_ORDER_WORKING_HOUR",
          label: "PERSON.WORK_ORDER.WORKING_HOUR",
          field: "form.asset.assetInformationInfo.assetName",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "PERSON_TABLE_WORKING_COST",
          label: "PERSON.WORK_ORDER.WORKING_COST",
          field: "mainInfo.asset.assetInformationInfo.numberPlate",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "PERSON_TABLE_OVERTIME_HOUR",
          label: "PERSON.WORK_ORDER.OVERTIME_HOUR",
          field:
            "mainInfo.asset.assetInformationInfo.emplacementLocationInfo.name",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "PERSON_TABLE_OVERTIME_COST",
          label: "PERSON.WORK_ORDER.OVERTIME_COST",
          field: "mainInfo.asset.assetInformationInfo.status",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
      ],
    };
  }
}
