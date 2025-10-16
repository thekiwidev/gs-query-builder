/**
 * Search Block Error Row Component
 * Displays validation error messages
 */

'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface SearchBlockErrorRowProps {
  error: string;
}

export function SearchBlockErrorRow({ error }: SearchBlockErrorRowProps) {
  return (
    <div className="mt-3 p-3 bg-red-50 border-t border-red-200 rounded flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-red-900">
          Invalid Configuration
        </p>
        <p className="text-sm text-red-700 mt-1">{error}</p>
      </div>
    </div>
  );
}
