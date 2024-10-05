import { ProsetJalaliDatePipe } from "./proset.jalalidate.pipe";
import { ShareService } from "../service/share.service";

describe("ProsetPipe", () => {
  let shareService: ShareService;
  it("create an instance", () => {
    const pipe = new ProsetJalaliDatePipe(shareService);
    expect(pipe).toBeTruthy();
  });
});
