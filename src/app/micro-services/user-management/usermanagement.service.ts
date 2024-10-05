import { Injectable } from "@angular/core";
import {
  Permission,
  Person,
  UserManagementApi,
  Wage,
} from "@proset/maintenance-client";
import { BehaviorSubject } from "rxjs";
import { PermissionItemNode } from "./user-management.model";

@Injectable({
  providedIn: "root",
})
export class UserManagementService {
  permissionDataChange = new BehaviorSubject<PermissionItemNode[]>([]);
  permissionList = new BehaviorSubject<number[]>([]);
  wageList = new BehaviorSubject<Wage[]>([]);
  permissions: Permission[] = [];
  activeTab = new BehaviorSubject<number>(0);
  personList = new BehaviorSubject<Person[]>([]);

  get data(): Permission[] {
    return this.permissionDataChange.value;
  }

  constructor(private userManagementApi: UserManagementApi) {
    this.userManagementApi.getAllPermission().subscribe((result) => {
      this.permissions = result;
      this.initialize();
    });
  }

  initialize() {
    const data = this.buildFileTree(this.permissions, 0);
    this.permissionDataChange.next(data);
  }

  /**
   * Build the permission structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `PermissionItemNode`.
   */
  buildFileTree(obj: Permission[], level: number): PermissionItemNode[] {
    return Object.keys(obj).reduce<PermissionItemNode[]>(
      (accumulator: PermissionItemNode[], key: any) => {
        const value: Permission = obj[key];
        const node = new PermissionItemNode();
        node.item = value.name!;
        if (value.children) {
          node.children = this.buildFileTree(value.children, level + 1);
        }
        node.id = value.id!;
        return accumulator.concat(node);
      },
      [],
    );
  }
}
