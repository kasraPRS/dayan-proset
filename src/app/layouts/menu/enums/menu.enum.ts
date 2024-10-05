export enum Menu_ENUM {
  "/person/action/person" = "MENU.PERSON.PERSON_REGISTRATION_FORM",
  "/person/group" = "MENU.PERSON.GROUP_REGISTRATION_FORM",
  "/person/person" = "MENU.PERSON.PERSON_REGISTRATION_FORM",
  "/usermanagement/permission" = "MENU.PERSON.ACTION.PERMISSION_ASSIGN_FORM",
  "/sale/setting" = "MENU.SALE_SERVICE.SETTINGS",
  "/sale/setting/module-setting" = "MENU.SALE_SERVICE.SETTINGS.SETTINGS_CHILD.MODULE_SETTING",
  "/sale/exit-permission-issue" = "MENU.SALE_SERVICE.EXIT_PERMISSION",
  "/saleandcustomer/action/ordertype" = "MENU.SALE_SERVICE.ACTION.ORDER_TYPE_FORM",
  "/saleandcustomer/action/deliverlocation" = "MENU.SALE_SERVICE.ACTION.DELIVER_LOCATION_FORM",
  "/sale/pre-invoice" = "MENU.SALE_SERVICE.PRE_INVOICE",
  "/sale/invoice-issue" = "MENU.SALE_SERVICE.ISSUE_INVOICE",
  "/sale/order" = "MENU.SALE_SERVICE.ORDERS",
  "/sale/order/shipping-status" = "MENU.SALE_SERVICE.ORDERS.SHIPPING_STATUS",
  "/sale/loading-permission" = "MENU.SALE_SERVICE.LOADING_PERMISSION",
  "/sale/preinvoice-confirm" = "MENU.SALE_SERVICE.ACTION.CONFIRM_ORDER_FORM",
  "/sale/preinvoice-confirm-manager" = "MENU.SALE_SERVICE.ACTION.CONFIRM_ORDER_FORM",
  "/sale/preinvoice-confirm-customer" = "MENU.SALE_SERVICE.ACTION.CONFIRM_ORDER_FORM",
  "/warehouse/action/goods-and-service" = "MENU.WAREHOUSE_SERVICE.ACTION.GOODS_AND_SERVICE",
  "/warehouse/action/goodsGroup" = "MENU.WAREHOUSE_SERVICE.ACTION.DEFINITION_GOODS_GROUPING",
  "/warehouse/action/measurementUnit" = "MENU.WAREHOUSE_SERVICE.ACTION.DEFINITION_UNIT",
  "/warehouse/action/kopStoneTitle" = "MENU.WAREHOUSE_SERVICE.ACTION.DEFINITION_KOP_TITLE",
  "/warehouse/action/kopStoneDegree" = "MENU.WAREHOUSE_SERVICE.ACTION.DEFINITION_KOP_AND_STONE_DEGREE",
  "/warehouse/action/finishing" = "MENU.WAREHOUSE_SERVICE.ACTION.DEFINITION_STONE_FINISHING",
  "/warehouse/action/warehouse-and-category" = "MENU.WAREHOUSE_SERVICE.ACTION.DEFINITION_WAREHOUSE_WAREHOUSE_CATEGORY",
  "/accounts/account-tree" = "MENU.ACCOUNTING_SERVICE.ACCOUNTING_SERVICE_MAIN",
  "/assets/emplacement-location" = "MENU.PROPERTIES_AND_FIXED_ASSETS.EMPLACEMENT_LOCATION",
}

export enum UserPermissions {
  BASE_TABLE = "base_table",
  ASSET_INFO = "asset_info",
  MAINTENANCE = "maintenance",
  REPORT = "report",
  SETTING = "setting",
  LOG = "log",
  MEASUREMENT = "measurement",
  MEASUREMENT_VIEW = "measurement_view",
  MEASUREMENT_DELETE = "measurement_delete",
  MEASUREMENT_CREATE = "measurement_create",
  MEASUREMENT_UPDATE = "measurement_update",
  LEVEL = "level",
  LEVEL_VIEW = "level_view",
  LEVEL_DELETE = "level_delete",
  LEVEL_CREATE = "level_create",
  LEVEL_UPDATE = "level_update",
  GROUP = "group",
  GROUP_VIEW = "group_view",
  GROUP_DELETE = "group_delete",
  GROUP_CREATE = "group_create",
  GROUP_UPDATE = "group_update",
  EMPLACEMENT_LOCATION = "emplacement_location",
  EMPLACEMENT_LOCATION_VIEW = "emplacement_location_view",
  EMPLACEMENT_LOCATION_DELETE = "emplacement_location_delete",
  EMPLACEMENT_LOCATION_CREATE = "emplacement_location_create",
  EMPLACEMENT_LOCATION_UPDATE = "emplacement_location_update",
  COST_CENTER = "cost_center",
  COST_CENTER_VIEW = "cost_center_view",
  COST_CENTER_DELETE = "cost_center_delete",
  COST_CENTER_CREATE = "cost_center_create",
  COST_CENTER_UPDATE = "cost_center_update",
  PART = "part",
  PART_VIEW = "part_view",
  PART_DELETE = "part_delete",
  PART_CREATE = "part_create",
  PART_UPDATE = "part_update",
  PART_PRICE = "part_price",
  PART_PRICE_VIEW = "part_price_view",
  PART_PRICE_DELETE = "part_price_delete",
  PART_PRICE_CREATE = "part_price_create",
  PART_PRICE_UPDATE = "part_price_update",
  FAILURE_DETECTION_METHOD = "failure_detection_method",
  FAILURE_DETECTION_METHOD_CREATE = "failure_detection_method_create",
  FAILURE_DETECTION_METHOD_UPDATE = "failure_detection_method_update",
  FAILURE_DETECTION_METHOD_DELETE = "failure_detection_method_delete",
  FAILURE_DETECTION_METHOD_VIEW = "failure_detection_method_view",
  ASSET = "asset",
  ASSET_VIEW = "asset_view",
  ASSET_DELETE = "asset_delete",
  ASSET_CREATE = "asset_create",
  ASSET_UPDATE = "asset_update",
  ACTIVITY = "activity",
  ACTIVITY_VIEW = "activity_view",
  ACTIVITY_DELETE = "activity_delete",
  ACTIVITY_CREATE = "activity_create",
  ACTIVITY_UPDATE = "activity_update",
  FAILURE_MODE = "failure_mode",
  FAILURE_MODE_VIEW = "failure_mode_view",
  FAILURE_MODE_DELETE = "failure_mode_delete",
  FAILURE_MODE_CREATE = "failure_mode_create",
  FAILURE_MODE_UPDATE = "failure_mode_update",
  FAILURE_REASON = "failure_reason",
  FAILURE_REASON_VIEW = "failure_reason_view",
  FAILURE_REASON_DELETE = "failure_reason_delete",
  FAILURE_REASON_CREATE = "failure_reason_create",
  FAILURE_REASON_UPDATE = "failure_reason_update",
  FAILURE_MECHANISM = "failure_mechanism",
  FAILURE_MECHANISM_VIEW = "failure_mechanism_view",
  FAILURE_MECHANISM_DELETE = "failure_mechanism_delete",
  FAILURE_MECHANISM_CREATE = "failure_mechanism_create",
  FAILURE_MECHANISM_UPDATE = "failure_mechanism_update",
  WORK_REQUEST = "work_request",
  WORK_REQUEST_VIEW = "work_request_view",
  WORK_REQUEST_DELETE = "work_request_delete",
  WORK_REQUEST_CREATE = "work_request_create",
  WORK_REQUEST_UPDATE = "work_request_update",
  WORK_REQUEST_REJECT = "work_request_reject",
  WORK_REQUEST_CONFIRM = "work_request_confirm",
  WORK_REQUEST_RETURN_CONFIRM = "work_request_return_confirm",
  WORK_REQUEST_WORK_ORDER_CREATE = "work_request_work_order_create",
  WORK_ORDER = "work_order",
  WORK_ORDER_VIEW = "work_order_view",
  WORK_ORDER_DELETE = "work_order_delete",
  WORK_ORDER_CREATE = "work_order_create",
  WORK_ORDER_UPDATE = "work_order_update",
  WORK_ORDER_EXECUTE = "work_order_execute",
  WORK_ORDER_RETURN_EXECUTE = "work_order_return_execute",
  WORK_ORDER_FINISH = "work_order_finish",
  WORK_LOG = "work_log",
  WORK_LOG_CREATE = "work_log_create",
  WORK_LOG_DELETE = "work_log_delete",
  WORK_LOG_REJECT = "work_log_reject",
  WORK_ORDER_COST_CALCULATE = "work_order_cost_calculate",
  WORK_ORDER_RETURN_FINISH = "work_order_return_finish",
  REPAIR_PLANNING = "repair_planning",
  REPAIR_PLANNING_VIEW = "repair_planning_view",
  REPAIR_PLANNING_DELETE = "repair_planning_delete",
  REPAIR_PLANNING_CREATE = "repair_planning_create",
  REPAIR_PLANNING_UPDATE = "repair_planning_update",
  REPAIR_PLANNING_DELETE_WORK_ORDERS = "repair_planning_delete_work_orders",
  CHECKLIST = "checklist",
  CHECKLIST_VIEW = "checklist_view",
  CHECKLIST_DELETE = "checklist_delete",
  CHECKLIST_CREATE = "checklist_create",
  CHECKLIST_UPDATE = "checklist_update",
  ORGANIZATION = "organization",
  ORGANIZATION_UPDATE = "organization_update",
  USER_MANAGEMENT = "user_management",
  USER_MANAGEMENT_CREATE = "user_management_create",
  USER_MANAGEMENT_UPDATE = "user_management_update",
  USER_MANAGEMENT_VIEW = "user_management_view",
  USER_MANAGEMENT_DELETE = "user_management_delete",
  START_CODE = "start_code",
  START_CODE_UPDATE = "start_code_update",
  ERROR_LIST = "error_list",
  WORK_ORDER_ARCHIVE = "work_order_archive",
  WORK_ORDER_UNARCHIVE = "work_order_unarchiv",
  WORK_ORDER_RETURN_COST_CALCULATE = "work_order_return_cost_calculate",
  REPAIR_PLANNING_ARCHIVE = "repair_planning_archive",
  REPAIR_PLANNING_UNARCHIVE = "repair_planning_unarchive",
  TEAM = "team",
  TEAM_CREATE = "team_create",
  TEAM_UPDATE = "team_update",
  TEAM_VIEW = "team_view",
  TEAM_DELETE = "team_delete",
}
