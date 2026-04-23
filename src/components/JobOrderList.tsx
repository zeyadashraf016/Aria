import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { JobOrderCard } from "./JobOrderCard";
import { toast } from "sonner";

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

interface JobOrderListProps {
  jobs: JobOrder[];
  onStatusChange: (id: number, newStatus: string) => void;
  onDelete: (id: number) => void;
}

export function JobOrderList({ jobs, onStatusChange, onDelete }: JobOrderListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");

  const departments = useMemo(() => {
    return ["All", ...new Set(jobs.map(job => job.department))];
  }, [jobs]);

  const statuses = ["All", "Open", "In Progress", "Completed", "On Hold"];

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch =
        job.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.moNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.finalProduct?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.erbCode?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "All" || job.status === statusFilter;
      const matchesDepartment = departmentFilter === "All" || job.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [jobs, searchQuery, statusFilter, departmentFilter]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="bg-card border border-border rounded-xl p-5"
        style={{
          boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 10px 25px -10px rgba(0,0,0,0.1)"
        }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by job number, product, project, ERB, MO..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all hover:border-primary/20"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative group">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all appearance-none cursor-pointer hover:border-primary/20 min-w-[140px]"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="relative group">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors" />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="pl-10 pr-8 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all appearance-none cursor-pointer hover:border-primary/20 min-w-[140px]"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {(searchQuery || statusFilter !== "All" || departmentFilter !== "All") && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg"
          >
            <p className="text-sm text-indigo-700">
              <span className="font-medium">{filteredJobs.length}</span> {filteredJobs.length === 1 ? 'result' : 'results'} found
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("All");
                setDepartmentFilter("All");
              }}
              className="text-sm text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>

      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-card border border-border rounded-2xl p-16 text-center overflow-hidden"
            style={{
              boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 10px 25px -10px rgba(0,0,0,0.1)"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50" />
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-xl mb-2">No job orders found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchQuery || statusFilter !== "All" || departmentFilter !== "All"
                  ? "Try adjusting your filters or search terms to find what you're looking for"
                  : "Create your first job order to get started with tracking production workflows"
                }
              </p>
            </div>
          </motion.div>
        ) : (
          filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <JobOrderCard
                job={job}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
              />
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
