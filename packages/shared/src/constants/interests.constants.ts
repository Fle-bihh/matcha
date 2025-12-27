export const USER_INTERESTS = [
  "music",
  "sports",
  "travel",
  "technology",
  "art",
  "gaming",
  "fitness",
  "cooking",
  "reading",
  "movies",
  "photography",
  "fashion",
  "nature",
  "dancing",
  "writing",
  "yoga",
  "hiking",
  "gardening",
  "crafts",
  "volunteering",
  "pets",
] as const;

export type UserInterest = (typeof USER_INTERESTS)[number];

export const MAX_USER_INTERESTS = 5;
