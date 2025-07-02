"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import type { BlockParameter } from "@/lib/types";

interface BlockParameterEditorProps {
  parameter: BlockParameter;
  value: boolean | number | string;
  onChange: (value: boolean | number | string) => void;
  className?: string;
}

export function BlockParameterEditor({
  parameter,
  value,
  onChange,
  className = "",
}: BlockParameterEditorProps) {
  const handleChange = (newValue: boolean | number | string) => {
    onChange(newValue);
  };

  switch (parameter.type) {
    case "number":
    case "angle":
      return (
        <Input
          type="number"
          value={String(value ?? parameter.defaultValue)}
          onChange={(e) => handleChange(Number(e.target.value))}
          min={parameter.min}
          max={parameter.max}
          step={parameter.step}
          className={`w-16 h-6 text-xs bg-gray-100 border-gray-300 text-gray-900 ${className}`}
        />
      );

    case "string":
      return (
        <Input
          type="text"
          value={String(value ?? parameter.defaultValue)}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={parameter.placeholder}
          className={`w-20 h-6 text-xs bg-gray-100 border-gray-300 text-gray-900 ${className}`}
        />
      );

    case "dropdown":
      return (
        <Select
          value={String(value ?? parameter.defaultValue)}
          onValueChange={handleChange}
        >
          <SelectTrigger
            className={`w-20 h-6 text-xs bg-gray-100 border-gray-300 text-gray-900 ${className}`}
          >
            <SelectValue className="text-gray-900" />
          </SelectTrigger>
          <SelectContent>
            {parameter.options?.map((option) => (
              <SelectItem key={option} value={option} className="text-xs text-gray-900">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "boolean":
      return (
        <div className={`flex items-center ${className}`}>
          <Checkbox
            checked={Boolean(value ?? parameter.defaultValue)}
            onCheckedChange={handleChange}
            className="bg-white border-2 border-white/70 data-[state=checked]:bg-white data-[state=checked]:text-black w-4 h-4"
          />
        </div>
      );

    default:
      return null;
  }
}
