import React from 'react';
import MainLayout from '@/components/Structure/MainLayout';
import UserManagementContent from '@/components/Users/UserManagementContent';

export default function UsersPage() {
  return (
    <MainLayout>
      <UserManagementContent />
    </MainLayout>
  );
}