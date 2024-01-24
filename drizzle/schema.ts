import { sqliteTable, AnySQLiteColumn, text, numeric, uniqueIndex, foreignKey, integer, index, primaryKey, real } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const prismaMigrations = sqliteTable("_prisma_migrations", {
	id: text("id").primaryKey().notNull(),
	checksum: text("checksum").notNull(),
	finishedAt: numeric("finished_at"),
	migrationName: text("migration_name").notNull(),
	logs: text("logs"),
	rolledBackAt: numeric("rolled_back_at"),
	startedAt: numeric("started_at").default(sql`(current_timestamp)`).notNull(),
	appliedStepsCount: numeric("applied_steps_count").notNull(),
});

export const user = sqliteTable("User", {
	id: text("id").primaryKey().notNull(),
	email: text("email").notNull(),
	createdAt: numeric("createdAt").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	updatedAt: numeric("updatedAt").notNull(),
},
(table) => {
	return {
		emailKey: uniqueIndex("User_email_key").on(table.email),
	}
});

export const password = sqliteTable("Password", {
	hash: text("hash").notNull(),
	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => {
	return {
		userIdKey: uniqueIndex("Password_userId_key").on(table.userId),
	}
});

export const note = sqliteTable("Note", {
	id: text("id").primaryKey().notNull(),
	title: text("title").notNull(),
	body: text("body").notNull(),
	createdAt: numeric("createdAt").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	updatedAt: numeric("updatedAt").notNull(),
	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
});

export const agency = sqliteTable("agency", {
	agencyId: numeric("agency_id").primaryKey(),
	agencyName: numeric("agency_name").notNull(),
	agencyUrl: numeric("agency_url").notNull(),
	agencyTimezone: numeric("agency_timezone").notNull(),
	agencyLang: numeric("agency_lang"),
	agencyPhone: numeric("agency_phone"),
	agencyFareUrl: numeric("agency_fare_url"),
	agencyEmail: numeric("agency_email"),
});

export const areas = sqliteTable("areas", {
	areaId: numeric("area_id").primaryKey().notNull(),
	areaName: numeric("area_name"),
});

export const attributions = sqliteTable("attributions", {
	attributionId: numeric("attribution_id").primaryKey().notNull(),
	agencyId: numeric("agency_id"),
	routeId: numeric("route_id"),
	tripId: numeric("trip_id"),
	organizationName: numeric("organization_name").notNull(),
	isProducer: integer("is_producer"),
	isOperator: integer("is_operator"),
	isAuthority: integer("is_authority"),
	attributionUrl: numeric("attribution_url"),
	attributionEmail: numeric("attribution_email"),
	attributionPhone: numeric("attribution_phone"),
});

export const calendarDates = sqliteTable("calendar_dates", {
	serviceId: numeric("service_id").notNull(),
	date: integer("date").notNull(),
	exceptionType: integer("exception_type").notNull(),
	holidayName: numeric("holiday_name"),
},
(table) => {
	return {
		idxCalendarDatesExceptionType: index("idx_calendar_dates_exception_type").on(table.exceptionType),
		pk0: primaryKey({ columns: [table.date, table.serviceId], name: "calendar_dates_date_service_id_pk"})
	}
});

export const calendar = sqliteTable("calendar", {
	serviceId: numeric("service_id").primaryKey().notNull(),
	monday: integer("monday").notNull(),
	tuesday: integer("tuesday").notNull(),
	wednesday: integer("wednesday").notNull(),
	thursday: integer("thursday").notNull(),
	friday: integer("friday").notNull(),
	saturday: integer("saturday").notNull(),
	sunday: integer("sunday").notNull(),
	startDate: integer("start_date").notNull(),
	endDate: integer("end_date").notNull(),
},
(table) => {
	return {
		idxCalendarEndDate: index("idx_calendar_end_date").on(table.endDate),
		idxCalendarStartDate: index("idx_calendar_start_date").on(table.startDate),
	}
});

export const fareAttributes = sqliteTable("fare_attributes", {
	fareId: numeric("fare_id").primaryKey().notNull(),
	price: real("price").notNull(),
	currencyType: numeric("currency_type").notNull(),
	paymentMethod: integer("payment_method").notNull(),
	transfers: integer("transfers"),
	agencyId: numeric("agency_id"),
	transferDuration: integer("transfer_duration"),
});

export const fareLegRules = sqliteTable("fare_leg_rules", {
	legGroupId: numeric("leg_group_id"),
	networkId: numeric("network_id"),
	fromAreaId: numeric("from_area_id"),
	toAreaId: numeric("to_area_id"),
	fareProductId: numeric("fare_product_id").notNull(),
},
(table) => {
	return {
		pk0: primaryKey({ columns: [table.fareProductId, table.fromAreaId, table.networkId, table.toAreaId], name: "fare_leg_rules_fare_product_id_from_area_id_network_id_to_area_id_pk"})
	}
});

export const fareProducts = sqliteTable("fare_products", {
	fareProductId: numeric("fare_product_id").notNull(),
	fareProductName: numeric("fare_product_name"),
	fareMediaId: numeric("fare_media_id"),
	amount: real("amount").notNull(),
	currency: numeric("currency").notNull(),
},
(table) => {
	return {
		pk0: primaryKey({ columns: [table.fareMediaId, table.fareProductId], name: "fare_products_fare_media_id_fare_product_id_pk"})
	}
});

export const fareRules = sqliteTable("fare_rules", {
	fareId: numeric("fare_id").notNull(),
	routeId: numeric("route_id"),
	originId: numeric("origin_id"),
	destinationId: numeric("destination_id"),
	containsId: numeric("contains_id"),
});

export const fareTransferRules = sqliteTable("fare_transfer_rules", {
	fromLegGroupId: numeric("from_leg_group_id"),
	toLegGroupId: numeric("to_leg_group_id"),
	transferCount: integer("transfer_count"),
	transferId: numeric("transfer_id"),
	durationLimit: integer("duration_limit"),
	durationLimitType: integer("duration_limit_type"),
	fareTransferType: integer("fare_transfer_type").notNull(),
	fareProductId: numeric("fare_product_id"),
},
(table) => {
	return {
		pk0: primaryKey({ columns: [table.durationLimit, table.fareProductId, table.fromLegGroupId, table.toLegGroupId, table.transferCount], name: "fare_transfer_rules_duration_limit_fare_product_id_from_leg_group_id_to_leg_group_id_transfer_count_pk"})
	}
});

export const feedInfo = sqliteTable("feed_info", {
	feedPublisherName: numeric("feed_publisher_name").notNull(),
	feedPublisherUrl: numeric("feed_publisher_url").notNull(),
	feedLang: numeric("feed_lang").notNull(),
	defaultLang: numeric("default_lang"),
	feedStartDate: integer("feed_start_date"),
	feedEndDate: integer("feed_end_date"),
	feedVersion: numeric("feed_version"),
	feedContactEmail: numeric("feed_contact_email"),
	feedContactUrl: numeric("feed_contact_url"),
});

export const frequencies = sqliteTable("frequencies", {
	tripId: numeric("trip_id").notNull(),
	startTime: numeric("start_time").notNull(),
	startTimestamp: integer("start_timestamp"),
	endTime: numeric("end_time").notNull(),
	endTimestamp: integer("end_timestamp"),
	headwaySecs: integer("headway_secs").notNull(),
	exactTimes: integer("exact_times"),
},
(table) => {
	return {
		pk0: primaryKey({ columns: [table.startTime, table.tripId], name: "frequencies_start_time_trip_id_pk"})
	}
});

export const levels = sqliteTable("levels", {
	levelId: numeric("level_id").primaryKey().notNull(),
	levelIndex: real("level_index").notNull(),
	levelName: numeric("level_name"),
});

export const pathways = sqliteTable("pathways", {
	pathwayId: numeric("pathway_id").primaryKey().notNull(),
	fromStopId: numeric("from_stop_id").notNull(),
	toStopId: numeric("to_stop_id").notNull(),
	pathwayMode: integer("pathway_mode").notNull(),
	isBidirectional: integer("is_bidirectional").notNull(),
	length: real("length"),
	traversalTime: integer("traversal_time"),
	stairCount: integer("stair_count"),
	maxSlope: real("max_slope"),
	minWidth: real("min_width"),
	signpostedAs: numeric("signposted_as"),
	reversedSignpostedAs: numeric("reversed_signposted_as"),
});

export const routes = sqliteTable("routes", {
	routeId: numeric("route_id").primaryKey().notNull(),
	agencyId: numeric("agency_id"),
	routeShortName: numeric("route_short_name"),
	routeLongName: numeric("route_long_name"),
	routeDesc: numeric("route_desc"),
	routeType: integer("route_type").notNull(),
	routeUrl: numeric("route_url"),
	routeColor: numeric("route_color"),
	routeTextColor: numeric("route_text_color"),
	routeSortOrder: integer("route_sort_order"),
	continuousPickup: integer("continuous_pickup"),
	continuousDropOff: integer("continuous_drop_off"),
	networkId: numeric("network_id"),
});

export const shapes = sqliteTable("shapes", {
	shapeId: numeric("shape_id").notNull(),
	shapePtLat: real("shape_pt_lat").notNull(),
	shapePtLon: real("shape_pt_lon").notNull(),
	shapePtSequence: integer("shape_pt_sequence").notNull(),
	shapeDistTraveled: real("shape_dist_traveled"),
},
(table) => {
	return {
		pk0: primaryKey({ columns: [table.shapeId, table.shapePtSequence], name: "shapes_shape_id_shape_pt_sequence_pk"})
	}
});

export const stopAreas = sqliteTable("stop_areas", {
	areaId: numeric("area_id").notNull(),
	stopId: numeric("stop_id").notNull(),
});

export const stopTimes = sqliteTable("stop_times", {
	tripId: numeric("trip_id").notNull(),
	arrivalTime: numeric("arrival_time"),
	arrivalTimestamp: integer("arrival_timestamp"),
	departureTime: numeric("departure_time"),
	departureTimestamp: integer("departure_timestamp"),
	stopId: numeric("stop_id").notNull(),
	stopSequence: integer("stop_sequence").notNull(),
	stopHeadsign: numeric("stop_headsign"),
	pickupType: integer("pickup_type"),
	dropOffType: integer("drop_off_type"),
	continuousPickup: integer("continuous_pickup"),
	continuousDropOff: integer("continuous_drop_off"),
	shapeDistTraveled: real("shape_dist_traveled"),
	timepoint: integer("timepoint"),
},
(table) => {
	return {
		idxStopTimesStopId: index("idx_stop_times_stop_id").on(table.stopId),
		idxStopTimesDepartureTimestamp: index("idx_stop_times_departure_timestamp").on(table.departureTimestamp),
		idxStopTimesArrivalTimestamp: index("idx_stop_times_arrival_timestamp").on(table.arrivalTimestamp),
		pk0: primaryKey({ columns: [table.stopSequence, table.tripId], name: "stop_times_stop_sequence_trip_id_pk"})
	}
});

export const stops = sqliteTable("stops", {
	stopId: numeric("stop_id").primaryKey().notNull(),
	stopCode: numeric("stop_code"),
	stopName: numeric("stop_name"),
	ttsStopName: numeric("tts_stop_name"),
	stopDesc: numeric("stop_desc"),
	stopLat: real("stop_lat"),
	stopLon: real("stop_lon"),
	zoneId: numeric("zone_id"),
	stopUrl: numeric("stop_url"),
	locationType: integer("location_type"),
	parentStation: numeric("parent_station"),
	stopTimezone: numeric("stop_timezone"),
	wheelchairBoarding: integer("wheelchair_boarding"),
	levelId: numeric("level_id"),
	platformCode: numeric("platform_code"),
},
(table) => {
	return {
		idxStopsParentStation: index("idx_stops_parent_station").on(table.parentStation),
	}
});

export const transfers = sqliteTable("transfers", {
	fromStopId: numeric("from_stop_id"),
	toStopId: numeric("to_stop_id"),
	fromRouteId: numeric("from_route_id"),
	toRouteId: numeric("to_route_id"),
	fromTripId: numeric("from_trip_id"),
	toTripId: numeric("to_trip_id"),
	transferType: integer("transfer_type"),
	minTransferTime: integer("min_transfer_time"),
},
(table) => {
	return {
		pk0: primaryKey({ columns: [table.fromRouteId, table.fromStopId, table.fromTripId, table.toRouteId, table.toStopId, table.toTripId], name: "transfers_from_route_id_from_stop_id_from_trip_id_to_route_id_to_stop_id_to_trip_id_pk"})
	}
});

export const translations = sqliteTable("translations", {
	tableName: numeric("table_name").notNull(),
	fieldName: numeric("field_name").notNull(),
	language: numeric("language").notNull(),
	translation: numeric("translation").notNull(),
	recordId: numeric("record_id"),
	recordSubId: numeric("record_sub_id"),
	fieldValue: numeric("field_value"),
},
(table) => {
	return {
		pk0: primaryKey({ columns: [table.fieldName, table.fieldValue, table.language, table.recordId, table.recordSubId, table.tableName], name: "translations_field_name_field_value_language_record_id_record_sub_id_table_name_pk"})
	}
});

export const trips = sqliteTable("trips", {
	routeId: numeric("route_id").notNull(),
	serviceId: numeric("service_id").notNull(),
	tripId: numeric("trip_id").primaryKey().notNull(),
	tripHeadsign: numeric("trip_headsign"),
	tripShortName: numeric("trip_short_name"),
	directionId: integer("direction_id"),
	blockId: numeric("block_id"),
	shapeId: numeric("shape_id"),
	wheelchairAccessible: integer("wheelchair_accessible"),
	bikesAllowed: integer("bikes_allowed"),
},
(table) => {
	return {
		idxTripsShapeId: index("idx_trips_shape_id").on(table.shapeId),
		idxTripsBlockId: index("idx_trips_block_id").on(table.blockId),
		idxTripsDirectionId: index("idx_trips_direction_id").on(table.directionId),
		idxTripsServiceId: index("idx_trips_service_id").on(table.serviceId),
		idxTripsRouteId: index("idx_trips_route_id").on(table.routeId),
	}
});

export const timetables = sqliteTable("timetables", {
	id: integer("id").primaryKey(),
	timetableId: numeric("timetable_id"),
	routeId: numeric("route_id"),
	directionId: integer("direction_id"),
	startDate: integer("start_date"),
	endDate: integer("end_date"),
	monday: integer("monday").notNull(),
	tuesday: integer("tuesday").notNull(),
	wednesday: integer("wednesday").notNull(),
	thursday: integer("thursday").notNull(),
	friday: integer("friday").notNull(),
	saturday: integer("saturday").notNull(),
	sunday: integer("sunday").notNull(),
	startTime: numeric("start_time"),
	startTimestamp: integer("start_timestamp"),
	endTime: numeric("end_time"),
	endTimestamp: integer("end_timestamp"),
	timetableLabel: numeric("timetable_label"),
	serviceNotes: numeric("service_notes"),
	orientation: numeric("orientation"),
	timetablePageId: numeric("timetable_page_id"),
	timetableSequence: integer("timetable_sequence"),
	directionName: numeric("direction_name"),
	includeExceptions: integer("include_exceptions"),
	showTripContinuation: integer("show_trip_continuation"),
},
(table) => {
	return {
		idxTimetablesTimetableSequence: index("idx_timetables_timetable_sequence").on(table.timetableSequence),
	}
});

export const timetablePages = sqliteTable("timetable_pages", {
	timetablePageId: numeric("timetable_page_id").primaryKey(),
	timetablePageLabel: numeric("timetable_page_label"),
	filename: numeric("filename"),
});

export const timetableStopOrder = sqliteTable("timetable_stop_order", {
	id: integer("id").primaryKey(),
	timetableId: numeric("timetable_id"),
	stopId: numeric("stop_id"),
	stopSequence: integer("stop_sequence"),
},
(table) => {
	return {
		idxTimetableStopOrderStopSequence: index("idx_timetable_stop_order_stop_sequence").on(table.stopSequence),
		idxTimetableStopOrderTimetableId: index("idx_timetable_stop_order_timetable_id").on(table.timetableId),
	}
});

export const timetableNotes = sqliteTable("timetable_notes", {
	noteId: numeric("note_id").primaryKey(),
	symbol: numeric("symbol"),
	note: numeric("note"),
});

export const timetableNotesReferences = sqliteTable("timetable_notes_references", {
	noteId: numeric("note_id"),
	timetableId: numeric("timetable_id"),
	routeId: numeric("route_id"),
	tripId: numeric("trip_id"),
	stopId: numeric("stop_id"),
	stopSequence: integer("stop_sequence"),
	showOnStoptime: integer("show_on_stoptime"),
},
(table) => {
	return {
		idxTimetableNotesReferencesStopSequence: index("idx_timetable_notes_references_stop_sequence").on(table.stopSequence),
		idxTimetableNotesReferencesStopId: index("idx_timetable_notes_references_stop_id").on(table.stopId),
		idxTimetableNotesReferencesTripId: index("idx_timetable_notes_references_trip_id").on(table.tripId),
		idxTimetableNotesReferencesRouteId: index("idx_timetable_notes_references_route_id").on(table.routeId),
		idxTimetableNotesReferencesTimetableId: index("idx_timetable_notes_references_timetable_id").on(table.timetableId),
	}
});

export const tripsDatedVehicleJourneys = sqliteTable("trips_dated_vehicle_journeys", {
	tripId: numeric("trip_id").notNull(),
	operatingDayDate: numeric("operating_day_date").notNull(),
	datedVehicleJourneyGid: numeric("dated_vehicle_journey_gid").notNull(),
	journeyNumber: integer("journey_number"),
},
(table) => {
	return {
		idxTripsDatedVehicleJourneysJourneyNumber: index("idx_trips_dated_vehicle_journeys_journey_number").on(table.journeyNumber),
		idxTripsDatedVehicleJourneysOperatingDayDate: index("idx_trips_dated_vehicle_journeys_operating_day_date").on(table.operatingDayDate),
		idxTripsDatedVehicleJourneysTripId: index("idx_trips_dated_vehicle_journeys_trip_id").on(table.tripId),
	}
});

export const calendarAttributes = sqliteTable("calendar_attributes", {
	serviceId: numeric("service_id").primaryKey(),
	serviceDescription: numeric("service_description").notNull(),
});

export const directions = sqliteTable("directions", {
	routeId: numeric("route_id").notNull(),
	directionId: integer("direction_id"),
	direction: numeric("direction").notNull(),
},
(table) => {
	return {
		pk0: primaryKey({ columns: [table.directionId, table.routeId], name: "directions_direction_id_route_id_pk"})
	}
});

export const routeAttributes = sqliteTable("route_attributes", {
	routeId: numeric("route_id").primaryKey(),
	category: integer("category").notNull(),
	subcategory: integer("subcategory").notNull(),
	runningWay: integer("running_way").notNull(),
});

export const stopAttributes = sqliteTable("stop_attributes", {
	stopId: numeric("stop_id").primaryKey().notNull(),
	accessibilityId: integer("accessibility_id"),
	cardinalDirection: numeric("cardinal_direction"),
	relativePosition: numeric("relative_position"),
	stopCity: numeric("stop_city"),
});

export const boardAlight = sqliteTable("board_alight", {
	tripId: numeric("trip_id").notNull(),
	stopId: numeric("stop_id").notNull(),
	stopSequence: integer("stop_sequence").notNull(),
	recordUse: integer("record_use").notNull(),
	scheduleRelationship: integer("schedule_relationship"),
	boardings: integer("boardings"),
	alightings: integer("alightings"),
	currentLoad: integer("current_load"),
	loadCount: integer("load_count"),
	loadType: integer("load_type"),
	rackDown: integer("rack_down"),
	bikeBoardings: integer("bike_boardings"),
	bikeAlightings: integer("bike_alightings"),
	rampUsed: integer("ramp_used"),
	rampBoardings: integer("ramp_boardings"),
	rampAlightings: integer("ramp_alightings"),
	serviceDate: integer("service_date"),
	serviceArrivalTime: numeric("service_arrival_time"),
	serviceArrivalTimestamp: integer("service_arrival_timestamp"),
	serviceDepartureTime: numeric("service_departure_time"),
	serviceDepartureTimestamp: integer("service_departure_timestamp"),
	source: integer("source"),
},
(table) => {
	return {
		idxBoardAlightServiceDepartureTimestamp: index("idx_board_alight_service_departure_timestamp").on(table.serviceDepartureTimestamp),
		idxBoardAlightServiceArrivalTimestamp: index("idx_board_alight_service_arrival_timestamp").on(table.serviceArrivalTimestamp),
		idxBoardAlightServiceDate: index("idx_board_alight_service_date").on(table.serviceDate),
		idxBoardAlightRecordUse: index("idx_board_alight_record_use").on(table.recordUse),
		idxBoardAlightStopSequence: index("idx_board_alight_stop_sequence").on(table.stopSequence),
		idxBoardAlightStopId: index("idx_board_alight_stop_id").on(table.stopId),
		idxBoardAlightTripId: index("idx_board_alight_trip_id").on(table.tripId),
	}
});

export const rideFeedInfo = sqliteTable("ride_feed_info", {
	rideFiles: integer("ride_files").notNull(),
	rideStartDate: integer("ride_start_date"),
	rideEndDate: integer("ride_end_date"),
	gtfsFeedDate: integer("gtfs_feed_date"),
	defaultCurrencyType: numeric("default_currency_type"),
	rideFeedVersion: numeric("ride_feed_version"),
},
(table) => {
	return {
		idxRideFeedInfoGtfsFeedDate: index("idx_ride_feed_info_gtfs_feed_date").on(table.gtfsFeedDate),
		idxRideFeedInfoRideEndDate: index("idx_ride_feed_info_ride_end_date").on(table.rideEndDate),
		idxRideFeedInfoRideStartDate: index("idx_ride_feed_info_ride_start_date").on(table.rideStartDate),
	}
});

export const riderTrip = sqliteTable("rider_trip", {
	riderId: numeric("rider_id").primaryKey(),
	agencyId: numeric("agency_id"),
	tripId: numeric("trip_id"),
	boardingStopId: numeric("boarding_stop_id"),
	boardingStopSequence: integer("boarding_stop_sequence"),
	alightingStopId: numeric("alighting_stop_id"),
	alightingStopSequence: integer("alighting_stop_sequence"),
	serviceDate: integer("service_date"),
	boardingTime: numeric("boarding_time"),
	boardingTimestamp: integer("boarding_timestamp"),
	alightingTime: numeric("alighting_time"),
	alightingTimestamp: integer("alighting_timestamp"),
	riderType: integer("rider_type"),
	riderTypeDescription: numeric("rider_type_description"),
	farePaid: real("fare_paid"),
	transactionType: integer("transaction_type"),
	fareMedia: integer("fare_media"),
	accompanyingDevice: integer("accompanying_device"),
	transferStatus: integer("transfer_status"),
},
(table) => {
	return {
		idxRiderTripAlightingTimestamp: index("idx_rider_trip_alighting_timestamp").on(table.alightingTimestamp),
		idxRiderTripBoardingTimestamp: index("idx_rider_trip_boarding_timestamp").on(table.boardingTimestamp),
		idxRiderTripServiceDate: index("idx_rider_trip_service_date").on(table.serviceDate),
		idxRiderTripAlightingStopSequence: index("idx_rider_trip_alighting_stop_sequence").on(table.alightingStopSequence),
		idxRiderTripAlightingStopId: index("idx_rider_trip_alighting_stop_id").on(table.alightingStopId),
		idxRiderTripBoardingStopSequence: index("idx_rider_trip_boarding_stop_sequence").on(table.boardingStopSequence),
		idxRiderTripBoardingStopId: index("idx_rider_trip_boarding_stop_id").on(table.boardingStopId),
		idxRiderTripTripId: index("idx_rider_trip_trip_id").on(table.tripId),
		idxRiderTripAgencyId: index("idx_rider_trip_agency_id").on(table.agencyId),
	}
});

export const ridership = sqliteTable("ridership", {
	totalBoardings: integer("total_boardings").notNull(),
	totalAlightings: integer("total_alightings").notNull(),
	ridershipStartDate: integer("ridership_start_date"),
	ridershipEndDate: integer("ridership_end_date"),
	ridershipStartTime: numeric("ridership_start_time"),
	ridershipStartTimestamp: integer("ridership_start_timestamp"),
	ridershipEndTime: numeric("ridership_end_time"),
	ridershipEndTimestamp: integer("ridership_end_timestamp"),
	serviceId: numeric("service_id"),
	monday: integer("monday"),
	tuesday: integer("tuesday"),
	wednesday: integer("wednesday"),
	thursday: integer("thursday"),
	friday: integer("friday"),
	saturday: integer("saturday"),
	sunday: integer("sunday"),
	agencyId: numeric("agency_id"),
	routeId: numeric("route_id"),
	directionId: integer("direction_id"),
	tripId: numeric("trip_id"),
	stopId: numeric("stop_id"),
},
(table) => {
	return {
		idxRidershipDirectionId: index("idx_ridership_direction_id").on(table.directionId),
		idxRidershipRouteId: index("idx_ridership_route_id").on(table.routeId),
		idxRidershipAgencyId: index("idx_ridership_agency_id").on(table.agencyId),
		idxRidershipServiceId: index("idx_ridership_service_id").on(table.serviceId),
		idxRidershipRidershipEndTimestamp: index("idx_ridership_ridership_end_timestamp").on(table.ridershipEndTimestamp),
		idxRidershipRidershipStartTimestamp: index("idx_ridership_ridership_start_timestamp").on(table.ridershipStartTimestamp),
		idxRidershipRidershipEndDate: index("idx_ridership_ridership_end_date").on(table.ridershipEndDate),
		idxRidershipRidershipStartDate: index("idx_ridership_ridership_start_date").on(table.ridershipStartDate),
	}
});

export const tripCapacity = sqliteTable("trip_capacity", {
	agencyId: numeric("agency_id"),
	tripId: numeric("trip_id"),
	serviceDate: integer("service_date"),
	vehicleDescription: numeric("vehicle_description"),
	seatedCapacity: integer("seated_capacity"),
	standingCapacity: integer("standing_capacity"),
	wheelchairCapacity: integer("wheelchair_capacity"),
	bikeCapacity: integer("bike_capacity"),
},
(table) => {
	return {
		idxTripCapacityServiceDate: index("idx_trip_capacity_service_date").on(table.serviceDate),
		idxTripCapacityTripId: index("idx_trip_capacity_trip_id").on(table.tripId),
		idxTripCapacityAgencyId: index("idx_trip_capacity_agency_id").on(table.agencyId),
	}
});

export const tripUpdates = sqliteTable("trip_updates", {
	updateId: numeric("update_id").primaryKey().notNull(),
	vehicleId: numeric("vehicle_id"),
	tripId: numeric("trip_id"),
	tripStartTime: numeric("trip_start_time"),
	directionId: integer("direction_id"),
	routeId: numeric("route_id"),
	startDate: numeric("start_date"),
	timestamp: numeric("timestamp"),
	scheduleRelationship: numeric("schedule_relationship"),
	isUpdated: integer("is_updated").default(1).notNull(),
},
(table) => {
	return {
		idxTripUpdatesRouteId: index("idx_trip_updates_route_id").on(table.routeId),
		idxTripUpdatesTripId: index("idx_trip_updates_trip_id").on(table.tripId),
		idxTripUpdatesVehicleId: index("idx_trip_updates_vehicle_id").on(table.vehicleId),
		idxTripUpdatesUpdateId: index("idx_trip_updates_update_id").on(table.updateId),
	}
});

export const stopTimeUpdates = sqliteTable("stop_time_updates", {
	tripId: numeric("trip_id"),
	tripStartTime: numeric("trip_start_time"),
	directionId: integer("direction_id"),
	routeId: numeric("route_id"),
	stopId: numeric("stop_id"),
	stopSequence: integer("stop_sequence"),
	arrivalDelay: integer("arrival_delay"),
	departureDelay: integer("departure_delay"),
	departureTimestamp: numeric("departure_timestamp"),
	arrivalTimestamp: numeric("arrival_timestamp"),
	scheduleRelationship: numeric("schedule_relationship"),
	isUpdated: integer("is_updated").default(1).notNull(),
},
(table) => {
	return {
		idxStopTimeUpdatesStopId: index("idx_stop_time_updates_stop_id").on(table.stopId),
		idxStopTimeUpdatesRouteId: index("idx_stop_time_updates_route_id").on(table.routeId),
		idxStopTimeUpdatesTripId: index("idx_stop_time_updates_trip_id").on(table.tripId),
	}
});

export const vehiclePositions = sqliteTable("vehicle_positions", {
	updateId: numeric("update_id").primaryKey().notNull(),
	bearing: real("bearing"),
	latitude: real("latitude"),
	longitude: real("longitude"),
	speed: real("speed"),
	tripId: numeric("trip_id"),
	vehicleId: numeric("vehicle_id"),
	timestamp: numeric("timestamp"),
	isUpdated: integer("is_updated").default(1).notNull(),
},
(table) => {
	return {
		idxVehiclePositionsVehicleId: index("idx_vehicle_positions_vehicle_id").on(table.vehicleId),
		idxVehiclePositionsTripId: index("idx_vehicle_positions_trip_id").on(table.tripId),
		idxVehiclePositionsUpdateId: index("idx_vehicle_positions_update_id").on(table.updateId),
	}
});

export const serviceAlerts = sqliteTable("service_alerts", {
	id: numeric("id").primaryKey().notNull(),
	cause: integer("cause").notNull(),
	startTime: numeric("start_time").notNull(),
	endTime: numeric("end_time").notNull(),
	headline: numeric("headline").notNull(),
	description: numeric("description").notNull(),
	isUpdated: integer("is_updated").default(1).notNull(),
},
(table) => {
	return {
		idxServiceAlertsId: index("idx_service_alerts_id").on(table.id),
	}
});

export const serviceAlertTargets = sqliteTable("service_alert_targets", {
	alertId: numeric("alert_id").primaryKey().notNull(),
	stopId: numeric("stop_id"),
	routeId: numeric("route_id"),
	isUpdated: integer("is_updated").default(1).notNull(),
},
(table) => {
	return {
		idxServiceAlertTargetsRouteId: index("idx_service_alert_targets_route_id").on(table.routeId),
		idxServiceAlertTargetsStopId: index("idx_service_alert_targets_stop_id").on(table.stopId),
	}
});

export const deadheadTimes = sqliteTable("deadhead_times", {
	id: integer("id").primaryKey(),
	deadheadId: numeric("deadhead_id").notNull(),
	arrivalTime: numeric("arrival_time").notNull(),
	arrivalTimestamp: integer("arrival_timestamp"),
	departureTime: numeric("departure_time").notNull(),
	departureTimestamp: integer("departure_timestamp"),
	opsLocationId: numeric("ops_location_id"),
	stopId: numeric("stop_id"),
	locationSequence: integer("location_sequence").notNull(),
	shapeDistTraveled: real("shape_dist_traveled"),
},
(table) => {
	return {
		idxDeadheadTimesLocationSequence: index("idx_deadhead_times_location_sequence").on(table.locationSequence),
		idxDeadheadTimesDepartureTimestamp: index("idx_deadhead_times_departure_timestamp").on(table.departureTimestamp),
		idxDeadheadTimesArrivalTimestamp: index("idx_deadhead_times_arrival_timestamp").on(table.arrivalTimestamp),
		idxDeadheadTimesDeadheadId: index("idx_deadhead_times_deadhead_id").on(table.deadheadId),
	}
});

export const deadheads = sqliteTable("deadheads", {
	deadheadId: numeric("deadhead_id").primaryKey().notNull(),
	serviceId: numeric("service_id").notNull(),
	blockId: numeric("block_id").notNull(),
	shapeId: numeric("shape_id"),
	toTripId: numeric("to_trip_id"),
	fromTripId: numeric("from_trip_id"),
	toDeadheadId: numeric("to_deadhead_id"),
	fromDeadheadId: numeric("from_deadhead_id"),
},
(table) => {
	return {
		idxDeadheadsFromDeadheadId: index("idx_deadheads_from_deadhead_id").on(table.fromDeadheadId),
		idxDeadheadsToDeadheadId: index("idx_deadheads_to_deadhead_id").on(table.toDeadheadId),
		idxDeadheadsFromTripId: index("idx_deadheads_from_trip_id").on(table.fromTripId),
		idxDeadheadsToTripId: index("idx_deadheads_to_trip_id").on(table.toTripId),
		idxDeadheadsShapeId: index("idx_deadheads_shape_id").on(table.shapeId),
		idxDeadheadsBlockId: index("idx_deadheads_block_id").on(table.blockId),
	}
});

export const opsLocations = sqliteTable("ops_locations", {
	opsLocationId: numeric("ops_location_id").primaryKey().notNull(),
	opsLocationCode: numeric("ops_location_code"),
	opsLocationName: numeric("ops_location_name").notNull(),
	opsLocationDesc: numeric("ops_location_desc"),
	opsLocationLat: real("ops_location_lat").notNull(),
	opsLocationLon: real("ops_location_lon").notNull(),
});

export const runEvent = sqliteTable("run_event", {
	runEventId: numeric("run_event_id").primaryKey().notNull(),
	pieceId: numeric("piece_id").notNull(),
	eventType: integer("event_type").notNull(),
	eventName: numeric("event_name"),
	eventTime: numeric("event_time").notNull(),
	eventDuration: integer("event_duration").notNull(),
	eventFromLocationType: integer("event_from_location_type"),
	eventFromLocationId: numeric("event_from_location_id"),
	eventToLocationType: integer("event_to_location_type"),
	eventToLocationId: numeric("event_to_location_id"),
},
(table) => {
	return {
		idxRunEventEventToLocationType: index("idx_run_event_event_to_location_type").on(table.eventToLocationType),
		idxRunEventEventFromLocationType: index("idx_run_event_event_from_location_type").on(table.eventFromLocationType),
		idxRunEventEventType: index("idx_run_event_event_type").on(table.eventType),
	}
});

export const runsPieces = sqliteTable("runs_pieces", {
	runId: numeric("run_id").notNull(),
	pieceId: numeric("piece_id").primaryKey().notNull(),
	startType: integer("start_type").notNull(),
	startTripId: numeric("start_trip_id").notNull(),
	startTripPosition: integer("start_trip_position"),
	endType: integer("end_type").notNull(),
	endTripId: numeric("end_trip_id").notNull(),
	endTripPosition: integer("end_trip_position"),
},
(table) => {
	return {
		idxRunsPiecesEndTripId: index("idx_runs_pieces_end_trip_id").on(table.endTripId),
		idxRunsPiecesEndType: index("idx_runs_pieces_end_type").on(table.endType),
		idxRunsPiecesStartTripId: index("idx_runs_pieces_start_trip_id").on(table.startTripId),
		idxRunsPiecesStartType: index("idx_runs_pieces_start_type").on(table.startType),
	}
});