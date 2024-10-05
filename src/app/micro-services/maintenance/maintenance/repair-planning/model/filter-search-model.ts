import { Priority, WorkOrderType } from "@proset/maintenance-client";

export interface ReaperPlanningFilterSearchModel {
  workOrderType?: Array<WorkOrderType>;
  assetId?: number[];
  fromCode?: string;
  toCode?: string;
  fromDate?: string;
  toDate?: string;
  priority?: Priority[];
  executionManagerId?: number[];
  isArchive?: boolean;
  createdBy?: string[];
  updatedBy?: string[];
  createdFrom?: string;
  createdTo?: string;
  updatedFrom?: string;
  updatedTo?: string;
}
