import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StatusCountCardComponent } from "./status-count-card.component";

describe("StatusCountCardComponent", () => {
  let component: StatusCountCardComponent;
  let fixture: ComponentFixture<StatusCountCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusCountCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusCountCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
