import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  TemplateRef,
} from "@angular/core";
import { FlatTreeControl } from "@angular/cdk/tree";
import {
  MatTreeFlattener,
  MatTreeFlatDataSource,
  MatTreeModule,
} from "@angular/material/tree";
import { SelectionModel } from "@angular/cdk/collections";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import * as _ from "lodash";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";

interface TreeNode {
  id: number;
  name: string;
  children: TreeNode[];
  shouldExpand?: boolean;
}

interface FlatTreeNode {
  id: number;
  name: string;
  level: number;
  expandable: boolean;
}

@Component({
  selector: "app-generic-tree",
  templateUrl: "./generic-tree.component.html",
  styleUrls: ["./generic-tree.component.less"],
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, MatTreeModule],
})
export class GenericTreeComponent implements OnInit, OnChanges {
  @Input() treeData: any[];
  @Input() idKey = "id";
  @Input() nameKey = "name";
  @Input() selectedIds: number[] = [];
  @Input() multiple: boolean = true;
  @Input() objective: boolean = true;
  @Input() nodeTemplate: TemplateRef<any>;
  @Output() selectionChange = new EventEmitter<any[]>();

  searchControl = new FormControl("");

  treeControl: FlatTreeControl<FlatTreeNode>;
  treeFlattener: MatTreeFlattener<TreeNode, FlatTreeNode>;
  dataSource: MatTreeFlatDataSource<TreeNode, FlatTreeNode>;
  selection: SelectionModel<FlatTreeNode>;
  originalNodes: TreeNode[];

  constructor() {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<FlatTreeNode>(
      this.getLevel,
      this.isExpandable,
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener,
    );
    this.selection = new SelectionModel<FlatTreeNode>(this.multiple);
  }

  ngOnInit() {
    this.setupSearch();
    this.selection.changed.subscribe((value) => {
      const selectedNodes: any[] = this.selection.selected;
      this.selectionChange.emit(
        this.objective ? selectedNodes : selectedNodes.map((node) => node.id),
      );
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const treeData: TreeNode[] = changes["treeData"].currentValue;
    if (treeData.length) {
      const isStandardNestedTree = _.has(treeData[0], "children");

      this.dataSource.data = this.originalNodes = this.sortTreeNodesByCode(
        isStandardNestedTree ? treeData : this.buildTree(treeData),
      );
      this.setInitialSelection();
    }
  }

  setupSearch() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.filterTree(searchTerm);
      });
  }

  buildTree(nodes: TreeNode[]): TreeNode[] {
    // Helper function to find children of a given parent
    const findChildren = (parentId: number | null): TreeNode[] => {
      return nodes
        .filter((node: any) => node.parentId === parentId)
        .map((node: any) => ({
          ...node,
          id: node[this.idKey],
          name: node[this.nameKey],
          children: findChildren(node[this.idKey]),
        }));
    };

    // Start with root nodes (parentId is null)
    return findChildren(null);
  }

  sortTreeNodesByCode(nodes: TreeNode[]): TreeNode[] {
    return _.sortBy(nodes, "code").map((node) => {
      if (node.children?.length) {
        return { ...node, children: this.sortTreeNodesByCode(node.children) };
      }
      return node;
    });
  }

  filterTree(searchTerm: any) {
    let filteredData: TreeNode[] = this.originalNodes;
    if (searchTerm.length) {
      filteredData = this.filterNodes(this.originalNodes, searchTerm);
    }

    this.dataSource.data = filteredData;

    if (searchTerm.length) {
      this.updateTreeExpansion(this.treeControl.dataNodes, searchTerm);
    }
  }

  filterNodes(nodes: TreeNode[], searchTerm: string): TreeNode[] {
    return nodes
      .map((node) => {
        const newNode = { ...node };

        const nodeMatches = newNode.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

        if (newNode.children && newNode.children.length > 0) {
          newNode.children = this.filterNodes(newNode.children, searchTerm);
        }

        const childrenMatch = newNode.children && newNode.children.length > 0;

        // Keep the node if it matches or if any of its children match
        if (nodeMatches || childrenMatch) {
          // Expand the node if it has matching children
          if (childrenMatch) {
            newNode.shouldExpand = true;
          }
          return newNode;
        }

        // If neither the node nor its children match, don't include this node
        return null;
      })
      .filter((node) => node !== null) as TreeNode[]; // Remove null entries and cast to TreeNode[]
  }

  private updateTreeExpansion(nodes: FlatTreeNode[], searchTerm: string) {
    const searchTermLower = searchTerm.toLowerCase();

    nodes.forEach((node) => {
      const nodeMatches = node.name.toLowerCase().includes(searchTermLower);
      const hasMatchingDescendant = this.hasMatchingDescendant(
        node,
        searchTermLower,
      );

      if (nodeMatches || hasMatchingDescendant) {
        // Expand the node if it matches or has a matching descendant
        this.treeControl.expand(node);
      } else {
        // Collapse the node if it doesn't match and has no matching descendants
        this.treeControl.collapse(node);
      }
    });
  }

  private hasMatchingDescendant(
    node: FlatTreeNode,
    searchTerm: string,
  ): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.some(
      (child) =>
        child.name.toLowerCase().includes(searchTerm) ||
        this.hasMatchingDescendant(child, searchTerm),
    );
  }

  private transformer = (node: TreeNode, level: number): FlatTreeNode => {
    return {
      ...node,
      id: _.get(node, this.idKey),
      name: _.get(node, this.nameKey),
      level: level,
      expandable: !!node.children && node.children.length > 0,
    };
  };

  private getLevel = (node: FlatTreeNode) => node.level;
  private isExpandable = (node: FlatTreeNode) => node.expandable;
  private getChildren = (node: TreeNode): TreeNode[] => node.children || [];

  hasChild = (_: number, node: FlatTreeNode) => node.expandable;

  nameSelectionToggle(node: FlatTreeNode): void {
    if (this.multiple) {
      this.multipleSelectionToggle(node);
    } else {
      this.singleSelectionToggle(node);
    }
  }

  private multipleSelectionToggle(node: FlatTreeNode): void {
    this.selection.toggle(node);
  }

  private singleSelectionToggle(node: FlatTreeNode): void {
    const isSelected = this.selection.isSelected(node);
    this.selection.clear();
    if (!isSelected) this.selection.select(node);
  }

  private checkAllParentsSelection(node: FlatTreeNode): void {
    let parent: FlatTreeNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  private getParentNode(node: FlatTreeNode): FlatTreeNode | null {
    const currentLevel = this.getLevel(node);
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  private checkRootNodeSelection(node: FlatTreeNode): void {
    const nodeSelected = this.selection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => this.selection.isSelected(child));
    if (nodeSelected && !descAllSelected) {
      this.selection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.selection.select(node);
    }
  }

  private setInitialSelection(): void {
    const selectedNodes = this.treeControl.dataNodes.filter((node) =>
      this.selectedIds.includes(node.id),
    );
    this.selection.select(...selectedNodes);
  }
}
