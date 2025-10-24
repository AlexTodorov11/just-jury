import { useState, useCallback, useEffect } from 'react';
import type { Professor, Procedure, JuryRequirements, ProfessorFilter } from '@/types/types';
import { JuryDataLoader, DEFAULT_JURY_REQUIREMENTS } from '@/lib/data-loader';
import { 
  getAvailableProfessors, 
  createJuryComposition, 
  sortProfessors,
  calculateProfessorWorkload 
} from '@/lib/jury-utils';

/**
 * Hook for managing jury data and operations
 */
export function useJuryData() {
  const [dataLoader] = useState(() => new JuryDataLoader());
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requirements, setRequirements] = useState<JuryRequirements>(DEFAULT_JURY_REQUIREMENTS);

  // Load professors from CSV
  const loadProfessors = useCallback(async (csvContent: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await dataLoader.loadProfessorsFromCsv(csvContent);
      
      if (result.errors.length > 0) {
        setError(result.errors.join('; '));
      }
      
      setProfessors(result.data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dataLoader]);

  // Load procedures from CSV
  const loadProcedures = useCallback(async (csvContent: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await dataLoader.loadProceduresFromCsv(csvContent);
      
      if (result.errors.length > 0) {
        setError(result.errors.join('; '));
      }
      
      setProcedures(result.data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dataLoader]);

  // Load professors from file
  const loadProfessorsFromFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await dataLoader.loadProfessorsFromFile(file);
      
      if (result.errors.length > 0) {
        setError(result.errors.join('; '));
      }
      
      setProfessors(result.data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dataLoader]);

  // Load procedures from file
  const loadProceduresFromFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await dataLoader.loadProceduresFromFile(file);
      
      if (result.errors.length > 0) {
        setError(result.errors.join('; '));
      }
      
      setProcedures(result.data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dataLoader]);

  // Get available professors for a date
  const getAvailableProfessorsForDate = useCallback((
    targetDate: string,
    filter?: ProfessorFilter
  ) => {
    return getAvailableProfessors(professors, targetDate, requirements, procedures, filter);
  }, [professors, procedures, requirements]);

  // Create jury composition
  const createJury = useCallback((
    targetDate: string,
    homeUniversity: string
  ) => {
    return createJuryComposition(professors, procedures, targetDate, requirements, homeUniversity);
  }, [professors, procedures, requirements]);

  // Sort professors
  const sortProfessorsBy = useCallback((
    criteria: 'distance' | 'lastParticipation' | 'participationCount' | 'scienceRating' | 'name',
    ascending: boolean = true
  ) => {
    return sortProfessors(professors, criteria, ascending);
  }, [professors]);

  // Get professor workload
  const getProfessorWorkload = useCallback((
    professor: Professor,
    year?: number
  ) => {
    return calculateProfessorWorkload(professor, procedures, year);
  }, [procedures]);

  // Clear all data
  const clearData = useCallback(() => {
    dataLoader.clear();
    setProfessors([]);
    setProcedures([]);
    setError(null);
  }, [dataLoader]);

  // Update requirements
  const updateRequirements = useCallback((newRequirements: Partial<JuryRequirements>) => {
    setRequirements(prev => ({ ...prev, ...newRequirements }));
  }, []);

  // Get data summary
  const getDataSummary = useCallback(() => {
    return {
      professorCount: professors.length,
      procedureCount: procedures.length,
      errorCount: dataLoader.getErrors().length,
      warningCount: dataLoader.getWarnings().length,
      loading
    };
  }, [professors.length, procedures.length, dataLoader, loading]);

  return {
    // Data
    professors,
    procedures,
    requirements,
    
    // State
    loading,
    error,
    
    // Actions
    loadProfessors,
    loadProcedures,
    loadProfessorsFromFile,
    loadProceduresFromFile,
    clearData,
    updateRequirements,
    
    // Utilities
    getAvailableProfessorsForDate,
    createJury,
    sortProfessorsBy,
    getProfessorWorkload,
    getDataSummary
  };
}

/**
 * Hook for managing professor filters
 */
export function useProfessorFilters() {
  const [filters, setFilters] = useState<ProfessorFilter>({});

  const updateFilter = useCallback((key: keyof ProfessorFilter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== ''
  );

  return {
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters
  };
}

/**
 * Hook for managing jury composition
 */
export function useJuryComposition() {
  const [composition, setComposition] = useState<{
    targetDate: string;
    homeUniversity: string;
    result: any;
  } | null>(null);

  const createComposition = useCallback((
    targetDate: string,
    homeUniversity: string,
    createJuryFn: (date: string, university: string) => any
  ) => {
    const result = createJuryFn(targetDate, homeUniversity);
    setComposition({
      targetDate,
      homeUniversity,
      result
    });
    return result;
  }, []);

  const clearComposition = useCallback(() => {
    setComposition(null);
  }, []);

  return {
    composition,
    createComposition,
    clearComposition
  };
}
