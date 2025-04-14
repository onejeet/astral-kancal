import { motion } from 'framer-motion';

interface ButtonProps {
  title: string;
  onClick: () => void;
  containerClassName?: string;
  startIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ title, onClick, containerClassName = '', startIcon }) => {
  return (
    <motion.div
      className={`flex justify-end ${containerClassName}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <motion.button
        type="button"
        onClick={onClick}
        className="rounded-xl bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 cursor-pointer flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {startIcon}
        {title}
      </motion.button>
    </motion.div>
  );
};

export default Button;
