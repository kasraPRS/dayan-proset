export class PermissionItemNode {
  children: PermissionItemNode[];
  item: string;
  id: number;
}

/** Flat to-do item node with expandable and level information */
export class PermissionItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
  id: number;
}
