import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AssetRequestListComponent } from "./request-list.component";

describe("AssetRequestListComponent", () => {
  let component: AssetRequestListComponent;
  let fixture: ComponentFixture<AssetRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetRequestListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
