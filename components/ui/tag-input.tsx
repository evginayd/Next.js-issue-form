import * as React from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  value: string[];
  onChange: (tags: string[]) => void;
}

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  ({ value, onChange, className, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputValue.trim()) {
        e.preventDefault();
        if (!value.includes(inputValue.trim())) {
          console.log("Adding tag:", inputValue.trim()); // Debug
          onChange([...value, inputValue.trim()]);
        }
        setInputValue("");
      }
    };

    const removeTag = (index: number) => {
      console.log("Removing tag at index:", index, "Current tags:", value); // Debug
      onChange(value.filter((_, i) => i !== index));
    };

    return (
      <div className="flex flex-wrap gap-2 border rounded-md p-2 bg-background">
        {value.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1 text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                removeTag(index);
              }}
              className="focus:outline-none"
              aria-label={`Remove ${tag} tag`}
            >
              <X className="h-4 w-4 cursor-pointer hover:text-destructive" />
            </button>
          </Badge>
        ))}
        <Input
          ref={ref}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            "flex-1 border-none shadow-none focus-visible:ring-0 min-w-[150px]",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

TagInput.displayName = "TagInput";

export { TagInput };
