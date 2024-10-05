import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DatatableActionComponent } from "./datatable-action.component";

describe("DatatableActionComponent", () => {
  let component: DatatableActionComponent;
  let fixture: ComponentFixture<DatatableActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatatableActionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatatableActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
