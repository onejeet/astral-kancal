import { motion } from 'framer-motion';
import { ButtonProps } from './Button.types';

const Button: React.FC<ButtonProps> = ({
  title,
  onClick,
  containerProps = {},
  buttonProps = {},
}) => {
  const { className: containerClassName = '', ...restContainerProps } = containerProps;
  const { className: buttonClassName = '', ...restButtonProps } = buttonProps;
  return (
    <motion.div
      className={`flex justify-end ${containerClassName}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      {...restContainerProps}
    >
      <motion.button
        type="button"
        onClick={onClick}
        className={`rounded-xl bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700 cursor-pointer ${buttonClassName}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...restButtonProps}
      >
        {title}
      </motion.button>
    </motion.div>
  );
};

export default Button;
