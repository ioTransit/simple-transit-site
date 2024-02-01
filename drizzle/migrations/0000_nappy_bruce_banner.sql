CREATE TABLE `agency` (
	`agency_id` numeric PRIMARY KEY NOT NULL,
	`agency_name` numeric NOT NULL,
	`agency_url` numeric NOT NULL,
	`agency_timezone` numeric NOT NULL,
	`agency_lang` numeric,
	`agency_phone` numeric,
	`agency_fare_url` numeric,
	`agency_email` numeric
);
--> statement-breakpoint
CREATE TABLE `areas` (
	`area_id` numeric PRIMARY KEY NOT NULL,
	`area_name` numeric
);
--> statement-breakpoint
CREATE TABLE `attributions` (
	`attribution_id` numeric PRIMARY KEY NOT NULL,
	`agency_id` numeric,
	`route_id` numeric,
	`trip_id` numeric,
	`organization_name` numeric NOT NULL,
	`is_producer` integer,
	`is_operator` integer,
	`is_authority` integer,
	`attribution_url` numeric,
	`attribution_email` numeric,
	`attribution_phone` numeric
);
--> statement-breakpoint
CREATE TABLE `board_alight` (
	`trip_id` numeric NOT NULL,
	`stop_id` numeric NOT NULL,
	`stop_sequence` integer NOT NULL,
	`record_use` integer NOT NULL,
	`schedule_relationship` integer,
	`boardings` integer,
	`alightings` integer,
	`current_load` integer,
	`load_count` integer,
	`load_type` integer,
	`rack_down` integer,
	`bike_boardings` integer,
	`bike_alightings` integer,
	`ramp_used` integer,
	`ramp_boardings` integer,
	`ramp_alightings` integer,
	`service_date` integer,
	`service_arrival_time` numeric,
	`service_arrival_timestamp` integer,
	`service_departure_time` numeric,
	`service_departure_timestamp` integer,
	`source` integer
);
--> statement-breakpoint
CREATE TABLE `calendar` (
	`service_id` numeric PRIMARY KEY NOT NULL,
	`monday` integer NOT NULL,
	`tuesday` integer NOT NULL,
	`wednesday` integer NOT NULL,
	`thursday` integer NOT NULL,
	`friday` integer NOT NULL,
	`saturday` integer NOT NULL,
	`sunday` integer NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `calendar_attributes` (
	`service_id` numeric PRIMARY KEY NOT NULL,
	`service_description` numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE `calendar_dates` (
	`service_id` numeric NOT NULL,
	`date` integer NOT NULL,
	`exception_type` integer NOT NULL,
	`holiday_name` numeric,
	PRIMARY KEY(`date`, `service_id`)
);
--> statement-breakpoint
CREATE TABLE `deadhead_times` (
	`id` integer PRIMARY KEY NOT NULL,
	`deadhead_id` numeric NOT NULL,
	`arrival_time` numeric NOT NULL,
	`arrival_timestamp` integer,
	`departure_time` numeric NOT NULL,
	`departure_timestamp` integer,
	`ops_location_id` numeric,
	`stop_id` numeric,
	`location_sequence` integer NOT NULL,
	`shape_dist_traveled` real
);
--> statement-breakpoint
CREATE TABLE `deadheads` (
	`deadhead_id` numeric PRIMARY KEY NOT NULL,
	`service_id` numeric NOT NULL,
	`block_id` numeric NOT NULL,
	`shape_id` numeric,
	`to_trip_id` numeric,
	`from_trip_id` numeric,
	`to_deadhead_id` numeric,
	`from_deadhead_id` numeric
);
--> statement-breakpoint
CREATE TABLE `directions` (
	`route_id` numeric NOT NULL,
	`direction_id` integer,
	`direction` numeric NOT NULL,
	PRIMARY KEY(`direction_id`, `route_id`)
);
--> statement-breakpoint
CREATE TABLE `fare_attributes` (
	`fare_id` numeric PRIMARY KEY NOT NULL,
	`price` real NOT NULL,
	`currency_type` numeric NOT NULL,
	`payment_method` integer NOT NULL,
	`transfers` integer,
	`agency_id` numeric,
	`transfer_duration` integer
);
--> statement-breakpoint
CREATE TABLE `fare_leg_rules` (
	`leg_group_id` numeric,
	`network_id` numeric,
	`from_area_id` numeric,
	`to_area_id` numeric,
	`fare_product_id` numeric NOT NULL,
	PRIMARY KEY(`fare_product_id`, `from_area_id`, `network_id`, `to_area_id`)
);
--> statement-breakpoint
CREATE TABLE `fare_products` (
	`fare_product_id` numeric NOT NULL,
	`fare_product_name` numeric,
	`fare_media_id` numeric,
	`amount` real NOT NULL,
	`currency` numeric NOT NULL,
	PRIMARY KEY(`fare_media_id`, `fare_product_id`)
);
--> statement-breakpoint
CREATE TABLE `fare_rules` (
	`fare_id` numeric NOT NULL,
	`route_id` numeric,
	`origin_id` numeric,
	`destination_id` numeric,
	`contains_id` numeric
);
--> statement-breakpoint
CREATE TABLE `fare_transfer_rules` (
	`from_leg_group_id` numeric,
	`to_leg_group_id` numeric,
	`transfer_count` integer,
	`transfer_id` numeric,
	`duration_limit` integer,
	`duration_limit_type` integer,
	`fare_transfer_type` integer NOT NULL,
	`fare_product_id` numeric,
	PRIMARY KEY(`duration_limit`, `fare_product_id`, `from_leg_group_id`, `to_leg_group_id`, `transfer_count`)
);
--> statement-breakpoint
CREATE TABLE `feed_info` (
	`feed_publisher_name` numeric NOT NULL,
	`feed_publisher_url` numeric NOT NULL,
	`feed_lang` numeric NOT NULL,
	`default_lang` numeric,
	`feed_start_date` integer,
	`feed_end_date` integer,
	`feed_version` numeric,
	`feed_contact_email` numeric,
	`feed_contact_url` numeric
);
--> statement-breakpoint
CREATE TABLE `frequencies` (
	`trip_id` numeric NOT NULL,
	`start_time` numeric NOT NULL,
	`start_timestamp` integer,
	`end_time` numeric NOT NULL,
	`end_timestamp` integer,
	`headway_secs` integer NOT NULL,
	`exact_times` integer,
	PRIMARY KEY(`start_time`, `trip_id`)
);
--> statement-breakpoint
CREATE TABLE `levels` (
	`level_id` numeric PRIMARY KEY NOT NULL,
	`level_index` real NOT NULL,
	`level_name` numeric
);
--> statement-breakpoint
CREATE TABLE `Note` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`createdAt` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` numeric NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `ops_locations` (
	`ops_location_id` numeric PRIMARY KEY NOT NULL,
	`ops_location_code` numeric,
	`ops_location_name` numeric NOT NULL,
	`ops_location_desc` numeric,
	`ops_location_lat` real NOT NULL,
	`ops_location_lon` real NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Password` (
	`hash` text NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pathways` (
	`pathway_id` numeric PRIMARY KEY NOT NULL,
	`from_stop_id` numeric NOT NULL,
	`to_stop_id` numeric NOT NULL,
	`pathway_mode` integer NOT NULL,
	`is_bidirectional` integer NOT NULL,
	`length` real,
	`traversal_time` integer,
	`stair_count` integer,
	`max_slope` real,
	`min_width` real,
	`signposted_as` numeric,
	`reversed_signposted_as` numeric
);
--> statement-breakpoint
CREATE TABLE `_prisma_migrations` (
	`id` text PRIMARY KEY NOT NULL,
	`checksum` text NOT NULL,
	`finished_at` numeric,
	`migration_name` text NOT NULL,
	`logs` text,
	`rolled_back_at` numeric,
	`started_at` numeric DEFAULT (current_timestamp) NOT NULL,
	`applied_steps_count` numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ride_feed_info` (
	`ride_files` integer NOT NULL,
	`ride_start_date` integer,
	`ride_end_date` integer,
	`gtfs_feed_date` integer,
	`default_currency_type` numeric,
	`ride_feed_version` numeric
);
--> statement-breakpoint
CREATE TABLE `rider_trip` (
	`rider_id` numeric PRIMARY KEY NOT NULL,
	`agency_id` numeric,
	`trip_id` numeric,
	`boarding_stop_id` numeric,
	`boarding_stop_sequence` integer,
	`alighting_stop_id` numeric,
	`alighting_stop_sequence` integer,
	`service_date` integer,
	`boarding_time` numeric,
	`boarding_timestamp` integer,
	`alighting_time` numeric,
	`alighting_timestamp` integer,
	`rider_type` integer,
	`rider_type_description` numeric,
	`fare_paid` real,
	`transaction_type` integer,
	`fare_media` integer,
	`accompanying_device` integer,
	`transfer_status` integer
);
--> statement-breakpoint
CREATE TABLE `ridership` (
	`total_boardings` integer NOT NULL,
	`total_alightings` integer NOT NULL,
	`ridership_start_date` integer,
	`ridership_end_date` integer,
	`ridership_start_time` numeric,
	`ridership_start_timestamp` integer,
	`ridership_end_time` numeric,
	`ridership_end_timestamp` integer,
	`service_id` numeric,
	`monday` integer,
	`tuesday` integer,
	`wednesday` integer,
	`thursday` integer,
	`friday` integer,
	`saturday` integer,
	`sunday` integer,
	`agency_id` numeric,
	`route_id` numeric,
	`direction_id` integer,
	`trip_id` numeric,
	`stop_id` numeric
);
--> statement-breakpoint
CREATE TABLE `route_attributes` (
	`route_id` numeric PRIMARY KEY NOT NULL,
	`category` integer NOT NULL,
	`subcategory` integer NOT NULL,
	`running_way` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `routes` (
	`route_id` numeric PRIMARY KEY NOT NULL,
	`agency_id` numeric,
	`route_short_name` numeric,
	`route_long_name` numeric,
	`route_desc` numeric,
	`route_type` integer NOT NULL,
	`route_url` numeric,
	`route_color` numeric,
	`route_text_color` numeric,
	`route_sort_order` integer,
	`continuous_pickup` integer,
	`continuous_drop_off` integer,
	`network_id` numeric
);
--> statement-breakpoint
CREATE TABLE `run_event` (
	`run_event_id` numeric PRIMARY KEY NOT NULL,
	`piece_id` numeric NOT NULL,
	`event_type` integer NOT NULL,
	`event_name` numeric,
	`event_time` numeric NOT NULL,
	`event_duration` integer NOT NULL,
	`event_from_location_type` integer,
	`event_from_location_id` numeric,
	`event_to_location_type` integer,
	`event_to_location_id` numeric
);
--> statement-breakpoint
CREATE TABLE `runs_pieces` (
	`run_id` numeric NOT NULL,
	`piece_id` numeric PRIMARY KEY NOT NULL,
	`start_type` integer NOT NULL,
	`start_trip_id` numeric NOT NULL,
	`start_trip_position` integer,
	`end_type` integer NOT NULL,
	`end_trip_id` numeric NOT NULL,
	`end_trip_position` integer
);
--> statement-breakpoint
CREATE TABLE `service_alert_targets` (
	`alert_id` numeric PRIMARY KEY NOT NULL,
	`stop_id` numeric,
	`route_id` numeric,
	`is_updated` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `service_alerts` (
	`id` numeric PRIMARY KEY NOT NULL,
	`cause` integer NOT NULL,
	`start_time` numeric NOT NULL,
	`end_time` numeric NOT NULL,
	`headline` numeric NOT NULL,
	`description` numeric NOT NULL,
	`is_updated` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `shapes` (
	`shape_id` numeric NOT NULL,
	`shape_pt_lat` real NOT NULL,
	`shape_pt_lon` real NOT NULL,
	`shape_pt_sequence` integer NOT NULL,
	`shape_dist_traveled` real,
	PRIMARY KEY(`shape_id`, `shape_pt_sequence`)
);
--> statement-breakpoint
CREATE TABLE `stop_areas` (
	`area_id` numeric NOT NULL,
	`stop_id` numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stop_attributes` (
	`stop_id` numeric PRIMARY KEY NOT NULL,
	`accessibility_id` integer,
	`cardinal_direction` numeric,
	`relative_position` numeric,
	`stop_city` numeric
);
--> statement-breakpoint
CREATE TABLE `stop_time_updates` (
	`trip_id` numeric,
	`trip_start_time` numeric,
	`direction_id` integer,
	`route_id` numeric,
	`stop_id` numeric,
	`stop_sequence` integer,
	`arrival_delay` integer,
	`departure_delay` integer,
	`departure_timestamp` numeric,
	`arrival_timestamp` numeric,
	`schedule_relationship` numeric,
	`is_updated` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stop_times` (
	`trip_id` numeric NOT NULL,
	`arrival_time` numeric,
	`arrival_timestamp` integer,
	`departure_time` numeric,
	`departure_timestamp` integer,
	`stop_id` numeric NOT NULL,
	`stop_sequence` integer NOT NULL,
	`stop_headsign` numeric,
	`pickup_type` integer,
	`drop_off_type` integer,
	`continuous_pickup` integer,
	`continuous_drop_off` integer,
	`shape_dist_traveled` real,
	`timepoint` integer,
	PRIMARY KEY(`stop_sequence`, `trip_id`)
);
--> statement-breakpoint
CREATE TABLE `stops` (
	`stop_id` numeric PRIMARY KEY NOT NULL,
	`stop_code` numeric,
	`stop_name` numeric,
	`tts_stop_name` numeric,
	`stop_desc` numeric,
	`stop_lat` real,
	`stop_lon` real,
	`zone_id` numeric,
	`stop_url` numeric,
	`location_type` integer,
	`parent_station` numeric,
	`stop_timezone` numeric,
	`wheelchair_boarding` integer,
	`level_id` numeric,
	`platform_code` numeric
);
--> statement-breakpoint
CREATE TABLE `timetable_notes` (
	`note_id` numeric PRIMARY KEY NOT NULL,
	`symbol` numeric,
	`note` numeric
);
--> statement-breakpoint
CREATE TABLE `timetable_notes_references` (
	`note_id` numeric,
	`timetable_id` numeric,
	`route_id` numeric,
	`trip_id` numeric,
	`stop_id` numeric,
	`stop_sequence` integer,
	`show_on_stoptime` integer
);
--> statement-breakpoint
CREATE TABLE `timetable_pages` (
	`timetable_page_id` numeric PRIMARY KEY NOT NULL,
	`timetable_page_label` numeric,
	`filename` numeric
);
--> statement-breakpoint
CREATE TABLE `timetable_stop_order` (
	`id` integer PRIMARY KEY NOT NULL,
	`timetable_id` numeric,
	`stop_id` numeric,
	`stop_sequence` integer
);
--> statement-breakpoint
CREATE TABLE `timetables` (
	`id` integer PRIMARY KEY NOT NULL,
	`timetable_id` numeric,
	`route_id` numeric,
	`direction_id` integer,
	`start_date` integer,
	`end_date` integer,
	`monday` integer NOT NULL,
	`tuesday` integer NOT NULL,
	`wednesday` integer NOT NULL,
	`thursday` integer NOT NULL,
	`friday` integer NOT NULL,
	`saturday` integer NOT NULL,
	`sunday` integer NOT NULL,
	`start_time` numeric,
	`start_timestamp` integer,
	`end_time` numeric,
	`end_timestamp` integer,
	`timetable_label` numeric,
	`service_notes` numeric,
	`orientation` numeric,
	`timetable_page_id` numeric,
	`timetable_sequence` integer,
	`direction_name` numeric,
	`include_exceptions` integer,
	`show_trip_continuation` integer
);
--> statement-breakpoint
CREATE TABLE `transfers` (
	`from_stop_id` numeric,
	`to_stop_id` numeric,
	`from_route_id` numeric,
	`to_route_id` numeric,
	`from_trip_id` numeric,
	`to_trip_id` numeric,
	`transfer_type` integer,
	`min_transfer_time` integer,
	PRIMARY KEY(`from_route_id`, `from_stop_id`, `from_trip_id`, `to_route_id`, `to_stop_id`, `to_trip_id`)
);
--> statement-breakpoint
CREATE TABLE `translations` (
	`table_name` numeric NOT NULL,
	`field_name` numeric NOT NULL,
	`language` numeric NOT NULL,
	`translation` numeric NOT NULL,
	`record_id` numeric,
	`record_sub_id` numeric,
	`field_value` numeric,
	PRIMARY KEY(`field_name`, `field_value`, `language`, `record_id`, `record_sub_id`, `table_name`)
);
--> statement-breakpoint
CREATE TABLE `trip_capacity` (
	`agency_id` numeric,
	`trip_id` numeric,
	`service_date` integer,
	`vehicle_description` numeric,
	`seated_capacity` integer,
	`standing_capacity` integer,
	`wheelchair_capacity` integer,
	`bike_capacity` integer
);
--> statement-breakpoint
CREATE TABLE `trip_updates` (
	`update_id` numeric PRIMARY KEY NOT NULL,
	`vehicle_id` numeric,
	`trip_id` numeric,
	`trip_start_time` numeric,
	`direction_id` integer,
	`route_id` numeric,
	`start_date` numeric,
	`timestamp` numeric,
	`schedule_relationship` numeric,
	`is_updated` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `trips` (
	`route_id` numeric NOT NULL,
	`service_id` numeric NOT NULL,
	`trip_id` numeric PRIMARY KEY NOT NULL,
	`trip_headsign` numeric,
	`trip_short_name` numeric,
	`direction_id` integer,
	`block_id` numeric,
	`shape_id` numeric,
	`wheelchair_accessible` integer,
	`bikes_allowed` integer
);
--> statement-breakpoint
CREATE TABLE `trips_dated_vehicle_journeys` (
	`trip_id` numeric NOT NULL,
	`operating_day_date` numeric NOT NULL,
	`dated_vehicle_journey_gid` numeric NOT NULL,
	`journey_number` integer
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`createdAt` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE `vehicle_positions` (
	`update_id` numeric PRIMARY KEY NOT NULL,
	`bearing` real,
	`latitude` real,
	`longitude` real,
	`speed` real,
	`trip_id` numeric,
	`vehicle_id` numeric,
	`timestamp` numeric,
	`is_updated` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_board_alight_service_departure_timestamp` ON `board_alight` (`service_departure_timestamp`);--> statement-breakpoint
CREATE INDEX `idx_board_alight_service_arrival_timestamp` ON `board_alight` (`service_arrival_timestamp`);--> statement-breakpoint
CREATE INDEX `idx_board_alight_service_date` ON `board_alight` (`service_date`);--> statement-breakpoint
CREATE INDEX `idx_board_alight_record_use` ON `board_alight` (`record_use`);--> statement-breakpoint
CREATE INDEX `idx_board_alight_stop_sequence` ON `board_alight` (`stop_sequence`);--> statement-breakpoint
CREATE INDEX `idx_board_alight_stop_id` ON `board_alight` (`stop_id`);--> statement-breakpoint
CREATE INDEX `idx_board_alight_trip_id` ON `board_alight` (`trip_id`);--> statement-breakpoint
CREATE INDEX `idx_calendar_end_date` ON `calendar` (`end_date`);--> statement-breakpoint
CREATE INDEX `idx_calendar_start_date` ON `calendar` (`start_date`);--> statement-breakpoint
CREATE INDEX `idx_calendar_dates_exception_type` ON `calendar_dates` (`exception_type`);--> statement-breakpoint
CREATE INDEX `idx_deadhead_times_location_sequence` ON `deadhead_times` (`location_sequence`);--> statement-breakpoint
CREATE INDEX `idx_deadhead_times_departure_timestamp` ON `deadhead_times` (`departure_timestamp`);--> statement-breakpoint
CREATE INDEX `idx_deadhead_times_arrival_timestamp` ON `deadhead_times` (`arrival_timestamp`);--> statement-breakpoint
CREATE INDEX `idx_deadhead_times_deadhead_id` ON `deadhead_times` (`deadhead_id`);--> statement-breakpoint
CREATE INDEX `idx_deadheads_from_deadhead_id` ON `deadheads` (`from_deadhead_id`);--> statement-breakpoint
CREATE INDEX `idx_deadheads_to_deadhead_id` ON `deadheads` (`to_deadhead_id`);--> statement-breakpoint
CREATE INDEX `idx_deadheads_from_trip_id` ON `deadheads` (`from_trip_id`);--> statement-breakpoint
CREATE INDEX `idx_deadheads_to_trip_id` ON `deadheads` (`to_trip_id`);--> statement-breakpoint
CREATE INDEX `idx_deadheads_shape_id` ON `deadheads` (`shape_id`);--> statement-breakpoint
CREATE INDEX `idx_deadheads_block_id` ON `deadheads` (`block_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `Password_userId_key` ON `Password` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_ride_feed_info_gtfs_feed_date` ON `ride_feed_info` (`gtfs_feed_date`);--> statement-breakpoint
CREATE INDEX `idx_ride_feed_info_ride_end_date` ON `ride_feed_info` (`ride_end_date`);--> statement-breakpoint
CREATE INDEX `idx_ride_feed_info_ride_start_date` ON `ride_feed_info` (`ride_start_date`);--> statement-breakpoint
CREATE INDEX `idx_rider_trip_alighting_timestamp` ON `rider_trip` (`alighting_timestamp`);--> statement-breakpoint
CREATE INDEX `idx_rider_trip_boarding_timestamp` ON `rider_trip` (`boarding_timestamp`);--> statement-breakpoint
CREATE INDEX `idx_rider_trip_service_date` ON `rider_trip` (`service_date`);--> statement-breakpoint
CREATE INDEX `idx_rider_trip_alighting_stop_sequence` ON `rider_trip` (`alighting_stop_sequence`);--> statement-breakpoint
CREATE INDEX `idx_rider_trip_alighting_stop_id` ON `rider_trip` (`alighting_stop_id`);--> statement-breakpoint
CREATE INDEX `idx_rider_trip_boarding_stop_sequence` ON `rider_trip` (`boarding_stop_sequence`);--> statement-breakpoint
CREATE INDEX `idx_rider_trip_boarding_stop_id` ON `rider_trip` (`boarding_stop_id`);--> statement-breakpoint
CREATE INDEX `idx_rider_trip_trip_id` ON `rider_trip` (`trip_id`);--> statement-breakpoint
CREATE INDEX `idx_rider_trip_agency_id` ON `rider_trip` (`agency_id`);--> statement-breakpoint
CREATE INDEX `idx_ridership_direction_id` ON `ridership` (`direction_id`);--> statement-breakpoint
CREATE INDEX `idx_ridership_route_id` ON `ridership` (`route_id`);--> statement-breakpoint
CREATE INDEX `idx_ridership_agency_id` ON `ridership` (`agency_id`);--> statement-breakpoint
CREATE INDEX `idx_ridership_service_id` ON `ridership` (`service_id`);--> statement-breakpoint
CREATE INDEX `idx_ridership_ridership_end_timestamp` ON `ridership` (`ridership_end_timestamp`);--> statement-breakpoint
CREATE INDEX `idx_ridership_ridership_start_timestamp` ON `ridership` (`ridership_start_timestamp`);--> statement-breakpoint
CREATE INDEX `idx_ridership_ridership_end_date` ON `ridership` (`ridership_end_date`);--> statement-breakpoint
CREATE INDEX `idx_ridership_ridership_start_date` ON `ridership` (`ridership_start_date`);--> statement-breakpoint
CREATE INDEX `idx_run_event_event_to_location_type` ON `run_event` (`event_to_location_type`);--> statement-breakpoint
CREATE INDEX `idx_run_event_event_from_location_type` ON `run_event` (`event_from_location_type`);--> statement-breakpoint
CREATE INDEX `idx_run_event_event_type` ON `run_event` (`event_type`);--> statement-breakpoint
CREATE INDEX `idx_runs_pieces_end_trip_id` ON `runs_pieces` (`end_trip_id`);--> statement-breakpoint
CREATE INDEX `idx_runs_pieces_end_type` ON `runs_pieces` (`end_type`);--> statement-breakpoint
CREATE INDEX `idx_runs_pieces_start_trip_id` ON `runs_pieces` (`start_trip_id`);--> statement-breakpoint
CREATE INDEX `idx_runs_pieces_start_type` ON `runs_pieces` (`start_type`);--> statement-breakpoint
CREATE INDEX `idx_service_alert_targets_route_id` ON `service_alert_targets` (`route_id`);--> statement-breakpoint
CREATE INDEX `idx_service_alert_targets_stop_id` ON `service_alert_targets` (`stop_id`);--> statement-breakpoint
CREATE INDEX `idx_service_alerts_id` ON `service_alerts` (`id`);--> statement-breakpoint
CREATE INDEX `idx_stop_time_updates_stop_id` ON `stop_time_updates` (`stop_id`);--> statement-breakpoint
CREATE INDEX `idx_stop_time_updates_route_id` ON `stop_time_updates` (`route_id`);--> statement-breakpoint
CREATE INDEX `idx_stop_time_updates_trip_id` ON `stop_time_updates` (`trip_id`);--> statement-breakpoint
CREATE INDEX `idx_stop_times_stop_id` ON `stop_times` (`stop_id`);--> statement-breakpoint
CREATE INDEX `idx_stop_times_departure_timestamp` ON `stop_times` (`departure_timestamp`);--> statement-breakpoint
CREATE INDEX `idx_stop_times_arrival_timestamp` ON `stop_times` (`arrival_timestamp`);--> statement-breakpoint
CREATE INDEX `idx_stops_parent_station` ON `stops` (`parent_station`);--> statement-breakpoint
CREATE INDEX `idx_timetable_notes_references_stop_sequence` ON `timetable_notes_references` (`stop_sequence`);--> statement-breakpoint
CREATE INDEX `idx_timetable_notes_references_stop_id` ON `timetable_notes_references` (`stop_id`);--> statement-breakpoint
CREATE INDEX `idx_timetable_notes_references_trip_id` ON `timetable_notes_references` (`trip_id`);--> statement-breakpoint
CREATE INDEX `idx_timetable_notes_references_route_id` ON `timetable_notes_references` (`route_id`);--> statement-breakpoint
CREATE INDEX `idx_timetable_notes_references_timetable_id` ON `timetable_notes_references` (`timetable_id`);--> statement-breakpoint
CREATE INDEX `idx_timetable_stop_order_stop_sequence` ON `timetable_stop_order` (`stop_sequence`);--> statement-breakpoint
CREATE INDEX `idx_timetable_stop_order_timetable_id` ON `timetable_stop_order` (`timetable_id`);--> statement-breakpoint
CREATE INDEX `idx_timetables_timetable_sequence` ON `timetables` (`timetable_sequence`);--> statement-breakpoint
CREATE INDEX `idx_trip_capacity_service_date` ON `trip_capacity` (`service_date`);--> statement-breakpoint
CREATE INDEX `idx_trip_capacity_trip_id` ON `trip_capacity` (`trip_id`);--> statement-breakpoint
CREATE INDEX `idx_trip_capacity_agency_id` ON `trip_capacity` (`agency_id`);--> statement-breakpoint
CREATE INDEX `idx_trip_updates_route_id` ON `trip_updates` (`route_id`);--> statement-breakpoint
CREATE INDEX `idx_trip_updates_trip_id` ON `trip_updates` (`trip_id`);--> statement-breakpoint
CREATE INDEX `idx_trip_updates_vehicle_id` ON `trip_updates` (`vehicle_id`);--> statement-breakpoint
CREATE INDEX `idx_trip_updates_update_id` ON `trip_updates` (`update_id`);--> statement-breakpoint
CREATE INDEX `idx_trips_shape_id` ON `trips` (`shape_id`);--> statement-breakpoint
CREATE INDEX `idx_trips_block_id` ON `trips` (`block_id`);--> statement-breakpoint
CREATE INDEX `idx_trips_direction_id` ON `trips` (`direction_id`);--> statement-breakpoint
CREATE INDEX `idx_trips_service_id` ON `trips` (`service_id`);--> statement-breakpoint
CREATE INDEX `idx_trips_route_id` ON `trips` (`route_id`);--> statement-breakpoint
CREATE INDEX `idx_trips_dated_vehicle_journeys_journey_number` ON `trips_dated_vehicle_journeys` (`journey_number`);--> statement-breakpoint
CREATE INDEX `idx_trips_dated_vehicle_journeys_operating_day_date` ON `trips_dated_vehicle_journeys` (`operating_day_date`);--> statement-breakpoint
CREATE INDEX `idx_trips_dated_vehicle_journeys_trip_id` ON `trips_dated_vehicle_journeys` (`trip_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `User_email_key` ON `User` (`email`);--> statement-breakpoint
CREATE INDEX `idx_vehicle_positions_vehicle_id` ON `vehicle_positions` (`vehicle_id`);--> statement-breakpoint
CREATE INDEX `idx_vehicle_positions_trip_id` ON `vehicle_positions` (`trip_id`);--> statement-breakpoint
CREATE INDEX `idx_vehicle_positions_update_id` ON `vehicle_positions` (`update_id`);