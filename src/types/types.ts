import type { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type TicketMetric = {
  date: string;
  type: "created" | "resolved";
  count: number;
};

// Academic Jury Management System Types

/**
 * Professor title enumeration
 */
export type ProfessorTitle = "професор" | "доцент";

/**
 * Procedure type enumeration
 */
export type ProcedureType = "доктор" | "доцент" | "ДН" | "професор";

/**
 * Professor interface based on Bulgarian CSV structure
 */
export interface Professor {
  /** Unique identifier */
  id: number;
  /** Academic title (професор/доцент) */
  title: ProfessorTitle;
  /** Full name */
  names: string;
  /** Science rating (4.6-4.9) */
  science: number;
  /** University affiliation */
  university: string;
  /** Distance in kilometers */
  km: number;
  /** Participation count */
  count: number;
  /** Pre-last participation date */
  preLastDate: string | null;
  /** Last participation date */
  lastDate: string | null;
}

/**
 * Procedure interface based on Bulgarian CSV structure
 */
export interface Procedure {
  /** Unique identifier */
  id: number;
  /** Procedure date */
  date: string;
  /** Type of procedure (доктор/доцент/ДН/професор) */
  procedure: ProcedureType;
  /** Member 1 ID */
  m1: number | null;
  /** Member 2 ID */
  m2: number | null;
  /** Member 3 ID */
  m3: number | null;
  /** Member 4 ID */
  m4: number | null;
  /** Member 5 ID */
  m5: number | null;
  /** Member 6 ID */
  m6: number | null;
  /** Member 7 ID */
  m7: number | null;
}

/**
 * Professor availability status
 */
export interface ProfessorAvailability {
  professor: Professor;
  isAvailable: boolean;
  reason?: string;
  lastParticipationDate?: string;
  consecutiveCount?: number;
}

/**
 * Jury composition requirements
 */
export interface JuryRequirements {
  /** Required number of professors */
  professorCount: number;
  /** Required number of associate professors */
  associateProfessorCount: number;
  /** Maximum consecutive participations allowed */
  maxConsecutiveParticipations: number;
  /** Minimum days between participations */
  minDaysBetweenParticipations: number;
  /** Maximum distance for external members (km) */
  maxDistanceForExternal: number;
}

/**
 * Jury composition result
 */
export interface JuryComposition {
  /** Selected professors */
  professors: Professor[];
  /** Selected associate professors */
  associateProfessors: Professor[];
  /** External members (from other universities) */
  externalMembers: Professor[];
  /** Internal members (from same university) */
  internalMembers: Professor[];
  /** Total composition */
  allMembers: Professor[];
  /** Validation errors */
  errors: string[];
  /** Warnings */
  warnings: string[];
}

/**
 * CSV parsing result
 */
export interface CsvParseResult<T> {
  data: T[];
  errors: string[];
  warnings: string[];
}

/**
 * Professor sorting criteria
 */
export type ProfessorSortCriteria = 
  | "distance" 
  | "lastParticipation" 
  | "participationCount" 
  | "scienceRating" 
  | "name";

/**
 * Professor filter criteria
 */
export interface ProfessorFilter {
  /** Available on specific date */
  availableOnDate?: string;
  /** Minimum science rating */
  minScienceRating?: number;
  /** Maximum science rating */
  maxScienceRating?: number;
  /** Specific university */
  university?: string;
  /** Exclude specific professor IDs */
  excludeIds?: number[];
  /** Maximum distance */
  maxDistance?: number;
  /** Title filter */
  title?: ProfessorTitle;
}