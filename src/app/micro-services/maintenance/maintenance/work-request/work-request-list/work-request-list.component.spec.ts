import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorkRequestListComponent } from "./work-request-list.component";

describe("RequestListComponent", () => {
  let component: WorkRequestListComponent;
  let fixture: ComponentFixture<WorkRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkRequestListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
