import React from 'react';
import MainLayout from '@/components/Structure/MainLayout';
import UserDetail from '@/components/Users/UserDetail/UserDetail';

interface UserPageProps {
  params: {
    id: string;
  };
}

export default function UserDetailPage({ params }: UserPageProps) {
  return (
    <MainLayout>
      <UserDetail userId={params.id} />
    </MainLayout>
  );
}