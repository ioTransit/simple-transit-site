// src/lib/gtfs-to-geojson.ts
import path2 from "node:path";
import { readFileSync } from "node:fs";
import { rm, mkdir, writeFile } from "node:fs/promises";
import { clone, omit, uniqBy } from "lodash-es";
import { getRoutes as getRoutes2, getTrips as getTrips2, openDb, importGtfs } from "gtfs";
import pLimit from "p-limit";
import Timer from "timer-machine";
import sqlString from "sqlstring-sqlite";
import sanitize2 from "sanitize-filename";

// src/lib/file-utils.ts
import path from "node:path";
import { createWriteStream } from "node:fs";
import archiver from "archiver";

// node_modules/untildify/index.js
import os from "node:os";
var homeDirectory = os.homedir();

// src/lib/file-utils.ts
import sanitize from "sanitize-filename";
function zipFolder(exportPath) {
  const output = createWriteStream(path.join(exportPath, "geojson.zip"));
  const archive = archiver("zip");
  return new Promise((resolve, reject) => {
    output.on("close", resolve);
    archive.on("error", reject);
    archive.pipe(output);
    archive.glob(`${exportPath}/**/*.{json}`);
    archive.finalize();
  });
}
function getExportPath(agencyKey) {
  return path.join("geojson", sanitize(agencyKey));
}

// src/lib/formatters.ts
function msToSeconds(ms) {
  return Math.round(ms / 1e3);
}

// src/lib/log-utils.ts
import { clearLine, cursorTo } from "node:readline";
import * as colors from "yoctocolors";
import { getFeedInfo } from "gtfs";
import { noop } from "lodash-es";
import Table from "cli-table";
function generateLogText(agency, outputStats, config) {
  const feedInfo = getFeedInfo();
  const feedVersion = feedInfo.length > 0 && feedInfo[0].feed_version ? feedInfo[0].feed_version : "Unknown";
  const logText = [
    `Feed Version: ${feedVersion}`,
    `GTFS-to-geoJSON Version: ${config.gtfsToGeoJSONVersion}`,
    `Date Generated: ${/* @__PURE__ */ new Date()}`,
    `Route Count: ${outputStats.routes}`,
    `Shape Count: ${outputStats.shapes}`,
    `GeoJSON File Count: ${outputStats.files}`,
    `Output Type: ${config.outputType}`
  ];
  if (agency.url) {
    logText.push(`Source: ${agency.url}`);
  } else if (agency.path) {
    logText.push(`Source: ${agency.path}`);
  }
  return logText.join("\n");
}
function log(config) {
  if (config.verbose === false) {
    return noop;
  }
  if (config.logFunction) {
    return config.logFunction;
  }
  return (text, overwrite) => {
    if (overwrite === true && process.stdout.isTTY) {
      clearLine(process.stdout, 0);
      cursorTo(process.stdout, 0);
    } else {
      process.stdout.write("\n");
    }
    process.stdout.write(text);
  };
}
function logWarning(config) {
  if (config.logFunction) {
    return config.logFunction;
  }
  return (text) => {
    process.stdout.write(`
${formatWarning(text)}
`);
  };
}
function logError(config) {
  if (config.logFunction) {
    return config.logFunction;
  }
  return (text) => {
    process.stdout.write(`
${formatError(text)}
`);
  };
}
function formatWarning(text) {
  const warningMessage = `${colors.underline("Warning")}: ${text}`;
  return colors.yellow(warningMessage);
}
function formatError(error) {
  const messageText = error instanceof Error ? error.message : error;
  const errorMessage = `${colors.underline("Error")}: ${messageText.replace(
    "Error: ",
    ""
  )}`;
  return colors.red(errorMessage);
}
function logStats(stats, config) {
  if (config.logFunction) {
    return;
  }
  const table = new Table({
    colWidths: [40, 20],
    head: ["Item", "Count"]
  });
  table.push(
    ["\u{1F4DD} Output Type", config.outputType],
    ["\u{1F504} Routes", stats.routes],
    ["\u23AD Shapes", stats.shapes],
    ["\u{1F4C4} GeoJSON Files", stats.files]
  );
  config.log(table.toString());
}
var generateProgressBarString = (barTotal, barProgress, size2 = 40) => {
  const line = "-";
  const slider = "=";
  if (!barTotal) {
    throw new Error("Total value is either not provided or invalid");
  }
  if (!barProgress && barProgress !== 0) {
    throw new Error("Current value is either not provided or invalid");
  }
  if (isNaN(barTotal)) {
    throw new Error("Total value is not an integer");
  }
  if (isNaN(barProgress)) {
    throw new Error("Current value is not an integer");
  }
  if (isNaN(size2)) {
    throw new Error("Size is not an integer");
  }
  if (barProgress > barTotal) {
    return slider.repeat(size2 + 2);
  }
  const percentage = barProgress / barTotal;
  const progress = Math.round(size2 * percentage);
  const emptyProgress = size2 - progress;
  const progressText = slider.repeat(progress);
  const emptyProgressText = line.repeat(emptyProgress);
  return progressText + emptyProgressText;
};
function progressBar(formatString, barTotal, config) {
  let barProgress = 0;
  if (config.verbose === false) {
    return {
      increment: noop,
      interrupt: noop
    };
  }
  if (barTotal === 0) {
    return {
      interrupt(text) {
      },
      increment() {
      }
    };
  }
  const renderProgressString = () => formatString.replace("{value}", barProgress).replace("{total}", barTotal).replace("{bar}", generateProgressBarString(barTotal, barProgress));
  config.log(renderProgressString(), true);
  return {
    interrupt(text) {
      config.logWarning(text);
      config.log("");
    },
    increment() {
      barProgress += 1;
      config.log(renderProgressString(), true);
    }
  };
}

// src/lib/formats/envelope.ts
import bbox from "@turf/bbox";
import bboxPoly from "@turf/bbox-polygon";
import { featureEach as featureEach2 } from "@turf/meta";

// src/lib/geojson-utils.ts
import { cloneDeep, flatMap, maxBy, omitBy, size } from "lodash-es";
import { feature, featureCollection } from "@turf/helpers";
import { featureEach } from "@turf/meta";
import simplify from "@turf/simplify";
import union from "@turf/union";
import {
  getRouteAttributes,
  getRoutes,
  getShapesAsGeoJSON,
  getStops,
  getStoptimes,
  getTrips
} from "gtfs";
import toposort from "toposort";
function formatHexColor(color) {
  if (color === null || color === void 0) {
    return;
  }
  return `#${color}`;
}
function formatProperties(properties) {
  const formattedProperties = {
    ...cloneDeep(omitBy(properties, (value) => value === null)),
    route_color: formatHexColor(properties.route_color),
    route_text_color: formatHexColor(properties.route_text_color)
  };
  if (properties.routes) {
    formattedProperties.routes = properties.routes.map(
      (route) => formatProperties(route)
    );
  }
  return formattedProperties;
}
var truncateCoordinate = (coordinate, precision) => [
  Math.round(coordinate[0] * 10 ** precision) / 10 ** precision,
  Math.round(coordinate[1] * 10 ** precision) / 10 ** precision
];
var truncateGeoJSONDecimals = (geojson, config) => {
  featureEach(geojson, (feature2) => {
    if (feature2.geometry.coordinates) {
      if (feature2.geometry.type.toLowerCase() === "point") {
        feature2.geometry.coordinates = truncateCoordinate(
          feature2.geometry.coordinates,
          config.coordinatePrecision
        );
      } else if (feature2.geometry.type.toLowerCase() === "linestring") {
        feature2.geometry.coordinates = feature2.geometry.coordinates.map(
          (coordinate) => truncateCoordinate(coordinate, config.coordinatePrecision)
        );
      } else if (feature2.geometry.type.toLowerCase() === "polygon") {
        feature2.geometry.coordinates = feature2.geometry.coordinates.map(
          (line) => line.map(
            (coordinate) => truncateCoordinate(coordinate, config.coordinatePrecision)
          )
        );
      } else if (feature2.geometry.type.toLowerCase() === "multipolygon") {
        feature2.geometry.coordinates = feature2.geometry.coordinates.map(
          (polygon) => polygon.map(
            (line) => line.map(
              (coordinate) => truncateCoordinate(coordinate, config.coordinatePrecision)
            )
          )
        );
      }
    }
  });
  return geojson;
};
function mergeGeojson(...geojsons) {
  return featureCollection(flatMap(geojsons, (geojson) => geojson.features));
}
function simplifyGeoJSON(geojson, config) {
  if (config.coordinatePrecision === void 0) {
    return geojson;
  }
  if (geojson?.type?.toLowerCase() === "featurecollection") {
    geojson.features = geojson.features.map(
      (feature2) => simplifyGeoJSON(feature2, config)
    );
    return geojson;
  }
  if (geojson?.geometry?.type?.toLowerCase() === "multipolygon") {
    return truncateGeoJSONDecimals(geojson, config);
  }
  try {
    const simplifiedGeojson = simplify(geojson, {
      tolerance: 1 / 10 ** config.coordinatePrecision,
      highQuality: true
    });
    return truncateGeoJSONDecimals(simplifiedGeojson, config);
  } catch {
    config.logWarning("Unable to simplify geojson");
    return truncateGeoJSONDecimals(geojson, config);
  }
}
function unionGeojson(geojson, config) {
  if (geojson.features.length === 1) {
    return geojson;
  }
  try {
    return union(featureCollection(geojson.features));
  } catch {
    config.logWarning("Unable to dissolve geojson");
    return geojson;
  }
}
function getOrderedStopIdsForRoute(routeId) {
  const trips = getTrips({ route_id: routeId });
  for (const trip of trips) {
    trip.stoptimes = getStoptimes(
      { trip_id: trip.trip_id },
      [],
      [["stop_sequence", "ASC"]]
    );
  }
  try {
    const stopGraph = [];
    for (const trip of trips) {
      const sortedStopIds = trip.stoptimes.map((stoptime) => stoptime.stop_id);
      for (const [index, stopId] of sortedStopIds.entries()) {
        if (index === sortedStopIds.length - 1) {
          continue;
        }
        stopGraph.push([stopId, sortedStopIds[index + 1]]);
      }
    }
    return toposort(stopGraph);
  } catch {
  }
  const longestTrip = maxBy(trips, (trip) => size(trip.stoptimes));
  return longestTrip.stoptimes.map((stoptime) => stoptime.stop_id);
}
function getRouteLinesAsGeoJSON(query) {
  const geojson = getShapesAsGeoJSON(query);
  if (geojson.features.length > 0) {
    return geojson;
  }
  if (query.shape_id) {
    throw new Error(
      "No shapes found in shapes.txt, unable to create geoJSON with outputType = shape"
    );
  }
  const routes = query.route_id ? getRoutes({ route_id: query.route_id }) : getRoutes();
  return featureCollection(
    routes.map((route) => {
      const orderedStopIds = getOrderedStopIdsForRoute(route.route_id);
      const stops2 = getStops({ stop_id: orderedStopIds }, [
        "stop_id",
        "stop_lat",
        "stop_lon"
      ]);
      const orderedStops = orderedStopIds.map(
        (stopId) => stops2.find((stop) => stop.stop_id === stopId)
      );
      const routeAttributes = getRouteAttributes({ route_id: route.route_id }) ?? {};
      return feature(
        {
          type: "LineString",
          coordinates: orderedStops.map((stop) => [
            stop.stop_lon,
            stop.stop_lat
          ])
        },
        formatProperties({ route, routeAttributes })
      );
    })
  );
}

// src/lib/formats/envelope.ts
var envelope = (config, query = {}) => {
  const lines2 = getRouteLinesAsGeoJSON(query);
  const geojson = bboxPoly(bbox(lines2));
  featureEach2(geojson, (feature2) => {
    feature2.properties = {
      ...feature2.properties || {},
      agency_name: lines2.features[0].properties.agency_name
    };
  });
  return simplifyGeoJSON(geojson, config);
};
var envelope_default = envelope;

// src/lib/formats/convex.ts
import { getStopsAsGeoJSON } from "gtfs";
import turfConvex from "@turf/convex";
import { featureEach as featureEach3 } from "@turf/meta";
var convex = (config, query = {}) => {
  const stops2 = getStopsAsGeoJSON(query);
  const geojson = turfConvex(stops2);
  if (!geojson) {
    if (query.route_id && query.direction_id) {
      config.logWarning(
        `Unable to calculate convex hull for route: ${query.route_id} direction: ${query.direction_id}`
      );
    } else {
      config.logWarning("Unable to calculate convex hull");
    }
    return null;
  }
  featureEach3(geojson, (feature2) => {
    feature2.properties = {
      ...feature2.properties || {},
      agency_name: stops2.features[0].properties.agency_name
    };
  });
  return simplifyGeoJSON(geojson, config);
};
var convex_default = convex;

// src/lib/formats/lines-and-stops.ts
import { getStopsAsGeoJSON as getStopsAsGeoJSON2 } from "gtfs";
var linesAndStops = (config, query = {}) => {
  const shapesGeojson = getRouteLinesAsGeoJSON(query);
  const stopsGeojson = getStopsAsGeoJSON2(query);
  const geojson = mergeGeojson(shapesGeojson, stopsGeojson);
  return simplifyGeoJSON(geojson, config);
};
var lines_and_stops_default = linesAndStops;

// src/lib/formats/lines.ts
var lines = (config, query = {}) => {
  const geojson = getRouteLinesAsGeoJSON(query);
  return simplifyGeoJSON(geojson, config);
};
var lines_default = lines;

// src/lib/formats/lines-buffer.ts
import buffer from "@turf/buffer";
var linesBuffer = (config, query = {}) => {
  const lines2 = getRouteLinesAsGeoJSON(query);
  const geojson = buffer(lines2, config.bufferSizeMeters, { units: "meters" });
  return simplifyGeoJSON(geojson, config);
};
var lines_buffer_default = linesBuffer;

// src/lib/formats/lines-dissolved.ts
import buffer2 from "@turf/buffer";
var linesDissolved = (config, query = {}) => {
  const lines2 = getRouteLinesAsGeoJSON(query);
  const bufferedLines = buffer2(lines2, config.bufferSizeMeters, {
    units: "meters"
  });
  const simplifiedBufferedLines = simplifyGeoJSON(bufferedLines, config);
  const geojson = unionGeojson(simplifiedBufferedLines, config);
  geojson.properties = {
    ...geojson.properties || {},
    agency_name: bufferedLines.features[0].properties.agency_name
  };
  return simplifyGeoJSON(geojson, config);
};
var lines_dissolved_default = linesDissolved;

// src/lib/formats/stops.ts
import { getStopsAsGeoJSON as getStopsAsGeoJSON3 } from "gtfs";
var stops = (config, query = {}) => {
  const geojson = getStopsAsGeoJSON3(query);
  return simplifyGeoJSON(geojson, config);
};
var stops_default = stops;

// src/lib/formats/stops-buffer.ts
import { getStopsAsGeoJSON as getStopsAsGeoJSON4 } from "gtfs";
import buffer3 from "@turf/buffer";
var stopsBuffer = (config, query = {}) => {
  const stops2 = getStopsAsGeoJSON4(query);
  const geojson = buffer3(stops2, config.bufferSizeMeters, { units: "meters" });
  return simplifyGeoJSON(geojson, config);
};
var stops_buffer_default = stopsBuffer;

// src/lib/formats/stops-dissolved.ts
import { getStopsAsGeoJSON as getStopsAsGeoJSON5 } from "gtfs";
import buffer4 from "@turf/buffer";
var stopsDissolved = (config, query = {}) => {
  const stops2 = getStopsAsGeoJSON5(query);
  const bufferedStops = buffer4(stops2, config.bufferSizeMeters, {
    units: "meters"
  });
  const simplifiedBufferedStops = simplifyGeoJSON(bufferedStops, config);
  const geojson = unionGeojson(simplifiedBufferedStops, config);
  geojson.properties = {
    ...geojson.properties || {},
    agency_name: bufferedStops.features[0].properties.agency_name
  };
  return simplifyGeoJSON(geojson, config);
};
var stops_dissolved_default = stopsDissolved;

// src/lib/gtfs-to-geojson.ts
var limit = pLimit(20);
var { version } = JSON.parse(
  readFileSync(new URL("../../package.json", import.meta.url).pathname, "utf8")
);
var setDefaultConfig = (initialConfig) => {
  const defaults = {
    gtfsToGeoJSONVersion: version,
    bufferSizeMeters: 400,
    outputType: "agency",
    outputFormat: "lines-and-stops",
    skipImport: false,
    verbose: true,
    zipOutput: false,
    log: log(initialConfig),
    logWarning: logWarning(initialConfig),
    logError: logError(initialConfig)
  };
  return Object.assign(defaults, initialConfig);
};
var getServiceIdsForDateRange = (config) => {
  const db = openDb(config);
  let whereClause = "";
  const whereClauses = [];
  if (config.endDate) {
    whereClauses.push(`start_date <= ${sqlString.escape(config.endDate)}`);
  }
  if (config.startDate) {
    whereClauses.push(`end_date >= ${sqlString.escape(config.startDate)}`);
  }
  if (whereClauses.length > 0) {
    whereClause = `WHERE ${whereClauses.join(" AND ")}`;
  }
  const calendars = db.prepare(`SELECT * FROM calendar ${whereClause}`).all();
  return calendars.map(
    (calendar) => calendar.service_id
  );
};
var getGeoJSONByFormat = (config, query = {}) => {
  if (config.outputFormat === "envelope") {
    return envelope_default(config, query);
  }
  if (config.outputFormat === "convex") {
    return convex_default(config, query);
  }
  if (config.outputFormat === "lines-and-stops") {
    return lines_and_stops_default(config, query);
  }
  if (config.outputFormat === "lines") {
    return lines_default(config, query);
  }
  if (config.outputFormat === "lines-buffer") {
    return lines_buffer_default(config, query);
  }
  if (config.outputFormat === "lines-dissolved") {
    return lines_dissolved_default(config, query);
  }
  if (config.outputFormat === "stops") {
    return stops_default(config, query);
  }
  if (config.outputFormat === "stops-buffer") {
    return stops_buffer_default(config, query);
  }
  if (config.outputFormat === "stops-dissolved") {
    return stops_dissolved_default(config, query);
  }
  throw new Error(
    `Invalid outputFormat=${config.outputFormat} supplied in config.json`
  );
};
var buildGeoJSON = async (agencyKey, config, outputStats) => {
  const db = openDb(config);
  const baseQuery = {};
  if (config.startDate || config.endDate) {
    const serviceIds = getServiceIdsForDateRange(config);
    baseQuery.service_id = serviceIds;
  }
  if (config.outputType === "shape") {
    const shapes = await db.prepare("SELECT DISTINCT shape_id FROM shapes").all();
    if (shapes.length === 0) {
      throw new Error(
        "No shapes found in shapes.txt, unable to create geoJSON with outputType = shape"
      );
    }
    const bar = progressBar(
      `${agencyKey}: Generating geoJSON {bar} {value}/{total}`,
      shapes.length,
      config
    );
    await Promise.all(
      shapes.map(
        async (shape) => limit(async () => {
          const geojson = getGeoJSONByFormat(config, {
            ...baseQuery,
            shape_id: shape.shape_id
          });
          if (!geojson) {
            return;
          }
          outputStats.files += 1;
          outputStats.shapes += 1;
          const fileName = `${shape.shape_id}.geojson`;
          const filePath = path2.join(
            getExportPath(agencyKey),
            sanitize2(fileName)
          );
          await writeFile(filePath, JSON.stringify(geojson));
          bar.increment();
        })
      )
    );
  } else if (config.outputType === "route") {
    const routes = getRoutes2(baseQuery);
    const bar = progressBar(
      `${agencyKey}: Generating geoJSON {bar} {value}/{total}`,
      routes.length,
      config
    );
    await Promise.all(
      routes.map(
        async (route, index) => limit(async () => {
          outputStats.routes += 1;
          const trips = getTrips2(
            {
              ...baseQuery,
              route_id: route.route_id
            },
            ["trip_headsign", "direction_id"]
          );
          const directions = uniqBy(trips, (trip) => trip.trip_headsign);
          await Promise.all(
            directions.map(async (direction) => {
              const geojson = getGeoJSONByFormat(config, {
                ...baseQuery,
                route_id: route.route_id,
                direction_id: direction.direction_id
              });
              if (!geojson) {
                return;
              }
              outputStats.files += 1;
              const fileNameComponents = [];
              if (route.agency_id !== void 0) {
                fileNameComponents.push(route.agency_id);
              }
              fileNameComponents.push(route.route_id);
              if (direction.direction_id !== void 0) {
                fileNameComponents.push(direction.direction_id);
              }
              const identicalRoutes = routes.filter(
                (r) => r.agency_id === route.agency_id && r.route_id === route.route_id
              );
              if (identicalRoutes.length > 1) {
                fileNameComponents.push(index.toString());
              }
              const fileName = `${fileNameComponents.join("_")}.geojson`;
              const filePath = path2.join(
                getExportPath(agencyKey),
                sanitize2(fileName)
              );
              await writeFile(filePath, JSON.stringify(geojson));
            })
          );
          bar.increment();
        })
      )
    );
  } else if (config.outputType === "agency") {
    config.log(`${agencyKey}: Generating geoJSON`);
    const geojson = getGeoJSONByFormat(config, baseQuery);
    outputStats.files += 1;
    const fileName = `${agencyKey}.geojson`;
    const filePath = path2.join(getExportPath(agencyKey), sanitize2(fileName));
    await writeFile(filePath, JSON.stringify(geojson));
  } else {
    throw new Error(
      `Invalid outputType=${config.outputType} supplied in config.json`
    );
  }
};
var gtfsToGeoJSON = async (initialConfig) => {
  const config = setDefaultConfig(initialConfig);
  await openDb(config);
  for (const agency of config.agencies) {
    const timer = new Timer();
    timer.start();
    const outputStats = {
      routes: 0,
      shapes: 0,
      files: 0
    };
    const agencyKey = agency.agency_key;
    const exportPath = getExportPath(agencyKey);
    agency.exclude = [
      "areas",
      "attributions",
      "booking_rules",
      "fare_attributes",
      "fare_leg_rules",
      "fare_media",
      "fare_products",
      "fare_rules",
      "fare_transfer_rules",
      "levels",
      "pathways",
      "stop_areas",
      "timeframes",
      "transfers",
      ...agency.exclude ?? []
    ];
    if (config.skipImport !== true) {
      const agencyConfig = {
        ...clone(omit(config, "agencies")),
        agencies: [agency]
      };
      await importGtfs(agencyConfig);
    }
    await rm(exportPath, { recursive: true, force: true });
    await mkdir(exportPath, { recursive: true });
    await buildGeoJSON(agencyKey, config, outputStats);
    if (config.zipOutput) {
      await zipFolder(exportPath);
    }
    let geojsonPath = `${process.cwd()}/${exportPath}`;
    if (config.zipOutput) {
      geojsonPath += "/geojson.zip";
    }
    const logText = generateLogText(agency, outputStats, config);
    const filePath = path2.join(exportPath, "log.txt");
    await writeFile(filePath, logText);
    config.log(`GeoJSON for ${agencyKey} created at ${geojsonPath}`);
    logStats(outputStats, config);
    timer.stop();
    config.log(
      `GeoJSON generation required ${msToSeconds(timer.time())} seconds`
    );
  }
};
var gtfs_to_geojson_default = gtfsToGeoJSON;
export {
  gtfs_to_geojson_default as default
};
//# sourceMappingURL=index.js.map