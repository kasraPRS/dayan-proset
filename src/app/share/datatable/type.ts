import { HttpClient } from "@angular/common/http";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";

export class NgxPage {
  size: number;
  totalElements: number;
  totalPages: number;
  pageNumber: number;
}

export class NgxPageInfo {
  count: number;
  limit: number;
  offset: number;
  pageSize: number;
}

export enum TableActionEnum {
  Permission = "fa-solid fa-user-check",
  Edit = "fa-solid fa-pencil",
  Active_Inactive = "fa-solid fa-user-large-slash",
  Delete = "fa-solid fa-trash-can",
  Warning = "btn btn-warning",
  Group = "fa-solid fa-users",
  Light = "btn btn-light",
  Dark = "btn btn-dark",
  CHECK = "fa fa-check",
}

export enum ActionButtonType {
  Primary = "btn btn-primary",
  Secondary = "btn btn-secondary",
  Success = "btn btn-success",
  Danger = "btn btn-danger",
  Warning = "btn btn-warning",
  Info = "btn btn-info",
  Light = "btn btn-light",
  Dark = "btn btn-dark",
  Link = "btn btn-link",
}

export enum ConfirmModalActionType {
  Primary = "alert alert-primary",
  Secondary = "alert alert-secondary",
  Success = "alert alert-success",
  DELETE = "alert alert-danger",
  WARNING = "alert alert-warning",
  Info = "alert alert-info",
  Light = "alert alert-light",
  Dark = "alert alert-dark",
}

export interface EventEmitterType {
  data?: any;
  emitterType: string;
}

export interface ScopeVars {
  title?: string;
  size?: string;
  closeBtnName?: string;
  data?: any;
  actionButton?: ModalActionButtonModel[];
  contentMessage?: string;
  image?: string;
  referenceContent?: any;
  viewMode?: boolean;
  height?: string;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  hasDescription?: boolean;
  warningMessages?: string[];
}

export interface ModalActionButtonModel {
  name: string;
  cssType: TableActionEnum | ActionButtonType;
  disable?: boolean;
}

export interface ModalReturnValue {
  event: any;
  data: any;
}

export function getJsonAsTree(httpClient: HttpClient, _jsonUrl: string) {
  return httpClient.get(_jsonUrl);
}

export interface Config {
  id?: string;
  pagination?: boolean;
  limitPerPage?: number;
  displayPaginationOnlyLimitPerPageExceeded?: boolean;
  istBackendFilter?: boolean;
  istBackendSortable?: boolean;
  istBackendPagable?: boolean;
  headerAlwaysShow?: boolean;
  scrollbarH?: boolean;
  footerHeight?: number;
  autoAdjusting?: boolean;
  text?: {
    noResult?: string;
    noResultFunction?: Function; // get no result text from this function
  };
  list?: Column[];
  actions?: Action[];
  actionColumnWidth?: number;
  actionColumnFlexGrow?: number;
  selectable?: boolean;
  canBeUnselectedAgain?: boolean;
  columnModeFlex?: boolean;
  rowClass?: (row: any) => { [key: string]: boolean };
  excelFileName?: string;
}

export interface Column extends Translator {
  id?: string;
  label: string;
  field: string;
  sortable: boolean;
  searchable?: boolean;
  /**
   * Is used to filter custom composed fields in given Column.
   * The given keys can be simple or nested. Eg: ['name', 'address.street']
   */
  searchIndexKeys?: string[];
  minWidth?: number;
  maxWidth?: number;
  width?: number;
  type?: FieldType;
  check?: Function;
  sortField?: string;
  class?: string;
  tooltip?: ColumnTooltip;
  sub?: any;
  headerTooltip?: string;
  flexGrow?: number;
  defaultStringForNullValue?: string;
  containerClass?: string;
  priceFormat?: string;
  pricePostFix?: string;
  draggable?: boolean;
  commaSeperatedToolTipFiledName?: string;
  url?: string;
}

export interface Translator {
  translator?: (value: any, object: any, config: Column) => string;
}

export enum FieldType {
  text = "text",
  html = "html",
  url = "url",
  price = "price",
  date = "date",
  boolean = "boolean",
  status = "status",
  hasStatus = "hasStatus",
  array = "array",
  checkbox = "checkbox",
}

export interface ColumnTooltip extends Translator {
  placement: string;
  template?: any;
}

export interface Action {
  id?: string;
  icon?: string;
  tooltip: string;
  permission?: UserPermissions[];
  action: (...args: any) => void;
  tooltipParams?: (...args: any) => { [key: string]: string };
  columnWidth?: number;
  editableRows?: boolean;
  label: string;
  hidden?: boolean;
}

export interface AnyObject {
  [k: string]: any;
}

export type FunctionValue = (...args: AnyObject[]) => any;

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  quantity: number;
}
