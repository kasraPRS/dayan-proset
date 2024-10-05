import { Component, Input, OnInit } from "@angular/core";
import { CheckList, Task } from "@proset/maintenance-client";

@Component({
  selector: "proset-repair-planning-checklist",
  templateUrl: "./repair-planning-checklist.component.html",
  styleUrl: "./repair-planning-checklist.component.less",
})
export class RepairPlanningChecklistComponent implements OnInit {
  @Input() checkList: CheckList;
  tasksList: Task[];

  ngOnInit() {
    this.tasksList = this.checkList?.taskList!.filter(
      (task) => task.active === true,
    );
  }
}
