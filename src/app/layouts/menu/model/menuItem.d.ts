import { PermissionType } from "../enums/menu.enum";

export interface MenuItems {
  name: string;
  route: string;
  child?: undefined | { name: string; route: string }[];
  permission?: PermissionType[];
}

export interface Menu {
  name: string;
  route?: string;
  columns?: MenuItems[];
  permission?: PermissionType[];
}
