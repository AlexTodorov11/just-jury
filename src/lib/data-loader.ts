import type { Professor, Procedure, CsvParseResult } from '@/types/types';
import { parseProfessorsCsv, parseProceduresCsv } from './jury-utils';

/**
 * Data loader for academic jury management system
 */
export class JuryDataLoader {
  private professors: Professor[] = [];
  private procedures: Procedure[] = [];
  private loadErrors: string[] = [];
  private loadWarnings: string[] = [];

  /**
   * Load professors from CSV content
   */
  async loadProfessorsFromCsv(csvContent: string): Promise<CsvParseResult<Professor>> {
    const result = parseProfessorsCsv(csvContent);
    
    if (result.errors.length === 0) {
      this.professors = result.data;
    }
    
    this.loadErrors.push(...result.errors);
    this.loadWarnings.push(...result.warnings);
    
    return result;
  }

  /**
   * Load procedures from CSV content
   */
  async loadProceduresFromCsv(csvContent: string): Promise<CsvParseResult<Procedure>> {
    const result = parseProceduresCsv(csvContent);
    
    if (result.errors.length === 0) {
      this.procedures = result.data;
    }
    
    this.loadErrors.push(...result.errors);
    this.loadWarnings.push(...result.warnings);
    
    return result;
  }

  /**
   * Load professors from file
   */
  async loadProfessorsFromFile(file: File): Promise<CsvParseResult<Professor>> {
    try {
      const content = await this.readFileAsText(file);
      return await this.loadProfessorsFromCsv(content);
    } catch (error) {
      const errorMessage = `Failed to load professors file: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.loadErrors.push(errorMessage);
      return { data: [], errors: [errorMessage], warnings: [] };
    }
  }

  /**
   * Load procedures from file
   */
  async loadProceduresFromFile(file: File): Promise<CsvParseResult<Procedure>> {
    try {
      const content = await this.readFileAsText(file);
      return await this.loadProceduresFromCsv(content);
    } catch (error) {
      const errorMessage = `Failed to load procedures file: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.loadErrors.push(errorMessage);
      return { data: [], errors: [errorMessage], warnings: [] };
    }
  }

  /**
   * Load data from URLs (for server-side loading)
   */
  async loadProfessorsFromUrl(url: string): Promise<CsvParseResult<Professor>> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const content = await response.text();
      return await this.loadProfessorsFromCsv(content);
    } catch (error) {
      const errorMessage = `Failed to load professors from URL: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.loadErrors.push(errorMessage);
      return { data: [], errors: [errorMessage], warnings: [] };
    }
  }

  /**
   * Load procedures from URL
   */
  async loadProceduresFromUrl(url: string): Promise<CsvParseResult<Procedure>> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const content = await response.text();
      return await this.loadProceduresFromCsv(content);
    } catch (error) {
      const errorMessage = `Failed to load procedures from URL: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.loadErrors.push(errorMessage);
      return { data: [], errors: [errorMessage], warnings: [] };
    }
  }

  /**
   * Get loaded professors
   */
  getProfessors(): Professor[] {
    return [...this.professors];
  }

  /**
   * Get loaded procedures
   */
  getProcedures(): Procedure[] {
    return [...this.procedures];
  }

  /**
   * Get all load errors
   */
  getErrors(): string[] {
    return [...this.loadErrors];
  }

  /**
   * Get all load warnings
   */
  getWarnings(): string[] {
    return [...this.loadWarnings];
  }

  /**
   * Clear all loaded data
   */
  clear(): void {
    this.professors = [];
    this.procedures = [];
    this.loadErrors = [];
    this.loadWarnings = [];
  }

  /**
   * Check if data is loaded
   */
  isDataLoaded(): boolean {
    return this.professors.length > 0 || this.procedures.length > 0;
  }

  /**
   * Get data summary
   */
  getDataSummary(): {
    professorCount: number;
    procedureCount: number;
    errorCount: number;
    warningCount: number;
  } {
    return {
      professorCount: this.professors.length,
      procedureCount: this.procedures.length,
      errorCount: this.loadErrors.length,
      warningCount: this.loadWarnings.length
    };
  }

  /**
   * Read file as text
   */
  private async readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('File reading error'));
      reader.readAsText(file, 'UTF-8');
    });
  }
}

/**
 * Create a new data loader instance
 */
export function createJuryDataLoader(): JuryDataLoader {
  return new JuryDataLoader();
}

/**
 * Default jury requirements
 */
export const DEFAULT_JURY_REQUIREMENTS = {
  professorCount: 3,
  associateProfessorCount: 2,
  maxConsecutiveParticipations: 3,
  minDaysBetweenParticipations: 30,
  maxDistanceForExternal: 100
} as const;
