"use client";

import { useState, useMemo } from 'react';
import { Calendar, momentLocalizer, Views, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { cn } from '@/lib/utils';
import type { Procedure, Professor, JuryComposition } from '@/types/types';
import { createJuryComposition } from '@/lib/jury-utils';
import { JuryDetailsModal } from './jury-details-modal';

// Set up moment localizer
const localizer = momentLocalizer(moment);

// Procedure type colors and labels
const procedureTypeConfig = {
  'доктор': {
    label: 'PhD Defense',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-100',
    darkColor: 'bg-blue-900',
    textColor: 'text-blue-700 dark:text-blue-300'
  },
  'доцент': {
    label: 'Associate Professor',
    color: 'bg-green-500',
    lightColor: 'bg-green-100',
    darkColor: 'bg-green-900',
    textColor: 'text-green-700 dark:text-green-300'
  },
  'ДН': {
    label: 'Doctor of Science',
    color: 'bg-purple-500',
    lightColor: 'bg-purple-100',
    darkColor: 'bg-purple-900',
    textColor: 'text-purple-700 dark:text-purple-300'
  },
  'професор': {
    label: 'Professor',
    color: 'bg-orange-500',
    lightColor: 'bg-orange-100',
    darkColor: 'bg-orange-900',
    textColor: 'text-orange-700 dark:text-orange-300'
  }
};

interface JuryCalendarProps {
  procedures: Procedure[];
  professors: Professor[];
  homeUniversity: string;
  onProcedureClick?: (procedure: Procedure) => void;
  onDateClick?: (date: Date) => void;
  className?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    procedure: Procedure;
    composition?: JuryComposition;
    status: 'complete' | 'partial' | 'incomplete' | 'error';
    assignedMembers: number;
    requiredMembers: number;
  };
}

export function JuryCalendar({
  procedures,
  professors,
  homeUniversity,
  onProcedureClick,
  onDateClick,
  className
}: JuryCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [view, setView] = useState<View>(Views.MONTH);

  // Calculate jury composition for each procedure
  const events: CalendarEvent[] = useMemo(() => {
    return procedures.map(procedure => {
      const composition = createJuryComposition(
        professors,
        procedures,
        procedure.date,
        {
          professorCount: 3,
          associateProfessorCount: 2,
          maxConsecutiveParticipations: 3,
          minDaysBetweenParticipations: 30,
          maxDistanceForExternal: 100
        },
        homeUniversity
      );

      const assignedMembers = composition.allMembers.length;
      const requiredMembers = composition.professors.length + composition.associateProfessors.length;
      
      let status: 'complete' | 'partial' | 'incomplete' | 'error' = 'incomplete';
      if (composition.errors.length > 0) {
        status = 'error';
      } else if (assignedMembers >= requiredMembers) {
        status = 'complete';
      } else if (assignedMembers > 0) {
        status = 'partial';
      }

      const config = procedureTypeConfig[procedure.procedure];
      const title = `${config.label} (${assignedMembers}/${requiredMembers})`;

      return {
        id: procedure.id.toString(),
        title,
        start: new Date(procedure.date),
        end: new Date(procedure.date),
        resource: {
          procedure,
          composition,
          status,
          assignedMembers,
          requiredMembers
        }
      };
    });
  }, [procedures, professors, homeUniversity]);

  // Event style getter
  const eventStyleGetter = (event: CalendarEvent) => {
    const config = procedureTypeConfig[event.resource.procedure.procedure];
    const { status } = event.resource;

    let backgroundColor = config.color;
    let borderColor = config.color;

    if (status === 'complete') {
      backgroundColor = 'bg-green-500';
      borderColor = 'border-green-500';
    } else if (status === 'partial') {
      backgroundColor = 'bg-yellow-500';
      borderColor = 'border-yellow-500';
    } else if (status === 'error') {
      backgroundColor = 'bg-red-500';
      borderColor = 'border-red-500';
    }

    return {
      style: {
        backgroundColor: backgroundColor.replace('bg-', ''),
        borderColor: borderColor.replace('border-', ''),
        color: 'white',
        borderRadius: '4px',
        border: 'none',
        fontSize: '12px',
        padding: '2px 4px'
      }
    };
  };

  // Handle event click
  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    onProcedureClick?.(event.resource.procedure);
  };

  // Handle date click
  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
    onDateClick?.(start);
  };

  // Custom event component
  const EventComponent = ({ event }: { event: CalendarEvent }) => {
    const config = procedureTypeConfig[event.resource.procedure.procedure];
    const { status, assignedMembers, requiredMembers } = event.resource;

    return (
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium truncate">
            {config.label}
          </span>
          <span className="text-xs">
            {assignedMembers}/{requiredMembers}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <div className={cn(
            "w-2 h-2 rounded-full",
            status === 'complete' && "bg-green-400",
            status === 'partial' && "bg-yellow-400",
            status === 'incomplete' && "bg-gray-400",
            status === 'error' && "bg-red-400"
          )} />
          <span className="text-xs capitalize">{status}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("h-[600px] w-full", className)}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={view}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        onView={setView}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        popup
        eventPropGetter={eventStyleGetter}
        components={{
          event: EventComponent
        }}
        className="bg-card text-card-foreground border border-border rounded-lg"
        style={{
          height: '100%'
        }}
        messages={{
          next: 'Next',
          previous: 'Previous',
          today: 'Today',
          month: 'Month',
          week: 'Week',
          day: 'Day',
          agenda: 'Agenda',
          date: 'Date',
          time: 'Time',
          event: 'Event',
          noEventsInRange: 'No procedures in this range',
          showMore: (total: number) => `+${total} more`
        }}
      />
      
      {selectedEvent && (
        <JuryDetailsModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
