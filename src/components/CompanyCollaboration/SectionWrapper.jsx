import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: "easeOut" },
  }),
};

const SectionWrapper = ({ id, title, icon, children }) => {
  return (
    <section id={id} className="mx-auto max-w-7xl px-4 py-10">
      <div className="rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
          {icon && <span className="text-blue-600">{icon}</span>}
          {title}
        </h2>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-5"
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export default SectionWrapper;
