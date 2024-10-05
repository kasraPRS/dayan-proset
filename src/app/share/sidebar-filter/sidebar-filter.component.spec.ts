import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SidenavFilterComponent } from "./sidenav-filter.component";
describe("SidenavComponent", () => {
  let component: SidenavFilterComponent;
  let fixture: ComponentFixture<SidenavFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidenavFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
