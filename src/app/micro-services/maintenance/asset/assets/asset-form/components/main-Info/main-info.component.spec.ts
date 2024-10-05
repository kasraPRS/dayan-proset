import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AssetMainInfoComponent } from "./main-info.component";

describe("AssetMainInfoComponent", () => {
  let component: AssetMainInfoComponent;
  let fixture: ComponentFixture<AssetMainInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetMainInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetMainInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
