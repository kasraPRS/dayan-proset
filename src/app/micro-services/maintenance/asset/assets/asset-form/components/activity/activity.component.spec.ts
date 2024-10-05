import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AssetActivityListComponent } from "./activity.component";

describe("AssetActivityListComponent", () => {
  let component: AssetActivityListComponent;
  let fixture: ComponentFixture<AssetActivityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetActivityListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetActivityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
