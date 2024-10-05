import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AssetWorkOrderListComponent } from "./work-order-list.component";

describe("WorkOrdersListComponent", () => {
  let component: AssetWorkOrderListComponent;
  let fixture: ComponentFixture<AssetWorkOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetWorkOrderListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetWorkOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
