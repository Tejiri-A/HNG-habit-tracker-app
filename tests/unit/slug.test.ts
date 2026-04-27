import { describe, it, expect } from "vitest";
import { getHabitSlug } from "@/lib/slug";

describe("getHabitSlug", () => {
  it("returns lowercase hyphenated slug for a basic habit name", () => {
    expect(getHabitSlug("Morning Exercise")).toBe("morning-exercise");
    expect(getHabitSlug("Read Books")).toBe("read-books");
  });

  it("trims outer spaces and collapses repeated internal spaces", () => {
    expect(getHabitSlug("  Morning  Jog  ")).toBe("morning-jog");
    expect(getHabitSlug("   Drink Water   ")).toBe("drink-water");
    expect(getHabitSlug("Study    Math")).toBe("study-math");
  });

  it("removes non alphanumeric characters except hyphens", () => {
    expect(getHabitSlug("Learn C++")).toBe("learn-c");
    expect(getHabitSlug("Morning @ Gym!")).toBe("morning-gym");
    expect(getHabitSlug("Code/Review")).toBe("codereview");
    expect(getHabitSlug("Yoga (30min)")).toBe("yoga-30min");
  });
});
