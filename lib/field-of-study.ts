// data/FieldOfStudy.ts
export interface FieldOfStudy {
  code: string;
  name: string;
  category?: string;
}

export const FIELD_OF_STUDY_MAP: Record<string, string> = {
  // Commerce, Management, Tourism and Services (3500 series)
  "3501": "Accounting, auditing and accountability",
  "3502": "Banking, finance and investment",
  "3503": "Business systems in context",
  "3504": "Commercial services",
  "3505": "Human resources and industrial relations",
  "3506": "Marketing",
  "3507": "Strategy, management and organisational behaviour",
  "3508": "Tourism",
  "3509": "Transportation, logistics and supply chains",
  "3599": "Other commerce, management, tourism and services",
  
  // Economics (3800 series)
  "3801": "Applied economics",
  "3802": "Econometrics",
  "3803": "Economic theory",
  "3899": "Other economics",
  
  // Information Systems
  "4609": "Information systems",
  
  // Law
  "4801": "Commercial law",
  
  // Statistics
  "4905": "Statistics"
};

export const FIELD_OF_STUDY_ARRAY: FieldOfStudy[] = [
  {
    code: "3501",
    name: "Accounting, auditing and accountability",
    category: "Commerce, Management, Tourism and Services"
  },
  {
    code: "3502", 
    name: "Banking, finance and investment",
    category: "Commerce, Management, Tourism and Services"
  },
  {
    code: "3503",
    name: "Business systems in context", 
    category: "Commerce, Management, Tourism and Services"
  },
  {
    code: "3504",
    name: "Commercial services",
    category: "Commerce, Management, Tourism and Services"
  },
  {
    code: "3505",
    name: "Human resources and industrial relations",
    category: "Commerce, Management, Tourism and Services"
  },
  {
    code: "3506",
    name: "Marketing",
    category: "Commerce, Management, Tourism and Services"
  },
  {
    code: "3507",
    name: "Strategy, management and organisational behaviour",
    category: "Commerce, Management, Tourism and Services"
  },
  {
    code: "3508",
    name: "Tourism",
    category: "Commerce, Management, Tourism and Services"
  },
  {
    code: "3509",
    name: "Transportation, logistics and supply chains", 
    category: "Commerce, Management, Tourism and Services"
  },
  {
    code: "3599",
    name: "Other commerce, management, tourism and services",
    category: "Commerce, Management, Tourism and Services"
  },
  {
    code: "3801",
    name: "Applied economics",
    category: "Economics"
  },
  {
    code: "3802",
    name: "Econometrics", 
    category: "Economics"
  },
  {
    code: "3803",
    name: "Economic theory",
    category: "Economics"
  },
  {
    code: "3899",
    name: "Other economics",
    category: "Economics"
  },
  {
    code: "4609", 
    name: "Information systems",
    category: "Information Systems"
  },
  {
    code: "4801",
    name: "Commercial law",
    category: "Law"
  },
  {
    code: "4905",
    name: "Statistics",
    category: "Statistics"
  }
];

// Helper functions
export function getFieldOfStudyName(code: string): string | undefined {
  return FIELD_OF_STUDY_MAP[code];
}

export function getFieldOfStudyByCode(code: string): FieldOfStudy | undefined {
  return FIELD_OF_STUDY_ARRAY.find(field => field.code === code);
}

export function getFieldsByCategory(category: string): FieldOfStudy[] {
  return FIELD_OF_STUDY_ARRAY.filter(field => field.category === category);
}

export function getAllFieldCodes(): string[] {
  return Object.keys(FIELD_OF_STUDY_MAP);
}

export function searchFieldsOfStudy(query: string): FieldOfStudy[] {
  const lowerQuery = query.toLowerCase();
  return FIELD_OF_STUDY_ARRAY.filter(field => 
    field.name.toLowerCase().includes(lowerQuery) ||
    field.code.includes(query) ||
    field.category?.toLowerCase().includes(lowerQuery)
  );
}