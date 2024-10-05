import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AssetFailureModeListComponent } from "./failure-mode.component";

describe("AssetFailureModeListComponent", () => {
  let component: AssetFailureModeListComponent;
  let fixture: ComponentFixture<AssetFailureModeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetFailureModeListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetFailureModeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
