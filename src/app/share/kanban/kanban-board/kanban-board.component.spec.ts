import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { KanbanBoardComponent } from "./kanban-board.component";
import { KanbanColumnComponent } from "../kanban-column/kanban-column.component";
import { KanbanCardComponent } from "../kanban-card/kanban-card.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

describe("BoardComponent", () => {
  let component: KanbanBoardComponent;
  let fixture: ComponentFixture<KanbanBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        KanbanBoardComponent,
        KanbanColumnComponent,
        KanbanCardComponent,
      ],
      imports: [FormsModule, ReactiveFormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
