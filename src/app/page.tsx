import React from 'react';
import MainLayout from '@/components/Structure/MainLayout';
import DashboardContent from '@/components/Dashboard/DashboardContent/DashboardContent';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <MainLayout>
      <div className={styles.dashboardContainer}>
        <DashboardContent />
      </div>
    </MainLayout>
  );
}