"use client";

import { useState } from 'react';
import { X, Users, MapPin, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from './jury-calendar';

interface JuryDetailsModalProps {
  event: CalendarEvent;
  isOpen: boolean;
  onClose: () => void;
}

const procedureTypeConfig = {
  'доктор': {
    label: 'PhD Defense',
    color: 'bg-blue-500',
    textColor: 'text-blue-700 dark:text-blue-300'
  },
  'доцент': {
    label: 'Associate Professor',
    color: 'bg-green-500',
    textColor: 'text-green-700 dark:text-green-300'
  },
  'ДН': {
    label: 'Doctor of Science',
    color: 'bg-purple-500',
    textColor: 'text-purple-700 dark:text-purple-300'
  },
  'професор': {
    label: 'Professor',
    color: 'bg-orange-500',
    textColor: 'text-orange-700 dark:text-orange-300'
  }
};

export function JuryDetailsModal({ event, isOpen, onClose }: JuryDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'requirements'>('overview');

  if (!isOpen) return null;

  const { procedure, composition, status, assignedMembers, requiredMembers } = event.resource;
  const config = procedureTypeConfig[procedure.procedure];

  const getStatusIcon = () => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'partial':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'complete':
        return 'Complete';
      case 'partial':
        return 'Partially Assigned';
      case 'error':
        return 'Error';
      default:
        return 'Not Assigned';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className={cn("w-3 h-3 rounded-full", config.color)} />
            <h2 className="text-xl font-semibold">{config.label}</h2>
            <span className="text-sm text-muted-foreground">
              {new Date(procedure.date).toLocaleDateString()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-4 bg-muted/50 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className="font-medium">{getStatusText()}</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Members: {assignedMembers}/{requiredMembers}</span>
              <span>ID: {procedure.id}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'members', label: 'Members' },
            { id: 'requirements', label: 'Requirements' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Procedure Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Date: {new Date(procedure.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Type: {config.label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Status: {getStatusText()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Jury Composition</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Professors:</span>
                      <span className="text-sm font-medium">
                        {composition.professors.length}/3
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Associate Professors:</span>
                      <span className="text-sm font-medium">
                        {composition.associateProfessors.length}/2
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">External Members:</span>
                      <span className="text-sm font-medium">
                        {composition.externalMembers.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Internal Members:</span>
                      <span className="text-sm font-medium">
                        {composition.internalMembers.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {composition.errors.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-red-600">Errors</h3>
                  <div className="space-y-1">
                    {composition.errors.map((error, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {composition.warnings.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-yellow-600">Warnings</h3>
                  <div className="space-y-1">
                    {composition.warnings.map((warning, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm text-yellow-600">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{warning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Professors</h3>
                {composition.professors.length > 0 ? (
                  <div className="space-y-2">
                    {composition.professors.map((professor, index) => (
                      <div key={professor.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium">{professor.names}</div>
                          <div className="text-sm text-muted-foreground">{professor.university}</div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {professor.km}km
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No professors assigned</div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Associate Professors</h3>
                {composition.associateProfessors.length > 0 ? (
                  <div className="space-y-2">
                    {composition.associateProfessors.map((professor, index) => (
                      <div key={professor.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium">{professor.names}</div>
                          <div className="text-sm text-muted-foreground">{professor.university}</div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {professor.km}km
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No associate professors assigned</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Jury Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Required Professors:</span>
                      <span className="text-sm font-medium">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Required Associate Professors:</span>
                      <span className="text-sm font-medium">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Max Consecutive Participations:</span>
                      <span className="text-sm font-medium">3</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Min Days Between Participations:</span>
                      <span className="text-sm font-medium">30</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Max Distance for External:</span>
                      <span className="text-sm font-medium">100km</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Member Assignment Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Professors</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(composition.professors.length / 3) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {composition.professors.length}/3
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Associate Professors</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(composition.associateProfessors.length / 2) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {composition.associateProfessors.length}/2
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              // TODO: Implement edit functionality
              console.log('Edit jury composition');
            }}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Edit Composition
          </button>
        </div>
      </div>
    </div>
  );
}
