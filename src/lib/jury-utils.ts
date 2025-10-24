import type {
  Professor,
  Procedure,
  ProfessorAvailability,
  JuryRequirements,
  JuryComposition,
  CsvParseResult,
  ProfessorSortCriteria,
  ProfessorFilter,
  ProfessorTitle,
  ProcedureType
} from '@/types/types';

/**
 * Parse CSV data for professors
 */
export function parseProfessorsCsv(csvContent: string): CsvParseResult<Professor> {
  const lines = csvContent.trim().split('\n');
  const professors: Professor[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const columns = line.split(',').map(col => col.trim());
    
    if (columns.length < 9) {
      errors.push(`Line ${i + 1}: Insufficient columns (expected 9, got ${columns.length})`);
      continue;
    }

    try {
      const professor: Professor = {
        id: parseInt(columns[0]),
        title: columns[1] as ProfessorTitle,
        names: columns[2],
        science: parseFloat(columns[3]),
        university: columns[4],
        km: parseFloat(columns[5]),
        count: parseInt(columns[6]),
        preLastDate: columns[7] && columns[7] !== 'null' ? columns[7] : null,
        lastDate: columns[8] && columns[8] !== 'null' ? columns[8] : null,
      };

      // Validation
      if (isNaN(professor.id)) {
        errors.push(`Line ${i + 1}: Invalid ID`);
        continue;
      }
      
      if (!['професор', 'доцент'].includes(professor.title)) {
        errors.push(`Line ${i + 1}: Invalid title "${professor.title}"`);
        continue;
      }

      if (isNaN(professor.science) || professor.science < 4.6 || professor.science > 4.9) {
        warnings.push(`Line ${i + 1}: Science rating ${professor.science} is outside expected range (4.6-4.9)`);
      }

      if (isNaN(professor.km) || professor.km < 0) {
        warnings.push(`Line ${i + 1}: Invalid distance ${professor.km}`);
      }

      if (isNaN(professor.count) || professor.count < 0) {
        warnings.push(`Line ${i + 1}: Invalid participation count ${professor.count}`);
      }

      professors.push(professor);
    } catch (error) {
      errors.push(`Line ${i + 1}: Parse error - ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return { data: professors, errors, warnings };
}

/**
 * Parse CSV data for procedures
 */
export function parseProceduresCsv(csvContent: string): CsvParseResult<Procedure> {
  const lines = csvContent.trim().split('\n');
  const procedures: Procedure[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const columns = line.split(',').map(col => col.trim());
    
    if (columns.length < 9) {
      errors.push(`Line ${i + 1}: Insufficient columns (expected 9, got ${columns.length})`);
      continue;
    }

    try {
      const procedure: Procedure = {
        id: parseInt(columns[0]),
        date: columns[1],
        procedure: columns[2] as ProcedureType,
        m1: columns[3] && columns[3] !== 'null' ? parseInt(columns[3]) : null,
        m2: columns[4] && columns[4] !== 'null' ? parseInt(columns[4]) : null,
        m3: columns[5] && columns[5] !== 'null' ? parseInt(columns[5]) : null,
        m4: columns[6] && columns[6] !== 'null' ? parseInt(columns[6]) : null,
        m5: columns[7] && columns[7] !== 'null' ? parseInt(columns[7]) : null,
        m6: columns[8] && columns[8] !== 'null' ? parseInt(columns[8]) : null,
        m7: columns[9] && columns[9] !== 'null' ? parseInt(columns[9]) : null,
      };

      // Validation
      if (isNaN(procedure.id)) {
        errors.push(`Line ${i + 1}: Invalid ID`);
        continue;
      }

      if (!['доктор', 'доцент', 'ДН', 'професор'].includes(procedure.procedure)) {
        errors.push(`Line ${i + 1}: Invalid procedure type "${procedure.procedure}"`);
        continue;
      }

      // Validate date format (assuming YYYY-MM-DD)
      if (!isValidDate(procedure.date)) {
        warnings.push(`Line ${i + 1}: Invalid date format "${procedure.date}"`);
      }

      procedures.push(procedure);
    } catch (error) {
      errors.push(`Line ${i + 1}: Parse error - ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return { data: procedures, errors, warnings };
}

/**
 * Check if a date string is valid
 */
function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Calculate days between two dates
 */
export function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if a professor is available for a given date
 */
export function isProfessorAvailable(
  professor: Professor,
  targetDate: string,
  requirements: JuryRequirements,
  procedures: Procedure[]
): ProfessorAvailability {
  const lastDate = professor.lastDate;
  const preLastDate = professor.preLastDate;

  // Check if professor has participated recently
  if (lastDate) {
    const daysSinceLastParticipation = daysBetween(lastDate, targetDate);
    
    if (daysSinceLastParticipation < requirements.minDaysBetweenParticipations) {
      return {
        professor,
        isAvailable: false,
        reason: `Last participation was ${daysSinceLastParticipation} days ago (minimum: ${requirements.minDaysBetweenParticipations})`,
        lastParticipationDate: lastDate,
        consecutiveCount: 0
      };
    }
  }

  // Check consecutive participation rules
  const consecutiveCount = calculateConsecutiveParticipations(professor, procedures);
  if (consecutiveCount >= requirements.maxConsecutiveParticipations) {
    return {
      professor,
      isAvailable: false,
      reason: `Maximum consecutive participations reached (${consecutiveCount}/${requirements.maxConsecutiveParticipations})`,
      lastParticipationDate: lastDate,
      consecutiveCount
    };
  }

  return {
    professor,
    isAvailable: true,
    lastParticipationDate: lastDate,
    consecutiveCount
  };
}

/**
 * Calculate consecutive participations for a professor
 */
export function calculateConsecutiveParticipations(professor: Professor, procedures: Procedure[]): number {
  // Get all procedures where this professor participated, sorted by date
  const participations = procedures
    .filter(proc => 
      proc.m1 === professor.id || 
      proc.m2 === professor.id || 
      proc.m3 === professor.id || 
      proc.m4 === professor.id || 
      proc.m5 === professor.id || 
      proc.m6 === professor.id || 
      proc.m7 === professor.id
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (participations.length === 0) return 0;

  // Count consecutive participations from the most recent
  let consecutiveCount = 1;
  for (let i = participations.length - 1; i > 0; i--) {
    const currentDate = new Date(participations[i].date);
    const previousDate = new Date(participations[i - 1].date);
    const daysDiff = daysBetween(participations[i - 1].date, participations[i].date);
    
    // If the gap is more than 30 days, break the consecutive chain
    if (daysDiff > 30) {
      break;
    }
    consecutiveCount++;
  }

  return consecutiveCount;
}

/**
 * Get available professors for a given date
 */
export function getAvailableProfessors(
  professors: Professor[],
  targetDate: string,
  requirements: JuryRequirements,
  procedures: Procedure[],
  filter?: ProfessorFilter
): ProfessorAvailability[] {
  let filteredProfessors = professors;

  // Apply filters
  if (filter) {
    if (filter.title) {
      filteredProfessors = filteredProfessors.filter(p => p.title === filter.title);
    }
    if (filter.university) {
      filteredProfessors = filteredProfessors.filter(p => p.university === filter.university);
    }
    if (filter.minScienceRating !== undefined) {
      filteredProfessors = filteredProfessors.filter(p => p.science >= filter.minScienceRating!);
    }
    if (filter.maxScienceRating !== undefined) {
      filteredProfessors = filteredProfessors.filter(p => p.science <= filter.maxScienceRating!);
    }
    if (filter.maxDistance !== undefined) {
      filteredProfessors = filteredProfessors.filter(p => p.km <= filter.maxDistance!);
    }
    if (filter.excludeIds) {
      filteredProfessors = filteredProfessors.filter(p => !filter.excludeIds!.includes(p.id));
    }
  }

  return filteredProfessors.map(professor => 
    isProfessorAvailable(professor, targetDate, requirements, procedures)
  );
}

/**
 * Sort professors by criteria
 */
export function sortProfessors(
  professors: Professor[],
  criteria: ProfessorSortCriteria,
  ascending: boolean = true
): Professor[] {
  return [...professors].sort((a, b) => {
    let comparison = 0;

    switch (criteria) {
      case 'distance':
        comparison = a.km - b.km;
        break;
      case 'lastParticipation':
        const aDate = a.lastDate ? new Date(a.lastDate).getTime() : 0;
        const bDate = b.lastDate ? new Date(b.lastDate).getTime() : 0;
        comparison = aDate - bDate;
        break;
      case 'participationCount':
        comparison = a.count - b.count;
        break;
      case 'scienceRating':
        comparison = a.science - b.science;
        break;
      case 'name':
        comparison = a.names.localeCompare(b.names);
        break;
    }

    return ascending ? comparison : -comparison;
  });
}

/**
 * Create jury composition based on requirements
 */
export function createJuryComposition(
  professors: Professor[],
  procedures: Procedure[],
  targetDate: string,
  requirements: JuryRequirements,
  homeUniversity: string
): JuryComposition {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Get available professors
  const availableProfessors = getAvailableProfessors(
    professors,
    targetDate,
    requirements,
    procedures
  ).filter(av => av.isAvailable).map(av => av.professor);

  // Separate by title
  const professorsList = availableProfessors.filter(p => p.title === 'професор');
  const associateProfessorsList = availableProfessors.filter(p => p.title === 'доцент');

  // Check if we have enough professors
  if (professorsList.length < requirements.professorCount) {
    errors.push(`Insufficient professors available: ${professorsList.length}/${requirements.professorCount}`);
  }

  if (associateProfessorsList.length < requirements.associateProfessorCount) {
    errors.push(`Insufficient associate professors available: ${associateProfessorsList.length}/${requirements.associateProfessorCount}`);
  }

  // Select professors (prioritize by distance for external members)
  const selectedProfessors = sortProfessors(professorsList, 'distance')
    .slice(0, requirements.professorCount);

  const selectedAssociateProfessors = sortProfessors(associateProfessorsList, 'distance')
    .slice(0, requirements.associateProfessorCount);

  // Separate internal and external members
  const allMembers = [...selectedProfessors, ...selectedAssociateProfessors];
  const internalMembers = allMembers.filter(p => p.university === homeUniversity);
  const externalMembers = allMembers.filter(p => p.university !== homeUniversity);

  // Check distance requirements for external members
  const distantExternalMembers = externalMembers.filter(p => p.km > requirements.maxDistanceForExternal);
  if (distantExternalMembers.length > 0) {
    warnings.push(`${distantExternalMembers.length} external members exceed maximum distance (${requirements.maxDistanceForExternal}km)`);
  }

  return {
    professors: selectedProfessors,
    associateProfessors: selectedAssociateProfessors,
    externalMembers,
    internalMembers,
    allMembers,
    errors,
    warnings
  };
}

/**
 * Get professor participation history
 */
export function getProfessorParticipationHistory(
  professor: Professor,
  procedures: Procedure[]
): Procedure[] {
  return procedures
    .filter(proc => 
      proc.m1 === professor.id || 
      proc.m2 === professor.id || 
      proc.m3 === professor.id || 
      proc.m4 === professor.id || 
      proc.m5 === professor.id || 
      proc.m6 === professor.id || 
      proc.m7 === professor.id
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Calculate professor workload statistics
 */
export function calculateProfessorWorkload(
  professor: Professor,
  procedures: Procedure[],
  year?: number
): {
  totalParticipations: number;
  participationsThisYear: number;
  averageDaysBetweenParticipations: number;
  lastParticipationDate: string | null;
} {
  const history = getProfessorParticipationHistory(professor, procedures);
  
  let participationsThisYear = history.length;
  if (year) {
    participationsThisYear = history.filter(proc => 
      new Date(proc.date).getFullYear() === year
    ).length;
  }

  let averageDaysBetween = 0;
  if (history.length > 1) {
    const totalDays = history.reduce((sum, proc, index) => {
      if (index === 0) return 0;
      return sum + daysBetween(history[index - 1].date, proc.date);
    }, 0);
    averageDaysBetween = totalDays / (history.length - 1);
  }

  return {
    totalParticipations: history.length,
    participationsThisYear,
    averageDaysBetweenParticipations: averageDaysBetween,
    lastParticipationDate: history.length > 0 ? history[history.length - 1].date : null
  };
}
