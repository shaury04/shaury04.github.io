import { describe, expect, it } from "vitest";
import { withBase } from "./paths";

describe("withBase", () => {
  it("creates root-relative paths", () => {
    expect(withBase("/work/turbofan/", "/")).toBe("/work/turbofan/");
  });

  it("prefixes project-site paths and homepage anchors", () => {
    expect(withBase("/og.png", "/portfolio/")).toBe("/portfolio/og.png");
    expect(withBase("/#work", "/portfolio/")).toBe("/portfolio/#work");
  });

  it("preserves external and mail links", () => {
    expect(withBase("https://github.com/shaury04", "/portfolio/")).toBe("https://github.com/shaury04");
    expect(withBase("mailto:shaury04@gmail.com", "/portfolio/")).toBe("mailto:shaury04@gmail.com");
  });
});
