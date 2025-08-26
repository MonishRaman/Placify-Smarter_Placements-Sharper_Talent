import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.08, duration: 0.6, ease: "easeOut" },
  }),
};

const CardGrid = ({ items, type }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {items.map((item, i) => (
        <motion.div
          key={item.title || item.q}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          custom={i}
          whileHover={{ scale: 1.03, y: -6 }}
          className="rounded-2xl border border-gray-200 dark:border-gray-700 
                     bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
                     p-6 shadow-md hover:shadow-xl transition-all duration-300"
        >
          {type === "feature" && (
            <>
              <div className="text-3xl text-blue-600 dark:text-blue-400">{item.icon}</div>
              <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{item.body}</p>
              <ul className="mt-3 text-sm text-gray-700 dark:text-gray-200 list-disc list-inside space-y-1">
                {item.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </>
          )}

          {type === "benefit" && (
            <>
              <div className="text-3xl text-indigo-600 dark:text-indigo-400">{item.icon}</div>
              <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <ul className="mt-3 text-sm text-gray-700 dark:text-gray-200 space-y-2">
                {item.points.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-2 before:content-['✓'] before:text-green-500"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </>
          )}

          {type === "process" && (
            <>
              <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {item.step}
              </div>
              <div className="mt-2 text-base font-semibold text-gray-900 dark:text-white">
                {item.title}
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">{item.text}</div>
            </>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default CardGrid;
