/* MENTOR_TRACE_STAGE3_HABIT_A91 */

export function calculateCurrentStreak(
  completions: string[],
  today?: string,
): number {
  if (!completions || completions.length === 0) return 0;

  // 1. Sanitize: Unique and Sorted 
  const sanitizedDates = [...new Set(completions)].sort();

  // 2. Today Anchor 
  const todayStr = today || new Date().toISOString().split("T")[0];

  if (!sanitizedDates.includes(todayStr)) {
    return 0;
  }

  // 3. Backward Counting
  let streak = 1;
  let currentCheckDate = todayStr;

  while (true) {
    const dateObj = new Date(currentCheckDate);
    dateObj.setDate(dateObj.getDate() - 1);
    const prevDateStr = dateObj.toISOString().split("T")[0];

    if (sanitizedDates.includes(prevDateStr)) {
      streak++;
      currentCheckDate = prevDateStr;
    } else {
      break;
    }
  }

  return streak;
}
