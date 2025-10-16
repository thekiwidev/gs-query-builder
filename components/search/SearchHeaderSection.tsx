"use client";

import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { GS_SEARCH_FIELDS } from "../../data/SearchWithin";
import { Button } from "../ui/button";
import { X, Calendar } from "lucide-react";

interface SearchHeaderSectionProps {
  yearLow?: number;
  yearHigh?: number;
  selectedField?: string;
  onYearChange?: (yearLow?: number, yearHigh?: number) => void;
  onFieldChange?: (fieldId: string) => void;
  onRemoveHeader?: () => void;
}

export function SearchHeaderSection({
  yearLow,
  yearHigh,
  selectedField,
  onYearChange,
  onFieldChange,
  onRemoveHeader,
}: SearchHeaderSectionProps) {
  return (
    <div className="flex gap-4 items-start pb-4 border-b border-gray-200">
      {/* Year Low */}
      <div className="flex flex-col">
        <Label className="text-xs text-gray-600 mb-1 flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Year Low
        </Label>
        <Input
          type="number"
          placeholder="From"
          value={yearLow || ""}
          onChange={(e) => {
            const newYearLow = e.target.value
              ? parseInt(e.target.value)
              : undefined;
            onYearChange?.(newYearLow, yearHigh);
          }}
          min="1900"
          max={new Date().getFullYear()}
          className="h-10 w-24 text-sm"
        />
      </div>

      {/* Year High */}
      <div className="flex flex-col">
        <Label className="text-xs text-gray-600 mb-1 flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Year High
        </Label>
        <Input
          type="number"
          placeholder="To"
          value={yearHigh || ""}
          onChange={(e) => {
            const newYearHigh = e.target.value
              ? parseInt(e.target.value)
              : undefined;
            onYearChange?.(yearLow, newYearHigh);
          }}
          min="1900"
          max={new Date().getFullYear()}
          className="h-10 w-28 text-sm"
        />
      </div>

      {/* Field Selector */}
      <div className="flex-1 flex flex-col">
        <Label className="text-xs text-gray-600 mb-1">Field</Label>
        <Select
          value={selectedField || "all_fields"}
          onValueChange={onFieldChange}
        >
          <SelectTrigger className="h-10 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GS_SEARCH_FIELDS.map((field) => (
              <SelectItem key={field.id} value={field.id}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Remove Button */}
      {onRemoveHeader && (
        <Button
          onClick={onRemoveHeader}
          variant="ghost"
          size="sm"
          className="mt-5 text-gray-400 hover:text-red-600 text-xl h-auto p-1"
        >
          <X className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
