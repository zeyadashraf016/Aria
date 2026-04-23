import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: number;
  delay?: number;
  gradient: string;
}

export function StatCard({ title, value, icon: Icon, trend, delay = 0, gradient }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative bg-card border border-border rounded-xl p-6 overflow-hidden group cursor-pointer"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 10px 25px -10px rgba(0,0,0,0.1)"
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground text-sm mb-3">{title}</p>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: delay + 0.2, type: "spring" }}
          >
            <h3 className="text-4xl mb-3">{value}</h3>
          </motion.div>
          {trend !== undefined && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.4 }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${
                trend >= 0
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              <span className="text-base">{trend >= 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(trend)}%</span>
            </motion.div>
          )}
        </div>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: delay + 0.3, type: "spring" }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`bg-gradient-to-br ${gradient} p-3.5 rounded-xl shadow-lg`}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}
