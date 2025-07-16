"use client";
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const NewIssuePage = () => {
  return (
    <div className="max-w-xl space-y-3">
      <Input placeholder="Title" />
      <Textarea placeholder="Description" />
      <Button>Submit New Issue</Button>
    </div>
  );
};

export default NewIssuePage;
