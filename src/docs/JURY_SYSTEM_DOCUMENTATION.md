# Academic Jury Management System

A comprehensive TypeScript system for managing academic jury compositions based on Bulgarian CSV data structures.

## Overview

This system provides type-safe interfaces and utilities for managing academic jury compositions, including professor availability checking, eligibility rules, and distance-based sorting for external members.

## Features

- **Type-safe interfaces** for professors and procedures based on Bulgarian CSV structure
- **CSV parsing utilities** with validation and error handling
- **Professor availability checking** with consecutive participation rules
- **Jury composition algorithms** with configurable requirements
- **Distance-based sorting** for external members
- **Workload analysis** and participation tracking
- **React hooks** for easy integration
- **Comprehensive filtering** and sorting options

## File Structure

```
src/
├── types/
│   └── types.ts                 # TypeScript interfaces and types
├── lib/
│   ├── jury-utils.ts           # Core utility functions
│   └── data-loader.ts          # CSV loading and data management
├── hooks/
│   └── use-jury-data.ts        # React hooks for data management
├── examples/
│   └── jury-system-example.ts  # Usage examples
└── docs/
    └── JURY_SYSTEM_DOCUMENTATION.md
```

## Types

### Professor Interface

```typescript
interface Professor {
  id: number;                    // Unique identifier
  title: ProfessorTitle;         // "професор" | "доцент"
  names: string;                 // Full name
  science: number;               // Science rating (4.6-4.9)
  university: string;            // University affiliation
  km: number;                    // Distance in kilometers
  count: number;                 // Participation count
  preLastDate: string | null;    // Pre-last participation date
  lastDate: string | null;       // Last participation date
}
```

### Procedure Interface

```typescript
interface Procedure {
  id: number;                    // Unique identifier
  date: string;                  // Procedure date
  procedure: ProcedureType;      // "доктор" | "доцент" | "ДН" | "професор"
  m1: number | null;             // Member 1 ID
  m2: number | null;             // Member 2 ID
  m3: number | null;             // Member 3 ID
  m4: number | null;             // Member 4 ID
  m5: number | null;             // Member 5 ID
  m6: number | null;             // Member 6 ID
  m7: number | null;             // Member 7 ID
}
```

## Usage

### Basic Data Loading

```typescript
import { JuryDataLoader } from '@/lib/data-loader';

const dataLoader = new JuryDataLoader();

// Load from CSV content
const professorsResult = await dataLoader.loadProfessorsFromCsv(csvContent);
const proceduresResult = await dataLoader.loadProceduresFromCsv(csvContent);

// Load from files
const professorsResult = await dataLoader.loadProfessorsFromFile(file);
```

### Professor Availability Checking

```typescript
import { getAvailableProfessors } from '@/lib/jury-utils';

const requirements = {
  professorCount: 3,
  associateProfessorCount: 2,
  maxConsecutiveParticipations: 3,
  minDaysBetweenParticipations: 30,
  maxDistanceForExternal: 100
};

const availableProfessors = getAvailableProfessors(
  professors,
  '2023-09-15',
  requirements,
  procedures
);
```

### Jury Composition

```typescript
import { createJuryComposition } from '@/lib/jury-utils';

const composition = createJuryComposition(
  professors,
  procedures,
  '2023-09-15',
  requirements,
  'Софийски университет'
);

console.log('Selected professors:', composition.professors);
console.log('External members:', composition.externalMembers);
console.log('Errors:', composition.errors);
```

### React Hook Usage

```typescript
import { useJuryData } from '@/hooks/use-jury-data';

function JuryManagementComponent() {
  const {
    professors,
    procedures,
    loading,
    error,
    loadProfessorsFromFile,
    getAvailableProfessorsForDate,
    createJury
  } = useJuryData();

  const handleFileUpload = async (file: File) => {
    try {
      await loadProfessorsFromFile(file);
    } catch (err) {
      console.error('Failed to load file:', err);
    }
  };

  const availableProfessors = getAvailableProfessorsForDate('2023-09-15');
  const jury = createJury('2023-09-15', 'Софийски университет');

  return (
    <div>
      {/* Your UI components */}
    </div>
  );
}
```

## CSV Format

### Professors CSV
```csv
ID,Title,Names,Science,University,Km,Count,Pre-last date,Last date
1,професор,Иван Петров,4.7,Софийски университет,0,5,2023-01-15,2023-06-20
2,доцент,Мария Георгиева,4.8,Пловдивски университет,120,3,2023-02-10,2023-05-15
```

### Procedures CSV
```csv
ID,Date,Procedure,M1,M2,M3,M4,M5,M6,M7
1,2023-06-20,доктор,1,2,3,4,5,null,null
2,2023-05-15,доцент,2,3,4,5,1,null,null
```

## Key Functions

### Data Parsing
- `parseProfessorsCsv(csvContent)` - Parse professors from CSV
- `parseProceduresCsv(csvContent)` - Parse procedures from CSV

### Professor Management
- `isProfessorAvailable(professor, date, requirements, procedures)` - Check availability
- `calculateConsecutiveParticipations(professor, procedures)` - Calculate consecutive participations
- `getAvailableProfessors(professors, date, requirements, procedures, filter?)` - Get available professors

### Sorting and Filtering
- `sortProfessors(professors, criteria, ascending?)` - Sort professors by criteria
- Professor filter options: date, science rating, university, distance, title

### Jury Composition
- `createJuryComposition(professors, procedures, date, requirements, homeUniversity)` - Create jury
- Automatic separation of internal/external members
- Distance-based sorting for external members
- Validation and error reporting

### Workload Analysis
- `calculateProfessorWorkload(professor, procedures, year?)` - Calculate workload statistics
- `getProfessorParticipationHistory(professor, procedures)` - Get participation history

## Configuration

### Default Requirements
```typescript
const DEFAULT_JURY_REQUIREMENTS = {
  professorCount: 3,
  associateProfessorCount: 2,
  maxConsecutiveParticipations: 3,
  minDaysBetweenParticipations: 30,
  maxDistanceForExternal: 100
};
```

### Custom Requirements
```typescript
const customRequirements: JuryRequirements = {
  professorCount: 4,
  associateProfessorCount: 3,
  maxConsecutiveParticipations: 2,
  minDaysBetweenParticipations: 45,
  maxDistanceForExternal: 200
};
```

## Error Handling

The system provides comprehensive error handling:

- **CSV parsing errors** - Invalid data format, missing columns
- **Validation warnings** - Data outside expected ranges
- **Jury composition errors** - Insufficient available professors
- **Availability warnings** - Distance or consecutive participation issues

## Examples

See `src/examples/jury-system-example.ts` for comprehensive usage examples including:

- Basic data loading
- Professor availability checking
- Jury composition creation
- Professor sorting and filtering
- Workload analysis
- Advanced filtering scenarios

## Type Safety

All interfaces are fully typed with TypeScript, providing:

- Compile-time error checking
- IntelliSense support
- Refactoring safety
- Documentation through types

## Performance Considerations

- Efficient CSV parsing with streaming support
- Optimized sorting algorithms
- Memoized calculations in React hooks
- Lazy loading for large datasets

## Future Enhancements

- Database integration
- Real-time collaboration
- Advanced scheduling algorithms
- Conflict resolution
- Reporting and analytics
- Multi-language support
