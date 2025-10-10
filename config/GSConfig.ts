/**
 * Google Scholar Configuration
 * 
 * Defines mandatory parameters and base configuration for all Google Scholar queries.
 * These parameters must be included in every generated search URL.
 */

export interface MandatoryParameters {
  /** The base Google Scholar endpoint */
  baseURL: string;
  /** Host Language (Sets interface language) */
  hl: string;
  /** Search Document Type (0,5 = Academic Corpus; 4 = Case Law) */
  as_sdt: string;
}

export const GS_MANDATORY_PARAMS: MandatoryParameters = {
  baseURL: "https://scholar.google.com/scholar?",
  hl: "en", 
  as_sdt: "0%2C5", // Default: Standard academic/patents search
};

/** Required constants for consistent configuration */
export const BASE_URL = "https://scholar.google.com/scholar?";
export const DEFAULT_HL = "en";
export const DEFAULT_AS_SDT = "0%2C5";

/**
 * Optional Global Filters for Advanced UI Options
 * These can be used to add additional filtering capabilities
 */
export const GS_GLOBAL_FILTERS = {
  /** Date Range (Year Low / Year High) */
  yearLow: (year: number) => `as_ylo=${year}`, // e.g., 2020
  yearHigh: (year: number) => `as_yhi=${year}`, // e.g., 2024
  
  /** Quick Date Range (e.g., d10 for last 10 days) */
  quickDateRange: (range: string) => `as_qdr=${range}`,
  
  /** Exclude Citations (0 = include, 1 = exclude) */
  excludeCitations: (exclude: boolean) => `as_vis=${exclude ? 1 : 0}`,
  
  /** Enable/Disable Clustering Filters (1 = enabled, 0 = disabled) */
  filterClustering: (enable: boolean) => `filter=${enable ? 1 : 0}`,
  
  /** Search Type Filter (Case Law Courts) */
  caseLawCourts: (courts: string) => `as_sdt=4,${courts}`, // Requires '4' as the first value
};

/**
 * URL length validation constants
 */
export const MAX_URL_LENGTH = 2048; // Standard browser URL length limit

/**
 * Helper function to build base URL with mandatory parameters
 */
export function buildBaseUrl(): string {
  return `${BASE_URL}hl=${DEFAULT_HL}&as_sdt=${DEFAULT_AS_SDT}`;
}