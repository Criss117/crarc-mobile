CREATE TABLE `app_config` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`theme` text DEFAULT 'light' NOT NULL,
	`default_weight_unit` text DEFAULT 'kg' NOT NULL,
	`active_workout_session_id` text,
	FOREIGN KEY (`active_workout_session_id`) REFERENCES `workout_session`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `exercise` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`search_name` text NOT NULL,
	`image` text,
	`gif_url` text,
	`instructions` text NOT NULL,
	`instructions_step` text NOT NULL,
	`category` text NOT NULL,
	`equipment` text NOT NULL,
	`target` text NOT NULL,
	`favorite` integer DEFAULT false NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_exercise_name` ON `exercise` (`name`);--> statement-breakpoint
CREATE INDEX `idx_exercise_search_name` ON `exercise` (`search_name`);--> statement-breakpoint
CREATE INDEX `idx_exercise_favorite` ON `exercise` (`favorite`);--> statement-breakpoint
CREATE TABLE `exercise_muscle` (
	`exercise_id` text NOT NULL,
	`muscle_id` text NOT NULL,
	`type` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	PRIMARY KEY(`exercise_id`, `muscle_id`),
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`muscle_id`) REFERENCES `muscle`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_exercise_muscle_exercise` ON `exercise_muscle` (`exercise_id`);--> statement-breakpoint
CREATE INDEX `idx_exercise_muscle_muscle` ON `exercise_muscle` (`muscle_id`);--> statement-breakpoint
CREATE TABLE `muscle` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`search_name` text NOT NULL,
	`image_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_muscle_name` ON `muscle` (`name`);--> statement-breakpoint
CREATE INDEX `idx_muscle_search_name` ON `muscle` (`search_name`);--> statement-breakpoint
CREATE TABLE `workout` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`search_name` text NOT NULL,
	`description` text,
	`favorite` integer DEFAULT false NOT NULL,
	`is_system` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_workout_name` ON `workout` (`name`);--> statement-breakpoint
CREATE INDEX `idx_workout_updated_at` ON `workout` (`updated_at`);--> statement-breakpoint
CREATE TABLE `workout_exercise` (
	`workout_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`order_index` integer NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	PRIMARY KEY(`workout_id`, `exercise_id`),
	FOREIGN KEY (`workout_id`) REFERENCES `workout`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "chk_workout_exercise_order_index" CHECK("workout_exercise"."order_index" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_workout_order_index` ON `workout_exercise` (`workout_id`,`order_index`);--> statement-breakpoint
CREATE INDEX `idx_workout_exercise_workout` ON `workout_exercise` (`workout_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_exercise_exercise` ON `workout_exercise` (`exercise_id`);--> statement-breakpoint
CREATE TABLE `workout_session` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_id` text,
	`started_at` integer NOT NULL,
	`ended_at` integer,
	`notes` text,
	`completed` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`workout_id`) REFERENCES `workout`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "chk_workout_session_dates" CHECK("workout_session"."ended_at" IS NULL OR "workout_session"."ended_at" > "workout_session"."started_at")
);
--> statement-breakpoint
CREATE INDEX `idx_workout_session_updated_at` ON `workout_session` (`updated_at`);--> statement-breakpoint
CREATE INDEX `idx_workout_session_started_at` ON `workout_session` (`started_at`);--> statement-breakpoint
CREATE INDEX `idx_workout_session_workout` ON `workout_session` (`workout_id`);--> statement-breakpoint
CREATE TABLE `workout_session_exercise` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_session_id` text NOT NULL,
	`exercise_id` text,
	`order_index` integer NOT NULL,
	`notes` text,
	`weight_display_unit` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`workout_session_id`) REFERENCES `workout_session`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "chk_workout_session_exercise_order_index" CHECK("workout_session_exercise"."order_index" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_workout_session_exercise_order` ON `workout_session_exercise` (`workout_session_id`,`order_index`);--> statement-breakpoint
CREATE INDEX `idx_workout_session_exercise_session` ON `workout_session_exercise` (`workout_session_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_session_exercise_exercise` ON `workout_session_exercise` (`exercise_id`);--> statement-breakpoint
CREATE TABLE `workout_session_exercise_set` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_session_exercise_id` text NOT NULL,
	`reps` integer NOT NULL,
	`rir` integer,
	`weight_in_grams` integer NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`workout_session_exercise_id`) REFERENCES `workout_session_exercise`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "chk_workout_set_reps" CHECK("workout_session_exercise_set"."reps" > 0),
	CONSTRAINT "chk_workout_set_rir" CHECK("workout_session_exercise_set"."rir" IS NULL OR "workout_session_exercise_set"."rir" >= 0),
	CONSTRAINT "chk_workout_set_weight" CHECK("workout_session_exercise_set"."weight_in_grams" >= 0)
);
--> statement-breakpoint
CREATE INDEX `idx_workout_set_session_exercise` ON `workout_session_exercise_set` (`workout_session_exercise_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_set_weight` ON `workout_session_exercise_set` (`weight_in_grams`);