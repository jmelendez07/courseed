import { motion } from "framer-motion";

interface FadeItemProps {
    children: React.ReactNode;
    className?: string;
}

function FadeItem({ children, className }: FadeItemProps) {
    return (
        <motion.div
            initial={{ y: 48, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeInOut", duration: 0.75 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export default FadeItem;