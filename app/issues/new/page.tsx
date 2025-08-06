"use client";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateIssue, createIssueSchema } from "@/app/validationSchemas";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Spinner from "@/components/ui/spinner";
import { Toaster } from "@/components/ui/sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/ui/tag-input";
import { useSession } from "next-auth/react";
// import "react-tagsinput/react-tagsinput.css";
type IssueForm = z.infer<typeof createIssueSchema>;

const NewIssuePage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      status: "OPEN",
      assignedToId: undefined,
      dueDate: undefined,
      category: "",
      labels: [],
      createdById: session?.user?.id || "", // Oturum açmış kullanıcının ID'si
    },
  });
  // const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<{ id: string; username: string }[]>([]);

  // createdById'yi manuel olarak ayarla
  useEffect(() => {
    if (session?.user?.id) {
      console.log("Setting createdById:", session.user.id); // Debug
      setValue("createdById", session.user.id);
    } else {
      console.log("No session or user ID found"); // Debug
    }
  }, [session, setValue]);

  // Kullanıcıları çek (assignedToId için)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/user"); // Kullanıcıları getiren bir API endpoint'i varsayalım
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  const onSubmit: SubmitHandler<IssueForm> = async (data) => {
    try {
      setSubmitting(true);
      setError(null);
      console.log("Submitting data:", data);

      if (!data.createdById) {
        throw new Error("User not authenticated. Please sign in.");
      }

      const response = await axios.post("/api/issues", {
        ...data,
        dueDate: data.dueDate || null, // Ensure dueDate is null if empty
        category: data.category || null, // Ensure category is null if empty
        labels: data.labels || [], // Ensure labels is an array
      });
      console.log("API response:", response.data);
      router.push("/issues");
    } catch (error) {
      setSubmitting(false);
      console.error("Submission error:", error);
      setError(
        axios.isAxiosError(error)
          ? error.response?.data?.error || "Failed to create issue"
          : "An unexpected error occurred"
      );
    }
  };

  // const onSubmit = async (data: unknown) => {
  //   try {
  //     const response = await fetch("/api/issues", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(data),
  //     });
  //     if (!response.ok) {
  //       setError("An unexpected error occurred");
  //       return;
  //     }
  //     router.push("/issues/new");
  //   } catch (error) {
  //     setError("An unexpected error occurred: " + error);
  //   }
  // };

  // const onSubmit = async (data: CreateIssue) => {
  //   console.log("onSubmit triggered, Form data:", {
  //     title: data.title,
  //     description: data.description,
  //     priority: data.priority,
  //     status: data.status,
  //     assignedToId: data.assignedToId,
  //     dueDate: data.dueDate,
  //     category: data.category,
  //     labels: data.labels,
  //     createdById: data.createdById,
  //   });

  //   if (!data.createdById) {
  //     setError("User not authenticated. Please sign in.");
  //     return;
  //   }

  //   const cleanData: CreateIssue = {
  //     title: String(data.title),
  //     description: String(data.description),
  //     priority: data.priority || undefined,
  //     status: data.status || undefined,
  //     assignedToId: data.assignedToId || undefined,
  //     dueDate: data.dueDate || undefined,
  //     category: data.category || undefined,
  //     labels: Array.isArray(data.labels) ? data.labels.map(String) : [],
  //     createdById: String(data.createdById),
  //   };

  //   console.log("Cleaned data to send:", cleanData);

  //   try {
  //     const response = await fetch("/api/issues", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(cleanData),
  //     });

  //     console.log("API response status:", response.status, "OK:", response.ok);

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       console.log("API error:", errorData);
  //       const errorMessage = errorData.details;
  //       setError(errorMessage);
  //       return;
  //     }

  //     const responseData = await response.json();
  //     console.log("API response data:", responseData);
  //     console.log("Redirecting to /issues");
  //     router.push("/issues");
  //   } catch (error) {
  //     console.error("Submit error:", error);
  //     setError("An unexpected error occurred: " + error);
  //   }
  // };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Issue</h1>
      {error && (
        <Alert variant="destructive" className="mb-5">
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {" "}
        {/* Title */}
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="Issue Title" {...register("title")} />
          {errors.title && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>{errors.title.message}</AlertDescription>
            </Alert>
          )}
        </div>
        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                id="description"
                placeholder="Describe the issue"
                {...field}
              />
            )}
          />
          {errors.description && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>{errors.description.message}</AlertDescription>
            </Alert>
          )}
        </div>
        {/* Priority */}
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.priority && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>{errors.priority.message}</AlertDescription>
            </Alert>
          )}
        </div>
        {/* Assigned To
            UPDATE!: We can assign multiple person to one issue/task
        */}
        <div>
          <Label htmlFor="assignedToId">Assigned To</Label>
          <Controller
            name="assignedToId"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="assignedToId">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.assignedToId && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>{errors.assignedToId.message}</AlertDescription>
            </Alert>
          )}
        </div>
        {/* Due Date */}
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input id="dueDate" type="date" {...register("dueDate")} />
          {errors.dueDate && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>{errors.dueDate.message}</AlertDescription>
            </Alert>
          )}
        </div>
        {/* Category */}
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            placeholder="e.g., Bug, Feature"
            {...register("category")}
          />
          {errors.category && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>{errors.category.message}</AlertDescription>
            </Alert>
          )}
        </div>
        {/* Status */}
        <div>
          <Label htmlFor="status">Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>{errors.status.message}</AlertDescription>
            </Alert>
          )}
        </div>
        {/* Labels */}
        <div>
          <Label htmlFor="labels">Labels</Label>
          <Controller
            name="labels"
            control={control}
            render={({ field }) => (
              <TagInput
                value={field.value || []}
                onChange={(tags) => {
                  console.log("TagInput onChange:", tags); // Debug
                  field.onChange(tags);
                }}
                placeholder="Enter labels"
              />
            )}
          />
          {errors.labels && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>{errors.labels.message}</AlertDescription>
            </Alert>
          )}
        </div>
        {/* Created By (Hidden) */}
        <input type="hidden" {...register("createdById")} />
        {/* Submit Button */}
        <Button disabled={isSubmitting} type="submit" className="w-full">
          Submit New Issue {isSubmitting && <Spinner />}
        </Button>
      </form>
      <Toaster />
    </div>
  );
};

export default NewIssuePage;

// "use client";

// "use client";
// import React, { useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { useForm, Controller } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import axios from "axios";
// import "easymde/dist/easymde.min.css";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { createIssueSchema, CreateIssue } from "@/app/validationSchemas";
// import { z } from "zod";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import Spinner from "@/components/ui/spinner";
// import { Toaster } from "@/components/ui/sonner";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { TagInput } from "@/components/ui/tag-input";
// import { useSession } from "next-auth/react";
// // import "react-tagsinput/react-tagsinput.css";

// type IssueForm = z.infer<typeof createIssueSchema>;

// export default function NewIssuePage({
//   users,
// }: {
//   users: { id: string; username: string }[];
// }) {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [error, setError] = useState<string | null>(null);
//   const {
//     register,
//     control,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     setValue,
//   } = useForm<IssueForm>({
//     resolver: zodResolver(createIssueSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       priority: "MEDIUM",
//       status: "OPEN",
//       assignedToId: undefined,
//       dueDate: undefined,
//       category: "",
//       labels: [],
//       createdById: session?.user?.id || "",
//     },
//   });

//   useEffect(() => {
//     if (session?.user?.id) {
//       setValue("createdById", session.user.id);
//     }
//   }, [session, setValue]);

//   const onSubmit = async (data: CreateIssue) => {
//     console.log("Form data:", data); // Veriyi kontrol et
//     try {
//       const response = await fetch("/api/issues", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       if (!response.ok) {
//         setError(error || "Failed to create issue");
//         return;
//       }
//       router.push("/issues");
//     } catch (error) {
//       setError("An unexpected error occurred: " + error);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Create New Issue</h1>
//       {error && (
//         <Alert variant="destructive" className="mb-5">
//           <AlertTitle>Error!</AlertTitle>
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}
//       <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
//         <div>
//           <Label htmlFor="title">Title</Label>
//           <Input id="title" placeholder="Issue Title" {...register("title")} />
//           {errors.title && (
//             <Alert variant="destructive" className="mt-2">
//               <AlertDescription>{errors.title.message}</AlertDescription>
//             </Alert>
//           )}
//         </div>
//         <div>
//           <Label htmlFor="description">Description</Label>
//           <Controller
//             name="description"
//             control={control}
//             render={({ field }) => (
//               <Textarea
//                 id="description"
//                 placeholder="Describe the issue"
//                 {...field}
//               />
//             )}
//           />
//           {errors.description && (
//             <Alert variant="destructive" className="mt-2">
//               <AlertDescription>{errors.description.message}</AlertDescription>
//             </Alert>
//           )}
//         </div>
//         <div>
//           <Label htmlFor="priority">Priority</Label>
//           <Controller
//             name="priority"
//             control={control}
//             render={({ field }) => (
//               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                 <SelectTrigger id="priority">
//                   <SelectValue placeholder="Select priority" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="LOW">Low</SelectItem>
//                   <SelectItem value="MEDIUM">Medium</SelectItem>
//                   <SelectItem value="HIGH">High</SelectItem>
//                 </SelectContent>
//               </Select>
//             )}
//           />
//           {errors.priority && (
//             <Alert variant="destructive" className="mt-2">
//               <AlertDescription>{errors.priority.message}</AlertDescription>
//             </Alert>
//           )}
//         </div>
//         <div>
//           <Label htmlFor="status">Status</Label>
//           <Controller
//             name="status"
//             control={control}
//             render={({ field }) => (
//               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                 <SelectTrigger id="status">
//                   <SelectValue placeholder="Select status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="OPEN">Open</SelectItem>
//                   <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
//                   <SelectItem value="CLOSED">Closed</SelectItem>
//                 </SelectContent>
//               </Select>
//             )}
//           />
//           {errors.status && (
//             <Alert variant="destructive" className="mt-2">
//               <AlertDescription>{errors.status.message}</AlertDescription>
//             </Alert>
//           )}
//         </div>
//         <div>
//           <Label htmlFor="assignedToId">Assigned To</Label>
//           <Controller
//             name="assignedToId"
//             control={control}
//             render={({ field }) => (
//               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                 <SelectTrigger id="assignedToId">
//                   <SelectValue placeholder="Select assignee" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {users.map((user) => (
//                     <SelectItem key={user.id} value={user.id}>
//                       {user.username}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             )}
//           />
//           {errors.assignedToId && (
//             <Alert variant="destructive" className="mt-2">
//               <AlertDescription>{errors.assignedToId.message}</AlertDescription>
//             </Alert>
//           )}
//         </div>
//         <div>
//           <Label htmlFor="dueDate">Due Date</Label>
//           <Input id="dueDate" type="date" {...register("dueDate")} />
//           {errors.dueDate && (
//             <Alert variant="destructive" className="mt-2">
//               <AlertDescription>{errors.dueDate.message}</AlertDescription>
//             </Alert>
//           )}
//         </div>
//         <div>
//           <Label htmlFor="category">Category</Label>
//           <Input
//             id="category"
//             placeholder="e.g., Bug, Feature"
//             {...register("category")}
//           />
//           {errors.category && (
//             <Alert variant="destructive" className="mt-2">
//               <AlertDescription>{errors.category.message}</AlertDescription>
//             </Alert>
//           )}
//         </div>
//         <div>
//           <Label htmlFor="labels">Labels</Label>
//           <Controller
//             name="labels"
//             control={control}
//             render={({ field }) => (
//               <TagInput
//                 value={field.value || []}
//                 onChange={(tags) => field.onChange(tags)}
//               />
//             )}
//           />
//           {errors.labels && (
//             <Alert variant="destructive" className="mt-2">
//               <AlertDescription>{errors.labels.message}</AlertDescription>
//             </Alert>
//           )}
//         </div>
//         <Button disabled={isSubmitting} type="submit" className="w-full">
//           Submit New Issue {isSubmitting && <Spinner />}
//         </Button>
//       </form>
//       <Toaster />
//     </div>
//   );
// }
