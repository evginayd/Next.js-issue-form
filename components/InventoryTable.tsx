"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "./ui/input";
import { Combobox } from "../components/ui/combo-box";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
type Issue = {
  id: string;
  title: string;
  status: "OPEN" | "CLOSED";
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdAt: string;
  description?: string; // Resolver'da varsa ekleyin
  createdById?: string; // Resolver'da varsa ekleyin
  assignedToId?: string;
  dueDate?: string | null;
  labels?: string[];
};

export default function InventoryTable() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [issues, setIssues] = useState<Issue[]>([]);
  useEffect(() => {
    async function fetchIssues() {
      const res = await fetch("/api/issues"); // örnek API route
      const data = await res.json();
      setIssues(data);
    }

    fetchIssues();
  }, []);

  return (
    <div className="w-full p-4">
      {/* Filter bar */}
      <div className="flex items-center gap-4 mb-6 flex-wrap lg:flex-nowrap">
        {/* Search input with icon */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute h-4 w-4 left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search..." className="pl-10" />
        </div>

        {/* Category combobox */}
        <div className="w-full max-w-sm">
          <Combobox
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val)}
          />
        </div>

        {/* New Issue button, aligned right */}
        <div className="ml-auto">
          <Button>
            <Link href="/issues/new">New Issue</Link>
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue) => (
            <TableRow key={issue.id}>
              <TableCell>{issue.title}</TableCell>
              <TableCell>{issue.status}</TableCell>
              <TableCell>{issue.category}</TableCell>
              <TableCell>{issue.priority}</TableCell>
              <TableCell>
                {new Date(issue.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <button className="text-blue-600 hover:underline">
                    Edit
                  </button>
                  <button className="text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
