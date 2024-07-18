interface IConfig {
    agencies: {
        agency_key: string;
        url?: string;
        path?: string;
        exclude?: string[];
    }[];
    bufferSizeMeters?: number;
    coordinatePrecision?: number;
    outputType?: string;
    outputFormat?: string;
    startDate?: string;
    endDate?: string;
    verbose?: boolean;
    zipOutput?: boolean;
    sqlitePath?: string;
    log: (text: string) => void;
    logWarning: (text: string) => void;
    logError: (text: string) => void;
}
declare const gtfsToGeoJSON: (initialConfig: IConfig) => Promise<void>;

export { gtfsToGeoJSON as default };
