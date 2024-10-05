import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { KanbanCardComponent } from "./kanban-card.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

describe("KanbanCardComponent", () => {
  let component: KanbanCardComponent;
  let fixture: ComponentFixture<KanbanCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KanbanCardComponent],
      imports: [FormsModule, ReactiveFormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have header", () => {
    expect(component).toBeTruthy();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector("h4.card-title").textContent).toContain(
      "header",
    );
    expect(compiled.querySelector("h6").textContent).toContain("summary");
  });
});
