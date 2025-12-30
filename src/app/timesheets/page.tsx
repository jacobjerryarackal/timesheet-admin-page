import React from 'react';
import MainLayout from '@/components/Structure/MainLayout';
import TimesheetManagementContent from '@/components/Timesheets/TimesheetManagementContent/TimesheetManagementContent';

export default function TimesheetsPage() {
  return (
    <MainLayout>
      <TimesheetManagementContent />
    </MainLayout>
  );
}