export function validateHabitName(name: string): {
  valid: boolean;
  value: string;
  error: string | null;
} {
  const trimmedName = name.trim();
  if (!trimmedName)
    return { error: "Habit name is required", valid: false, value: name };
  if (trimmedName.length > 60)
    return {
      error: "Habit name must be 60 characters or fewer",
      valid: false,
      value: name,
    };
  return { error: null, valid: true, value: trimmedName };
}
