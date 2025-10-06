CREATE TABLE IF NOT EXISTS "favorites" (
  "id" serial PRIMARY KEY NOT NULL,
  "game_id" integer NOT NULL,
  "user_ip_hash" varchar(64) NOT NULL,
  "anonymous_token" varchar(64) NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "favorites_user_game_idx" UNIQUE ("game_id", "user_ip_hash", "anonymous_token"),
  CONSTRAINT "favorites_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games" ("id") ON DELETE cascade
);
