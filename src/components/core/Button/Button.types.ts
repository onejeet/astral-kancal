import { MotionConfigProps } from 'framer-motion';

export interface ButtonProps {
  title: string;
  onClick: () => void;
  containerProps?: MotionConfigProps & { className?: string };
  buttonProps?: MotionConfigProps & { className?: string };
}
