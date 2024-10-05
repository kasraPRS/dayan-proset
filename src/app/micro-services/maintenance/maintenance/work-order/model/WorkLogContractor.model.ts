import { WorkLogContractor } from "@proset/maintenance-client";

export interface WorkLogContractorModel extends WorkLogContractor {
  workingHourPresent?: string;
}
