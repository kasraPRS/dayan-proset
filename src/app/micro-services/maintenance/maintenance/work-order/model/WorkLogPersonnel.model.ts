import { WorkLogPersonnel } from "@proset/maintenance-client";

export interface WorkLogPersonnelModel extends WorkLogPersonnel {
  workingHourPresent?: string;
  overTimeHourPresent?: string;
  cost?: number;
}
