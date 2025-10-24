/**
 * Example usage of the Academic Jury Management System
 * This file demonstrates how to use all the types and utilities
 */

import type { Professor, Procedure, JuryRequirements } from '@/types/types';
import { JuryDataLoader, DEFAULT_JURY_REQUIREMENTS } from '@/lib/data-loader';
import { 
  getAvailableProfessors, 
  createJuryComposition, 
  sortProfessors,
  calculateProfessorWorkload,
  daysBetween
} from '@/lib/jury-utils';

// Example CSV data (Bulgarian format)
const exampleProfessorsCsv = `ID,Title,Names,Science,University,Km,Count,Pre-last date,Last date
1,професор,Иван Петров,4.7,Софийски университет,0,5,2023-01-15,2023-06-20
2,доцент,Мария Георгиева,4.8,Пловдивски университет,120,3,2023-02-10,2023-05-15
3,професор,Петър Стоянов,4.6,Варненски свободен университет,350,7,2023-01-20,2023-07-10
4,доцент,Анна Димитрова,4.9,Технически университет София,5,2,2023-03-05,2023-08-12
5,професор,Георги Иванов,4.7,Университет за национално и световно стопанство,10,4,2023-02-28,2023-06-30`;

const exampleProceduresCsv = `ID,Date,Procedure,M1,M2,M3,M4,M5,M6,M7
1,2023-06-20,доктор,1,2,3,4,5,null,null
2,2023-05-15,доцент,2,3,4,5,1,null,null
3,2023-07-10,професор,3,4,5,1,2,null,null
4,2023-08-12,ДН,4,5,1,2,3,null,null
5,2023-06-30,доктор,5,1,2,3,4,null,null`;

/**
 * Example: Basic data loading and parsing
 */
export async function exampleBasicUsage() {
  console.log('=== Basic Usage Example ===');
  
  const dataLoader = new JuryDataLoader();
  
  // Load professors
  const professorsResult = await dataLoader.loadProfessorsFromCsv(exampleProfessorsCsv);
  console.log('Professors loaded:', professorsResult.data.length);
  console.log('Errors:', professorsResult.errors);
  console.log('Warnings:', professorsResult.warnings);
  
  // Load procedures
  const proceduresResult = await dataLoader.loadProceduresFromCsv(exampleProceduresCsv);
  console.log('Procedures loaded:', proceduresResult.data.length);
  
  const professors = professorsResult.data;
  const procedures = proceduresResult.data;
  
  return { professors, procedures };
}

/**
 * Example: Check professor availability
 */
export async function exampleProfessorAvailability() {
  console.log('\n=== Professor Availability Example ===');
  
  const { professors, procedures } = await exampleBasicUsage();
  const requirements: JuryRequirements = {
    ...DEFAULT_JURY_REQUIREMENTS,
    minDaysBetweenParticipations: 30,
    maxConsecutiveParticipations: 3
  };
  
  const targetDate = '2023-09-15';
  
  // Get available professors
  const availableProfessors = getAvailableProfessors(
    professors,
    targetDate,
    requirements,
    procedures
  );
  
  console.log(`Available professors for ${targetDate}:`);
  availableProfessors.forEach(av => {
    console.log(`- ${av.professor.names} (${av.professor.title}): ${av.isAvailable ? 'Available' : 'Not Available'}`);
    if (!av.isAvailable && av.reason) {
      console.log(`  Reason: ${av.reason}`);
    }
  });
  
  return availableProfessors;
}

/**
 * Example: Create jury composition
 */
export async function exampleJuryComposition() {
  console.log('\n=== Jury Composition Example ===');
  
  const { professors, procedures } = await exampleBasicUsage();
  const requirements: JuryRequirements = {
    professorCount: 2,
    associateProfessorCount: 2,
    maxConsecutiveParticipations: 3,
    minDaysBetweenParticipations: 30,
    maxDistanceForExternal: 200
  };
  
  const targetDate = '2023-09-15';
  const homeUniversity = 'Софийски университет';
  
  // Create jury composition
  const composition = createJuryComposition(
    professors,
    procedures,
    targetDate,
    requirements,
    homeUniversity
  );
  
  console.log('Jury Composition:');
  console.log(`- Professors: ${composition.professors.length}/${requirements.professorCount}`);
  console.log(`- Associate Professors: ${composition.associateProfessors.length}/${requirements.associateProfessorCount}`);
  console.log(`- External Members: ${composition.externalMembers.length}`);
  console.log(`- Internal Members: ${composition.internalMembers.length}`);
  
  if (composition.errors.length > 0) {
    console.log('Errors:', composition.errors);
  }
  
  if (composition.warnings.length > 0) {
    console.log('Warnings:', composition.warnings);
  }
  
  console.log('\nSelected Members:');
  composition.allMembers.forEach(member => {
    const isExternal = member.university !== homeUniversity;
    console.log(`- ${member.names} (${member.title}) - ${member.university} ${isExternal ? `[External, ${member.km}km]` : '[Internal]'}`);
  });
  
  return composition;
}

/**
 * Example: Professor sorting and filtering
 */
export async function exampleProfessorSorting() {
  console.log('\n=== Professor Sorting Example ===');
  
  const { professors } = await exampleBasicUsage();
  
  // Sort by distance
  const byDistance = sortProfessors(professors, 'distance');
  console.log('Sorted by distance:');
  byDistance.forEach(p => console.log(`- ${p.names}: ${p.km}km`));
  
  // Sort by science rating (descending)
  const byScience = sortProfessors(professors, 'scienceRating', false);
  console.log('\nSorted by science rating (descending):');
  byScience.forEach(p => console.log(`- ${p.names}: ${p.science}`));
  
  // Sort by participation count
  const byParticipation = sortProfessors(professors, 'participationCount', false);
  console.log('\nSorted by participation count (descending):');
  byParticipation.forEach(p => console.log(`- ${p.names}: ${p.count} participations`));
  
  return { byDistance, byScience, byParticipation };
}

/**
 * Example: Professor workload analysis
 */
export async function exampleWorkloadAnalysis() {
  console.log('\n=== Workload Analysis Example ===');
  
  const { professors, procedures } = await exampleBasicUsage();
  
  console.log('Professor Workload Analysis:');
  professors.forEach(professor => {
    const workload = calculateProfessorWorkload(professor, procedures);
    console.log(`\n${professor.names} (${professor.title}):`);
    console.log(`- Total participations: ${workload.totalParticipations}`);
    console.log(`- Participations this year: ${workload.participationsThisYear}`);
    console.log(`- Average days between participations: ${workload.averageDaysBetweenParticipations.toFixed(1)}`);
    console.log(`- Last participation: ${workload.lastParticipationDate || 'Never'}`);
  });
  
  return professors.map(p => ({
    professor: p,
    workload: calculateProfessorWorkload(p, procedures)
  }));
}

/**
 * Example: Advanced filtering
 */
export async function exampleAdvancedFiltering() {
  console.log('\n=== Advanced Filtering Example ===');
  
  const { professors, procedures } = await exampleBasicUsage();
  const requirements = DEFAULT_JURY_REQUIREMENTS;
  const targetDate = '2023-09-15';
  
  // Filter for high-rated professors from external universities
  const externalHighRated = getAvailableProfessors(
    professors,
    targetDate,
    requirements,
    procedures,
    {
      minScienceRating: 4.7,
      maxDistance: 300,
      excludeIds: [1] // Exclude professor with ID 1
    }
  ).filter(av => av.isAvailable && av.professor.university !== 'Софийски университет');
  
  console.log('External high-rated professors:');
  externalHighRated.forEach(av => {
    const p = av.professor;
    console.log(`- ${p.names} (${p.title}): ${p.science} rating, ${p.university}, ${p.km}km`);
  });
  
  return externalHighRated;
}

/**
 * Example: Date calculations
 */
export function exampleDateCalculations() {
  console.log('\n=== Date Calculations Example ===');
  
  const date1 = '2023-06-20';
  const date2 = '2023-09-15';
  
  const days = daysBetween(date1, date2);
  console.log(`Days between ${date1} and ${date2}: ${days}`);
  
  return days;
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log('Academic Jury Management System - Examples');
  console.log('==========================================');
  
  try {
    await exampleBasicUsage();
    await exampleProfessorAvailability();
    await exampleJuryComposition();
    await exampleProfessorSorting();
    await exampleWorkloadAnalysis();
    await exampleAdvancedFiltering();
    exampleDateCalculations();
    
    console.log('\n=== All examples completed successfully! ===');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Export for use in React components
export const exampleData = {
  professorsCsv: exampleProfessorsCsv,
  proceduresCsv: exampleProceduresCsv,
  defaultRequirements: DEFAULT_JURY_REQUIREMENTS
};
