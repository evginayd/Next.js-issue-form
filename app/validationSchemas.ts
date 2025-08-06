import { z } from "zod";

export const createIssueSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  assignedToId: z.string().optional(),
  dueDate: z.string().nullable().optional(),
  category: z.string().optional(),
  labels: z.array(z.string()).optional(),
  createdById: z.string().min(1, "CreatedById is required"),
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]).optional(),
});

export type CreateIssue = z.infer<typeof createIssueSchema>;
