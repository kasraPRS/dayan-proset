import { Priority, WorkOrderType } from "@proset/maintenance-client";

export interface FilterSearchModel {
  workOrderType?: Array<WorkOrderType>;
  assetId?: number[];
  fromCode?: string;
  toCode?: string;
  fromDate?: string;
  toDate?: string;
  priority?: Priority[];
  executionManagerInfo?: number[];
  isArchive?: boolean;
  createdBy?: string[];
  updatedBy?: string[];
  createdFrom?: string;
  createdTo?: string;
  updatedFrom?: string;
  updatedTo?: string;
}
