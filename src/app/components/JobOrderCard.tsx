import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Clock, Building2, FileText, Package, Hash, Calendar, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";

interface JobOrder {
  id: number;
  jobNumber: string;
  department: string;
  status: string;
  projectName?: string;
  moNumber?: string;
  finalProduct?: string;
  erbCode?: string;
  purpose: string;
  createdAt: string;
  updatedAt: string;
}

interface JobOrderCardProps {
  job: JobOrder;
  onStatusChange: (id: number, newStatus: string) => void;
  onDelete: (id: number) => void;
}

const statusColors: Record<string, string> = {
  "Open": "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border-gray-200",
  "In Progress": "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border-amber-200",
  "Completed": "bg-gradient-to-r from-green-100 to-green-50 text-green-700 border-green-200",
  "On Hold": "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-200"
};

export function JobOrderCard({ job, onStatusChange, onDelete }: JobOrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="relative bg-card border border-border rounded-xl overflow-hidden group"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 10px 25px -10px rgba(0,0,0,0.1)"
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div
        className="relative z-10 p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 px-3 py-1.5 rounded-lg">
                <h4 className="font-mono text-indigo-700 text-sm">{job.jobNumber}</h4>
              </div>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={`px-3.5 py-1.5 rounded-full text-xs border ${statusColors[job.status] || statusColors.Open}`}
              >
                {job.status}
              </motion.span>
            </div>
            <p className="text-muted-foreground line-clamp-2">{job.purpose}</p>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, type: "spring" }}
            whileHover={{ scale: 1.1 }}
            className="flex-shrink-0 w-9 h-9 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors"
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </motion.div>
        </div>

        <div className="flex flex-wrap gap-2">
          <motion.span
            whileHover={{ scale: 1.05, y: -2 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg text-xs text-indigo-700"
          >
            <Building2 className="w-3.5 h-3.5" />
            {job.department}
          </motion.span>
          {job.projectName && (
            <motion.span
              whileHover={{ scale: 1.05, y: -2 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted border border-border rounded-lg text-xs hover:bg-accent transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              {job.projectName}
            </motion.span>
          )}
          {job.moNumber && (
            <motion.span
              whileHover={{ scale: 1.05, y: -2 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted border border-border rounded-lg text-xs hover:bg-accent transition-colors"
            >
              <Hash className="w-3.5 h-3.5" />
              {job.moNumber}
            </motion.span>
          )}
          {job.finalProduct && (
            <motion.span
              whileHover={{ scale: 1.05, y: -2 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted border border-border rounded-lg text-xs hover:bg-accent transition-colors"
            >
              <Package className="w-3.5 h-3.5" />
              {job.finalProduct}
            </motion.span>
          )}
          {job.erbCode && (
            <motion.span
              whileHover={{ scale: 1.05, y: -2 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted border border-border rounded-lg text-xs hover:bg-accent transition-colors"
            >
              <Hash className="w-3.5 h-3.5" />
              {job.erbCode}
            </motion.span>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border"
          >
            <div className="p-5 bg-muted/30 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Department</p>
                  <p className="text-sm">{job.department}</p>
                </div>
                {job.projectName && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Project Name</p>
                    <p className="text-sm">{job.projectName}</p>
                  </div>
                )}
                {job.moNumber && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">MO Number</p>
                    <p className="text-sm">{job.moNumber}</p>
                  </div>
                )}
                {job.finalProduct && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Final Product</p>
                    <p className="text-sm">{job.finalProduct}</p>
                  </div>
                )}
                {job.erbCode && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">ERB Code</p>
                    <p className="text-sm">{job.erbCode}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Created At</p>
                  <p className="text-sm flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(job.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Purpose</p>
                <p className="text-sm">{job.purpose}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <select
                  value={job.status}
                  onChange={(e) => {
                    e.stopPropagation();
                    onStatusChange(job.id, e.target.value);
                  }}
                  className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all hover:border-primary/20"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(job.id);
                  }}
                  className="px-4 py-2.5 border-2 border-red-200 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
