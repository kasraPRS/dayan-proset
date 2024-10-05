import { SelectionModel } from "@angular/cdk/collections";
import { FlatTreeControl } from "@angular/cdk/tree";
import { Component } from "@angular/core";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from "@angular/material/tree";
import * as _ from "lodash";
import { delay } from "rxjs";
import {
  PermissionItemFlatNode,
  PermissionItemNode,
} from "../../user-management.model";
import { UserManagementService } from "../../usermanagement.service";

@Component({
  selector: "proset-permission",
  templateUrl: "./permission.component.html",
  styleUrl: "./permission.component.less",
})
export class PermissionComponent {
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<PermissionItemFlatNode, PermissionItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<PermissionItemNode, PermissionItemFlatNode>();

  treeControl: FlatTreeControl<PermissionItemFlatNode>;

  treeFlattener: MatTreeFlattener<PermissionItemNode, PermissionItemFlatNode>;

  dataSource: MatTreeFlatDataSource<PermissionItemNode, PermissionItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<PermissionItemFlatNode>(
    true /* multiple */,
  );

  constructor(private userManagementService: UserManagementService) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<PermissionItemFlatNode>(
      this.getLevel,
      this.isExpandable,
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener,
    );

    userManagementService.permissionDataChange.subscribe((data) => {
      this.dataSource.data = data;
    });

    this.userManagementService.permissionList
      .pipe(delay(100))
      .subscribe((value) => {
        this.selectNodesByIds(value);
      });
  }

  getLevel = (node: PermissionItemFlatNode) => node.level;

  isExpandable = (node: PermissionItemFlatNode) => node.expandable;

  getChildren = (node: PermissionItemNode): PermissionItemNode[] =>
    node.children;

  hasChild = (_: number, _nodeData: PermissionItemFlatNode) =>
    _nodeData.expandable;

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: PermissionItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.item
        ? existingNode
        : new PermissionItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = node.children.length > 0;
    flatNode.id = node.id;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: PermissionItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    if (descendants.length === 0) {
      return this.checklistSelection.isSelected(node);
    }

    return descendants.every((child) =>
      this.checklistSelection.isSelected(child),
    );
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: PermissionItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child: any) =>
      this.checklistSelection.isSelected(child),
    );
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  permissionItemSelectionToggle(node: PermissionItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    let parent = this.getParentNode(node);
    while (parent) {
      if (this.checklistSelection.isSelected(node)) {
        this.checklistSelection.select(parent);
      } else {
        const parentDescendants = this.treeControl.getDescendants(parent);
        const allChildrenDeselected = parentDescendants.every(
          (child) => !this.checklistSelection.isSelected(child),
        );
        if (allChildrenDeselected) {
          this.checklistSelection.deselect(parent);
        }
      }
      parent = this.getParentNode(parent);
    }

    this.userManagementService.permissionList.next(
      _.map(this.checklistSelection.selected, (node) => node.id),
    );
  }

  // Helper function to get a node's parent
  getParentNode(node: PermissionItemFlatNode): PermissionItemFlatNode | null {
    const currentLevel = this.getLevel(node);
    if (currentLevel < 1) {
      return null; // Root nodes don't have parents
    }

    const nodeIndex = _.findIndex(this.treeControl.dataNodes, (dataNode) =>
      _.isEqual(dataNode, node),
    );
    const parentNode = _.findLast(
      this.treeControl.dataNodes,
      (dataNode, index) => {
        return this.getLevel(dataNode) < currentLevel && index < nodeIndex;
      },
    );

    return parentNode || null;
  }

  // Method to select nodes by IDs
  selectNodesByIds(ids: number[]): void {
    this.treeControl.dataNodes.forEach((node) =>
      this.checklistSelection.deselect(node),
    );

    this.treeControl.dataNodes.forEach((node) => {
      // Check if the current node's ID is in the list and select it if so
      if (ids.includes(node.id)) {
        this.checklistSelection.select(node);
        // Attempt to select the parent if necessary
        this.selectParentIfAllChildrenSelected(node, ids);
      } else {
        this.checklistSelection.deselect(node);
      }
    });
  }

  // Helper method to select the parent node if all its children are selected
  selectParentIfAllChildrenSelected(
    node: PermissionItemFlatNode,
    ids: number[],
  ): void {
    let parent = this.getParentNode(node);
    while (parent) {
      const parentDescendants = this.treeControl.getDescendants(parent);
      const allChildrenSelected = parentDescendants.every(
        (child) =>
          this.checklistSelection.isSelected(child) || !ids.includes(child.id),
      );
      if (allChildrenSelected) {
        this.checklistSelection.select(parent);
      } else this.checklistSelection.deselect(parent);
      parent = this.getParentNode(parent);
    }
  }
}
