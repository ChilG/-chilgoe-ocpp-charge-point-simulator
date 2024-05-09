import React from 'react';
import { Skeleton, SkeletonProps } from '@mui/material';

interface AppSkeletonProps extends SkeletonProps {
  loading?: boolean;
  children: React.ReactNode;
}

const AppSkeleton: React.FC<AppSkeletonProps> = (props) => {
  if (props.loading) return <Skeleton {...props} />;
  return props.children;
};

export default AppSkeleton;
