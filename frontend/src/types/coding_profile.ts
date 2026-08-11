export interface PlatformConnection {
  username: string;
  verified: boolean;
  access_token?: string;
}

export interface ConnectedPlatforms {
  leetcode?: PlatformConnection;
  gfg?: PlatformConnection;
  codeforces?: PlatformConnection;
  codechef?: PlatformConnection;
  github?: PlatformConnection;
  hackerrank?: PlatformConnection;
}

export interface CachedStats {
  leetcode?: any;
  gfg?: any;
  codeforces?: any;
  codechef?: any;
  github?: any;
  last_synced_at?: string;
}

export interface Project {
  title: string;
  description: string;
  tech_stack: string[];
  github_url?: string;
  demo_url?: string;
  image_url?: string;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
}

export interface CodingProfile {
  id: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  is_public: boolean;
  profile_slug: string;
  platforms: ConnectedPlatforms;
  cached_stats: CachedStats;
  skills: string[];
  projects: Project[];
  social_links: SocialLinks;
}
