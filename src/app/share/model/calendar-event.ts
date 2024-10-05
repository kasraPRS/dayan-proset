import { CalendarAction } from "./task";

export interface CalendarEvent {
  title?: string;
  start?: string;
  end?: string;
  color?: string;
  id?: string;
  extendedProps?: {
    background?: string;
    description?: string;
    link?: string;
    actions?: CalendarAction[];
    id?: number;
    code?: string;
    start?: string;
    end?: string;
  };
}
