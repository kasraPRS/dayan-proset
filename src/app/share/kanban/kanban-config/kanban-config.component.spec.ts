import { ComponentFixture, TestBed } from "@angular/core/testing";

import { KanbanConfigComponent } from "./kanban-config.component";

describe("KanbanConfigComponent", () => {
  let component: KanbanConfigComponent;
  let fixture: ComponentFixture<KanbanConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KanbanConfigComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KanbanConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
