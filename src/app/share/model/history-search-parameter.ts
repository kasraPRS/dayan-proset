import { Person } from "@proset/maintenance-client";

export interface HistorySearchParameter {
  createdBy: Person[] | null;
  updatedBy: Person[] | null;
  createdFrom: Date | null;
  createdTo: Date | null;
  updatedFrom: Date | null;
  updatedTo: Date | null;
}
