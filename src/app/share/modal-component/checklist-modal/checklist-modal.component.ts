import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CheckList, Task } from "@proset/maintenance-client";
import { ScopeVars } from "../../datatable/type";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { debounceTime, of, startWith, switchMap } from "rxjs";

@Component({
  selector: "proset-activity-modal",
  templateUrl: "./checklist-modal.component.html",
  styleUrl: "./checklist-modal.component.less",
})
export class ChecklistModalComponent implements OnInit, AfterViewInit {
  checkLists: CheckList[];
  filteredLists: CheckList[];
  selectedRow: any[];
  scopeVars: ScopeVars = {};
  form: FormGroup;
  selectedItems: CheckList[];
  search = new FormControl();
  checkListControl = new FormControl();
  taskNames: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<ChecklistModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private cdr: ChangeDetectorRef,
    private _fb: FormBuilder,
  ) {
    this.scopeVars = data;
  }

  onClose() {
    this.dialogRef.close();
    this.cdr.detectChanges();
  }

  showTasks(taskList: Task[]) {
    this.taskNames = taskList.map((item) => item.name);
    return this.taskNames.join();
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.checkLists = this.scopeVars.data;
    this.filteredLists = [...this.checkLists];
    this.cdr.detectChanges();
  }

  onSubmitClick() {
    this.dialogRef.close(this.selectedRow);
    this.cdr.detectChanges();
  }

  $search = this.search.valueChanges.pipe(
    startWith(null),
    debounceTime(200),
    switchMap((res: string) => {
      if (!res) {
        return of(this.filteredLists);
      }
      const searchTerm = res.toLowerCase();
      return of(
        this.filteredLists.filter(
          (checkList) => checkList.name?.toLowerCase().includes(searchTerm),
        ),
      );
    }),
  );

  selectionChange(option: any) {
    let value = this.checkListControl.value || [];
    if (option[0].selected) value.push(option[0].value);
    else value = value.filter((x: any) => x != option[0].value);
    this.checkListControl.setValue(value);
    this.selectedRow = this.checkListControl.value;
    this.selectedRow = this.selectedRow.filter(
      (filter) => filter !== undefined && filter !== null,
    );
  }
}
