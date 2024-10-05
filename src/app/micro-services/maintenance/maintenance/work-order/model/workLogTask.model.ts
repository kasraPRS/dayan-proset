import { WorkLogCheckListTask } from "@proset/maintenance-client";
import { TaskTypeDto } from "@proset/maintenance-client/model/task";

export interface WorkLogTaskModel extends WorkLogCheckListTask {
  name?: string;
  type?: TaskTypeDto;
  measurementName?: string;
}
