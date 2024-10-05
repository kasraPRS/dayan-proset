import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorkRequestFormComponent } from "./work-request-form.component";

describe("RequestFormComponent", () => {
  let component: WorkRequestFormComponent;
  let fixture: ComponentFixture<WorkRequestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkRequestFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
