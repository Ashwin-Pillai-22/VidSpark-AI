
export enum Platform {
  YOUTUBE = 'YouTube',
  INSTAGRAM = 'Instagram'
}

export enum Mood {
  EDUCATIONAL = 'Educational',
  ENTERTAINING = 'Entertaining',
  INSPIRATIONAL = 'Inspirational',
  FUNNY = 'Funny',
  DRAMATIC = 'Dramatic',
  CHILL = 'Chill / Aesthetic',
  CONTROVERSIAL = 'Debate / Controversial',
  STORYTELLING = 'Storytelling'
}

export enum VideoDuration {
  SHORT = 'Shorts/Reels (< 60s)',
  MEDIUM = 'Standard (5-15 mins)',
  LONG = 'Deep Dive (15+ mins)'
}

export interface IdeaRequest {
  platform: Platform;
  topic: string;
  mood: Mood;
  duration: VideoDuration;
}

export interface VideoIdea {
  id: string;
  title: string;
  hook: string;
  visuals: string;
  script: string;
  hashtags: string;
  platform: Platform;
  topic: string;
  timestamp: number;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  creatorNiche: string;
  bio: string;
  youtubeHandle: string;
  instagramHandle: string;
  defaultPlatform: Platform;
  defaultMood: Mood;
  updatedAt: number;
}

export interface UserState {
  email: string | null;
  uid: string | null;
  isAuthenticated: boolean;
}
