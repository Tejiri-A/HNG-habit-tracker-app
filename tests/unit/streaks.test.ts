import { describe, it, expect } from "vitest";
import { calculateCurrentStreak } from "../../src/lib/streaks";

describe("calculateCurrentStreak", () => {
  it("returns 0 when completions is empty", () => {
    // Example: [] => 0 
    expect(calculateCurrentStreak([])).toBe(0);
  });

  it("returns 0 when today is not completed", () => {
    // Example: [yesterday] => 0 
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    expect(calculateCurrentStreak([yesterdayStr])).toBe(0);
  });

  it("returns the correct streak for consecutive completed days", () => {
    // Example: [today, yesterday] => 2 
    const today = new Date().toISOString().split("T")[0];
    const yesterdayObj = new Date();
    yesterdayObj.setDate(yesterdayObj.getDate() - 1);
    const yesterday = yesterdayObj.toISOString().split("T")[0];

    expect(calculateCurrentStreak([today, yesterday])).toBe(2);
  });

  it("ignores duplicate completion dates", () => {
    // Rule: remove duplicates before calculating 
    const today = new Date().toISOString().split("T")[0];
    expect(calculateCurrentStreak([today, today, today])).toBe(1);
  });

  it("breaks the streak when a calendar day is missing", () => {
    // Example: [today, twoDaysAgo] => 1 
    const today = new Date().toISOString().split("T")[0];
    const twoDaysAgoObj = new Date();
    twoDaysAgoObj.setDate(twoDaysAgoObj.getDate() - 2);
    const twoDaysAgo = twoDaysAgoObj.toISOString().split("T")[0];

    expect(calculateCurrentStreak([today, twoDaysAgo])).toBe(1);
  });
});
