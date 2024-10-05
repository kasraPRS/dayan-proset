import { Person, Priority } from "@proset/maintenance-client";

export type TaskType = {
  title: string;
  assignee: Person;
  priority: Priority;
  status: any;
  start_date: string;
  end_date: string;
  author: Person;
  id: string;
  code: string;
  color: string;
  isRejected?: boolean;
  labels?: LabelType[];
  link?: string;
  orgEntity?: any;
};

export type LabelType = {
  title: string;
  color: string;
};

export type CalendarAction = {
  icon: string;
  action?: (e?: any) => void;
};
