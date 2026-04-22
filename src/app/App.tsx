import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { FileText, ListChecks, Building2, TrendingUp } from "lucide-react";
import { Toaster } from "sonner";
import { motion } from "motion/react";
import { StatCard } from "./components/StatCard";
import { CreateJobOrderForm } from "./components/CreateJobOrderForm";
import { JobOrderList } from "./components/JobOrderList";
import { FloatingActionButton } from "./components/FloatingActionButton";

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

const mockJobs: JobOrder[] = [
  {
    id: 1,
    jobNumber: "ENG-0001-04-2026",
    department: "Engineering",
    status: "In Progress",
    projectName: "Phoenix Upgrade",
    moNumber: "MO-2026-150",
    finalProduct: "Control Panel A500",
    purpose: "Upgrade control panel firmware to support new safety protocols and enhanced monitoring capabilities",
    createdAt: "2026-04-15T10:30:00Z",
    updatedAt: "2026-04-15T10:30:00Z"
  },
  {
    id: 2,
    jobNumber: "PRO-0042-04-2026",
    department: "Production",
    status: "Open",
    moNumber: "MO-2026-151",
    finalProduct: "Motor Assembly B200",
    erbCode: "ERB-2026-500",
    purpose: "Manufacture 500 units of motor assembly for client order #2026-Q2-45",
    createdAt: "2026-04-18T14:20:00Z",
    updatedAt: "2026-04-18T14:20:00Z"
  },
  {
    id: 3,
    jobNumber: "QUA-0015-03-2026",
    department: "Quality Assurance",
    status: "Completed",
    projectName: "Q1 Audit Cycle",
    finalProduct: "Inspection Report",
    purpose: "Complete quarterly quality audit of production line A and B with comprehensive testing protocols",
    createdAt: "2026-03-05T09:00:00Z",
    updatedAt: "2026-03-28T16:45:00Z"
  },
  {
    id: 4,
    jobNumber: "RES-0008-04-2026",
    department: "Research & Development",
    status: "In Progress",
    projectName: "NextGen Materials",
    erbCode: "ERB-2026-755",
    purpose: "Research and test new composite materials for heat resistance up to 800°C",
    createdAt: "2026-04-10T11:15:00Z",
    updatedAt: "2026-04-10T11:15:00Z"
  },
  {
    id: 5,
    jobNumber: "MAI-0023-04-2026",
    department: "Maintenance",
    status: "Open",
    moNumber: "MO-2026-148",
    finalProduct: "Equipment Overhaul",
    purpose: "Scheduled maintenance and calibration of CNC machines in production zone 3",
    createdAt: "2026-04-20T08:30:00Z",
    updatedAt: "2026-04-20T08:30:00Z"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState("new");
  const [jobs, setJobs] = useState<JobOrder[]>(mockJobs);

  const stats = useMemo(() => {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const thisMonthJobs = jobs.filter(job => {
      const jobDate = new Date(job.createdAt);
      return jobDate.getMonth() === thisMonth && jobDate.getFullYear() === thisYear;
    });

    const departments = new Set(jobs.map(job => job.department));

    return {
      total: jobs.length,
      thisMonth: thisMonthJobs.length,
      departments: departments.size
    };
  }, [jobs]);

  const handleJobCreated = (newJob: JobOrder) => {
    setJobs(prev => [newJob, ...prev]);
    setActiveTab("all");
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setJobs(prev => prev.map(job =>
      job.id === id
        ? { ...job, status: newStatus, updatedAt: new Date().toISOString() }
        : job
    ));
  };

  const handleDelete = (id: number) => {
    setJobs(prev => prev.filter(job => job.id !== id));
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-200/30 via-purple-200/30 to-pink-200/30 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-200/20 via-indigo-200/20 to-purple-200/20 blur-3xl rounded-full translate-x-1/2 translate-y-1/2" />

      <Toaster position="top-right" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl">Job Order Database</h1>
              <p className="text-muted-foreground mt-1">Auto-numbered by department, month & year</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            title="Total Job Orders"
            value={stats.total}
            icon={FileText}
            trend={12}
            delay={0}
            gradient="from-indigo-500 to-indigo-600"
          />
          <StatCard
            title="This Month"
            value={stats.thisMonth}
            icon={TrendingUp}
            trend={8}
            delay={0.1}
            gradient="from-purple-500 to-purple-600"
          />
          <StatCard
            title="Departments"
            value={stats.departments}
            icon={Building2}
            delay={0.2}
            gradient="from-pink-500 to-pink-600"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="inline-flex h-14 items-center justify-center rounded-2xl bg-white border border-border p-1.5 shadow-lg">
              <TabsTrigger
                value="new"
                className="inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-xl px-8 py-2.5 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md text-muted-foreground hover:text-foreground"
              >
                <FileText className="w-4 h-4" />
                New Job Order
              </TabsTrigger>
              <TabsTrigger
                value="all"
                className="inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-xl px-8 py-2.5 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md text-muted-foreground hover:text-foreground"
              >
                <ListChecks className="w-4 h-4" />
                All Records
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="new">
            <CreateJobOrderForm onJobCreated={handleJobCreated} />
          </TabsContent>

          <TabsContent value="all">
            <JobOrderList
              jobs={jobs}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          </TabsContent>
        </Tabs>

        {activeTab === "all" && (
          <FloatingActionButton onClick={() => setActiveTab("new")} />
        )}
      </div>
    </div>
  );
}
