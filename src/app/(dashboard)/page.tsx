"use client";

import { useState, useMemo } from 'react';
import Container from "@/components/container";
import { JuryCalendar, CalendarToolbar } from "@/components/calendar";
import { sampleProfessors, sampleProcedures } from "@/data/sample-jury-data";
import { createJuryComposition } from "@/lib/jury-utils";
import type { Professor, Procedure } from '@/types/types';

export default function Home() {
  const [professors] = useState<Professor[]>(sampleProfessors);
  const [procedures] = useState<Procedure[]>(sampleProcedures);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const homeUniversity = 'Софийски университет';

  // Calculate stats using useMemo for performance
  const stats = useMemo(() => {
    const completeJuries = procedures.filter(p => {
      const composition = createJuryComposition(
        professors,
        procedures,
        p.date,
        {
          professorCount: 3,
          associateProfessorCount: 2,
          maxConsecutiveParticipations: 3,
          minDaysBetweenParticipations: 30,
          maxDistanceForExternal: 100
        },
        homeUniversity
      );
      return composition.allMembers.length >= 5;
    }).length;

    const partialJuries = procedures.filter(p => {
      const composition = createJuryComposition(
        professors,
        procedures,
        p.date,
        {
          professorCount: 3,
          associateProfessorCount: 2,
          maxConsecutiveParticipations: 3,
          minDaysBetweenParticipations: 30,
          maxDistanceForExternal: 100
        },
        homeUniversity
      );
      return composition.allMembers.length > 0 && composition.allMembers.length < 5;
    }).length;

    return { completeJuries, partialJuries };
  }, [procedures, professors, homeUniversity]);

  const handleNavigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
    if (action === 'PREV') {
      setCurrentDate(prev => {
        const newDate = new Date(prev);
        if (currentView === 'month') {
          newDate.setMonth(newDate.getMonth() - 1);
        } else if (currentView === 'week') {
          newDate.setDate(newDate.getDate() - 7);
        } else if (currentView === 'day') {
          newDate.setDate(newDate.getDate() - 1);
        }
        return newDate;
      });
    } else if (action === 'NEXT') {
      setCurrentDate(prev => {
        const newDate = new Date(prev);
        if (currentView === 'month') {
          newDate.setMonth(newDate.getMonth() + 1);
        } else if (currentView === 'week') {
          newDate.setDate(newDate.getDate() + 7);
        } else if (currentView === 'day') {
          newDate.setDate(newDate.getDate() + 1);
        }
        return newDate;
      });
    } else if (action === 'TODAY') {
      setCurrentDate(new Date());
    }
  };

  const handleViewChange = (view: 'month' | 'week' | 'day' | 'agenda') => {
    setCurrentView(view);
  };

  const handleProcedureClick = (procedure: Procedure) => {
    console.log('Procedure clicked:', procedure);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    console.log('Date clicked:', date);
  };

  const handleAddProcedure = () => {
    console.log('Add procedure clicked');
    // TODO: Implement add procedure functionality
  };

  return (
    <div className="space-y-6">
      {/* Calendar Toolbar */}
      <Container>
        <CalendarToolbar
          onNavigate={handleNavigate}
          onView={handleViewChange}
          view={currentView}
          date={currentDate}
          onAddProcedure={handleAddProcedure}
        />
      </Container>

      {/* Calendar */}
      <Container>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <JuryCalendar
            procedures={procedures}
            professors={professors}
            homeUniversity={homeUniversity}
            onProcedureClick={handleProcedureClick}
            onDateClick={handleDateClick}
            className="h-[700px]"
          />
        </div>
      </Container>

      {/* Quick Stats */}
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">{procedures.length}</div>
            <div className="text-sm text-muted-foreground">Total Procedures</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {stats.completeJuries}
            </div>
            <div className="text-sm text-muted-foreground">Complete Juries</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.partialJuries}
            </div>
            <div className="text-sm text-muted-foreground">Partial Juries</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{professors.length}</div>
            <div className="text-sm text-muted-foreground">Available Professors</div>
          </div>
        </div>
      </Container>
    </div>
  );
}
