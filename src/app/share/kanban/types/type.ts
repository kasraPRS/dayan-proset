import { TaskType } from "../../model/task";

export type KanbanColumnType = {
  name: string;
  status: any;
  color: string;
  tasks?: TaskType[];
};

export enum KanbanCardFieldType {
  TITLE = "TITLE",
  ASSIGNEE = "ASSIGNEE",
  PRIORITY = "PRIORITY",
  STATUS = "STATUS",
  START_DATE = "START_DATE",
  END_DATE = "END_DATE",
  AUTHOR = "AUTHOR",
  ID = "ID",
}

export enum KanbanCardSortType {
  ID = "ID",
  PRIORITY = "PRIORITY",
  START_DATE = "START_DATE",
}

export enum KanbanCardSortOrderType {
  ASC = "ASC",
  DESC = "DESC",
}

export type KanbanConfig = {
  showFields: KanbanCardFieldType[];
  sortField: KanbanCardSortType;
  sortOrder: KanbanCardSortOrderType;
};

export type KanbanCardActionType = {
  title: string;
  action: (task: TaskType) => void;
  status?: any;
};
