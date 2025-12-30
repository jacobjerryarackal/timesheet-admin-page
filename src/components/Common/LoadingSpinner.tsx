'use client';

import React from 'react';
import { Spin, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './Common.module.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
  fullPage?: boolean;
  type?: 'spinner' | 'dots';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  tip = 'Loading...',
  fullPage = false,
  type = 'spinner'
}) => {
  const spinnerIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  
  const renderSpinner = () => (
    <div className={styles.spinnerContainer}>
      <Spin 
        indicator={type === 'dots' ? undefined : spinnerIcon}
        size={size}
        tip={tip}
      >
        {type === 'dots' && <div className={styles.dummyContent} />}
      </Spin>
    </div>
  );

  if (fullPage) {
    return (
      <div className={styles.fullPageOverlay}>
        {renderSpinner()}
      </div>
    );
  }

  return renderSpinner();
};

export default LoadingSpinner;