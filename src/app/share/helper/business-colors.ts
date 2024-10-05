import { WorkOrderStatus } from "@proset/maintenance-client";

export function assignPriorityColorToEvent(status: any) {
  switch (status) {
    case WorkOrderStatus.OPEN:
      return "#D1A6F4";
    case WorkOrderStatus.UNDER_EXECUTION:
      return "#FDAB3D";
    case WorkOrderStatus.WORK_LOG:
      return "#62A0FF";
    case WorkOrderStatus.FINISHED:
      return "#46BB6E";
    default:
      return ""; // Or any default color if needed
  }
}
