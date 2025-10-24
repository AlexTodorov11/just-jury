"use client";

import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CalendarToolbarProps {
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void;
  onView: (view: 'month' | 'week' | 'day' | 'agenda') => void;
  view: 'month' | 'week' | 'day' | 'agenda';
  date: Date;
  onAddProcedure?: () => void;
  className?: string;
}

export function CalendarToolbar({
  onNavigate,
  onView,
  view,
  date,
  onAddProcedure,
  className
}: CalendarToolbarProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className={cn("flex items-center justify-between p-4 border-b border-border", className)}>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">{formatDate(date)}</h2>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('PREV')}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('TODAY')}
            className="h-8 px-3"
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('NEXT')}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1 bg-muted rounded-md p-1">
          {[
            { id: 'month', label: 'Month' },
            { id: 'week', label: 'Week' },
            { id: 'day', label: 'Day' },
            { id: 'agenda', label: 'Agenda' }
          ].map((viewOption) => (
            <Button
              key={viewOption.id}
              variant={view === viewOption.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onView(viewOption.id as any)}
              className="h-8 px-3"
            >
              {viewOption.label}
            </Button>
          ))}
        </div>

        {onAddProcedure && (
          <Button
            onClick={onAddProcedure}
            className="h-8 px-3"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Procedure
          </Button>
        )}
      </div>
    </div>
  );
}
