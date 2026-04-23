import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { Sparkles, Building2, FileText, Package, Hash, Target } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface JobOrderFormData {
  department: string;
  status: string;
  projectName: string;
  moNumber: string;
  finalProduct: string;
  erbCode: string;
  purpose: string;
}

interface CreateJobOrderFormProps {
  onJobCreated: (job: any) => void;
}

const departments = [
  "Engineering",
  "Production",
  "Quality Assurance",
  "Research & Development",
  "Maintenance"
];

const statuses = ["Open", "In Progress", "Completed", "On Hold"];

export function CreateJobOrderForm({ onJobCreated }: CreateJobOrderFormProps) {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<JobOrderFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const department = watch("department");
  const finalProduct = watch("finalProduct");
  const erbCode = watch("erbCode");

  const generateJobNumber = () => {
    if (!department) return "Select department first";

    const now = new Date();
    const deptCode = department.substring(0, 3).toUpperCase();
    const sequence = Math.floor(Math.random() * 9999) + 1;
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    return `${deptCode}-${String(sequence).padStart(4, '0')}-${month}-${year}`;
  };

  const onSubmit = async (data: JobOrderFormData) => {
    if (!data.finalProduct && !data.erbCode) {
      toast.error("Please provide either Final Product or ERB Code");
      return;
    }

    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    const jobNumber = generateJobNumber();
    const newJob = {
      id: Date.now(),
      jobNumber,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onJobCreated(newJob);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    toast.success(`Job Order Created: ${jobNumber}`);
    reset();
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="relative bg-card border border-border rounded-2xl p-8 overflow-hidden"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 20px 40px -15px rgba(0,0,0,0.1)"
      }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h3>Create New Job Order</h3>
        </div>
        <p className="text-muted-foreground text-sm ml-12">Fill in the details to generate a new job order</p>
      </div>

      {department && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="relative bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6 mb-8 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-300/20 to-purple-300/20 blur-2xl rounded-full" />
          <div className="relative z-10">
            <p className="text-sm text-indigo-600 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Preview Job Number
            </p>
            <motion.p
              key={generateJobNumber()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl text-indigo-700 font-mono tracking-tight"
            >
              {generateJobNumber()}
            </motion.p>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm mb-2">
              <Building2 className="w-4 h-4" />
              Department <span className="text-red-500">*</span>
            </label>
            <select
              {...register("department", { required: "Department is required" })}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all hover:border-primary/20"
            >
              <option value="">Select department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && (
              <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm mb-2">
              <Target className="w-4 h-4" />
              Status <span className="text-red-500">*</span>
            </label>
            <select
              {...register("status", { required: "Status is required" })}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all hover:border-primary/20"
            >
              <option value="">Select status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm mb-2">
              <FileText className="w-4 h-4" />
              Project Name
            </label>
            <input
              {...register("projectName")}
              type="text"
              placeholder="e.g., Phoenix Upgrade"
              className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all hover:border-primary/20"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm mb-2">
              <Hash className="w-4 h-4" />
              MO Number
            </label>
            <input
              {...register("moNumber")}
              type="text"
              placeholder="e.g., MO-2026-001"
              className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all hover:border-primary/20"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm mb-2">
              <Package className="w-4 h-4" />
              Final Product
            </label>
            <input
              {...register("finalProduct")}
              type="text"
              placeholder="e.g., Control Panel A500"
              className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all hover:border-primary/20"
            />
            {!finalProduct && !erbCode && (
              <p className="text-muted-foreground text-xs mt-1">
                Either Final Product or ERB Code is required
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm mb-2">
              <Hash className="w-4 h-4" />
              ERB Code
            </label>
            <input
              {...register("erbCode")}
              type="text"
              placeholder="e.g., ERB-2026-500"
              className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all hover:border-primary/20"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm mb-2">
            <FileText className="w-4 h-4" />
            Purpose / Description <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("purpose", { required: "Purpose is required" })}
            rows={4}
            placeholder="Describe the purpose and scope of this job order..."
            className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
          />
          {errors.purpose && (
            <p className="text-red-500 text-sm mt-1">{errors.purpose.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-6">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3.5 rounded-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed group"
            style={{
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.3)"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Create Job Order
                </>
              )}
            </span>
          </motion.button>
          <motion.button
            type="button"
            onClick={() => reset()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3.5 border border-border rounded-xl hover:bg-accent hover:border-primary/20 transition-all"
          >
            Reset
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
