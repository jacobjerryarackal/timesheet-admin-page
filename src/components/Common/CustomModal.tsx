'use client';

import React from 'react';
import { Modal, ModalProps } from 'antd';
import styles from './Common.module.css';

interface CustomModalProps extends ModalProps {
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
}

const CustomModal: React.FC<CustomModalProps> = ({ 
  children, 
  size = 'medium',
  className = '',
  ...props 
}) => {
  const sizeMap = {
    small: 400,
    medium: 600,
    large: 800,
    xlarge: 1000,
  };

  const modalWidth = sizeMap[size];

  return (
    <Modal
      width={modalWidth}
      className={`${styles.customModal} ${className}`}
      centered
      {...props}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;