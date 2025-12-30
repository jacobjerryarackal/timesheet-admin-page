import React from 'react';
import MainLayout from '@/components/Structure/MainLayout';
import LeaveManagementContent from '@/components/Leave/LeaveManagementContent/LeaveManagementContent';

export default function LeavePage() {
  return (
    <MainLayout>
      <LeaveManagementContent />
    </MainLayout>
  );
}