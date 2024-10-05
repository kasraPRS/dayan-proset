import { AfterViewInit, Component } from "@angular/core";

import { NestedTreeControl } from "@angular/cdk/tree";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import {
  EmplacementLocation,
  EmplacementLocationApi,
} from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { LoaderService } from "src/app/share/service/loader.service";
import { ToastService } from "src/app/share/service/toast.service";
import { EmplacementLocationWithParent } from "./types/emplacement-location-with-parent";
import { MessageType } from "./types/message";
import { FORM_MODE, LIST_EVENTS } from "src/app/share/enums/enums";
import { FormModalComponent } from "src/app/share/modal-component/form-modal/form-modal.component";
import { EmplacementLocationCreationFormComponent } from "./creation-form/emplacement-location-creation-form.component";
import { ProsetDialogService } from "src/app/share/service/proset-dialog.service";
import { EventService } from "src/app/share/service/event.service";
import * as _ from "lodash";

@Component({
  selector: "proset-emplacement-location-definition",
  templateUrl: "./emplacement-location-definition.component.html",
  styleUrl: "./emplacement-location-definition.component.less",
})
export class EmplacementLocationDefinitionComponent implements AfterViewInit {
  locationObject: EmplacementLocationWithParent = {};
  permission = UserPermissions;
  viewType: FORM_MODE = FORM_MODE.CREATE;

  formType: string = "";
  showForm: boolean = false;
  disabledTree: boolean = false;
  parentCode: number;

  private expandedNodes: EmplacementLocationWithParent[];
  treeControl = new NestedTreeControl<EmplacementLocationWithParent>(
    (node) => node.children,
  );
  dataSource = new MatTreeNestedDataSource<EmplacementLocationWithParent>();

  constructor(
    private _emplacementLocationApi: EmplacementLocationApi,
    private _loaderService: LoaderService,
    private toastService: ToastService,
    private dialogService: ProsetDialogService,
    private eventService: EventService<LIST_EVENTS>,
  ) {}

  ngAfterViewInit(): void {
    this.getAllEmplacementLocations();
    this.eventService.listen(LIST_EVENTS.RELOAD_LIST, () => {
      this.getAllEmplacementLocations();
    });
  }

  hasChild = (_: number, node: EmplacementLocation) =>
    !!node.children && node.children.length > 0;

  createNewEmplacementLocation(node?: EmplacementLocation) {
    this.locationObject = { parent: node, parentId: node?.id } || {};
    this.showForm = true;
    this.openForm(
      this.locationObject as EmplacementLocationWithParent,
      FORM_MODE.CREATE,
    );
  }

  updateNode(node: EmplacementLocation) {
    if (node?.id) {
      this._loaderService.setLoading(true);
      this._emplacementLocationApi
        .getEmplacementLocationById(node?.id)
        .subscribe({
          next: (location: EmplacementLocationWithParent) => {
            this._loaderService.setLoading(false);
            if (location.parentId) {
              const parent = this.findParent(
                this.dataSource.data,
                location.parentId,
              );
              if (parent) location.parent = parent;
            }
            this.locationObject = location;
            this.openForm(location, FORM_MODE.VIEW);
          },
        });
    }
  }

  closeEmplacementLocationForm(event: boolean) {
    this.showForm = event;
  }

  getAllEmplacementLocations() {
    this._loaderService.setLoading(true);
    this._emplacementLocationApi
      .getAllEmplacementLocation()
      .pipe(
        finalize(() => {
          this._loaderService.setLoading(false);
        }),
      )
      .subscribe({
        next: (response) => {
          const expanded = this.treeControl.expansionModel.selected;

          this.dataSource.data = response;

          const exData = this.flattenTree(response);
          exData
            .filter((f) => expanded.some((e) => e.treeCode === f.treeCode))
            .forEach((n) => this.treeControl.expand(n));
        },
      });
  }

  onEditAction(event: boolean) {
    this.disabledTree = event;
  }

  findParent = (
    data: EmplacementLocationWithParent[],
    id: number,
  ): null | EmplacementLocationWithParent => {
    return data.reduce<EmplacementLocationWithParent | null>(
      (preValue, item) => {
        if (preValue) {
          return preValue;
        }
        if (item?.id === id) {
          return item;
        }
        if (item.children) {
          return this.findParent(item.children, id);
        }
        return null;
      },
      null,
    );
  };

  showSuccessMessage(event: MessageType) {
    const toastFunc =
      event.type == "error"
        ? this.toastService.error
        : this.toastService.success;
    toastFunc(event.text);
  }

  /**
   * Convert a tree structure to a flat array
   */
  private flattenTree(
    nodes: EmplacementLocationWithParent[],
  ): EmplacementLocationWithParent[] {
    return Array.prototype.concat.apply(
      nodes,
      nodes.map((n) => this.flattenTree(n.children || [])),
    );
  }

  openForm(row: EmplacementLocationWithParent, viewode: FORM_MODE): void {
    this.viewType = viewode;

    if (row.parentId) {
      const parent = this.findParent(this.dataSource.data, row.parentId);
      if (parent) row.parent = parent;
    }

    this.dialogService
      .showWithFormComponent(FormModalComponent, {
        referenceContent: EmplacementLocationCreationFormComponent,
        title: "EMPLACEMENT_LOCATION.FORM.DEFINITION",
        minWidth: 500,
        data: {
          viewType: this.viewType,
          ...row,
        },
      })
      .afterClosed()
      .subscribe(() => {
        if (viewode == FORM_MODE.CREATE || viewode == FORM_MODE.UPDATE)
          this.getAllEmplacementLocations();

        this.viewType = FORM_MODE.CREATE;
      });
  }
}
