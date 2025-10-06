CREATE TABLE IF NOT EXISTS "games" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"title_en" varchar(255),
	"description" text,
	"description_en" text,
	"instructions" text,
	"instructions_en" text,
	"thumbnail_url" varchar(500),
	"iframe_url" varchar(500) NOT NULL,
	"featured" boolean DEFAULT false,
	"is_new" boolean DEFAULT true,
	"is_hot" boolean DEFAULT false,
	"status" varchar(20) DEFAULT 'active',
	"published_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "games_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"name_en" varchar(100),
	"slug" varchar(100) NOT NULL,
	"description" text,
	"description_en" text,
	"icon_url" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"name_en" varchar(50),
	"slug" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name"),
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"user_ip_hash" varchar(64),
	"anonymous_token" varchar(128),
	"user_agent" varchar(500),
	"status" varchar(20) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "game_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" integer NOT NULL,
	"play_count" integer DEFAULT 0 NOT NULL,
	"play_count_today" integer DEFAULT 0 NOT NULL,
	"play_count_week" integer DEFAULT 0 NOT NULL,
	"play_count_month" integer DEFAULT 0 NOT NULL,
	"average_rating" numeric(3, 2) DEFAULT '0',
	"rating_count" integer DEFAULT 0 NOT NULL,
	"rating_1_star" integer DEFAULT 0 NOT NULL,
	"rating_2_star" integer DEFAULT 0 NOT NULL,
	"rating_3_star" integer DEFAULT 0 NOT NULL,
	"rating_4_star" integer DEFAULT 0 NOT NULL,
	"rating_5_star" integer DEFAULT 0 NOT NULL,
	"hot_score" integer DEFAULT 0 NOT NULL,
	"last_played_at" timestamp,
	"last_rated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "game_stats_game_id_unique" UNIQUE("game_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "game_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "game_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "play_counters" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" integer NOT NULL,
	"date" date NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "screenshots" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" integer NOT NULL,
	"url" varchar(500) NOT NULL,
	"public_id" varchar(255),
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admin_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"operator" varchar(100) NOT NULL,
	"action" varchar(50) NOT NULL,
	"entity_type" varchar(50) NOT NULL,
	"entity_id" varchar(50),
	"details" jsonb,
	"ip_address" varchar(45),
	"user_agent" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "games_slug_idx" ON "games" ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ratings_game_id_idx" ON "ratings" ("game_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ratings_user_ip_hash_idx" ON "ratings" ("user_ip_hash");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "game_stats_game_id_idx" ON "game_stats" ("game_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "game_categories_game_category_idx" ON "game_categories" ("game_id","category_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "game_tags_game_tag_idx" ON "game_tags" ("game_id","tag_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "play_counters_game_date_idx" ON "play_counters" ("game_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "screenshots_game_order_idx" ON "screenshots" ("game_id","order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "admin_logs_operator_idx" ON "admin_logs" ("operator");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "admin_logs_entity_idx" ON "admin_logs" ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "admin_logs_created_at_idx" ON "admin_logs" ("created_at");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ratings" ADD CONSTRAINT "ratings_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_stats" ADD CONSTRAINT "game_stats_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_categories" ADD CONSTRAINT "game_categories_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_categories" ADD CONSTRAINT "game_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_tags" ADD CONSTRAINT "game_tags_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_tags" ADD CONSTRAINT "game_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "play_counters" ADD CONSTRAINT "play_counters_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "screenshots" ADD CONSTRAINT "screenshots_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_rating_check" CHECK ("rating" >= 1 AND "rating" <= 5);
