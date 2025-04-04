export interface PodioField {
  field_id: number;
  external_id: string;
  label: string;
  type:
    | "text"
    | "number"
    | "money"
    | "category"
    | "question"
    | "date"
    | "duration"
    | "image"
    | "file"
    | "contact"
    | "app"
    | "embed"
    | "phone"
    | "email"
    | "progress"
    | "calculation";
  status: "active" | "deleted";
  config: PodioFieldConfig;
}

export interface PodioFieldConfig {
  default_value: any;
  delta: number;
  description: string | null;
  hidden: boolean;
  required: boolean;
  visible: boolean;
  settings: PodioFieldSettings;
}

export type PodioFieldSettings =
  | TextSettings
  | NumberSettings
  | MoneySettings
  | CategorySettings
  | QuestionSettings
  | DateSettings
  | DurationSettings
  | FileSettings
  | ContactSettings
  | AppSettings
  | EmbedSettings
  | TelSettings
  | CalculationSettings;

export interface TextSettings {
  size: "small" | "large";
  format: "plain" | "markdown" | "html";
}

export interface NumberSettings {
  decimals: number;
}

export interface MoneySettings {
  allowed_currencies: string[]; // ISO 4217 Currency codes
}

export interface CategorySettings {
  options: {
    id: number;
    status: "active" | "deleted";
    text: string;
    color?: string;
  }[];
  multiple: boolean;
  display: "inline" | "list" | "dropdown";
}

export interface QuestionSettings {
  options: {
    id: number;
    status: "active" | "deleted";
    text: string;
  }[];
  multiple: boolean;
}

export interface DateSettings {
  calendar: boolean;
  end: "disabled" | "enabled" | "required";
  time: "disabled" | "enabled" | "required";
  color?: string;
}

export interface DurationSettings {
  fields: ("days" | "hours" | "minutes" | "seconds")[];
}

export interface FileSettings {
  allowed_mimetypes: string[]; // e.g., "image/png", "application/pdf"
}

export interface ContactSettings {
  type:
    | "space_users"
    | "all_users"
    | "space_contacts"
    | "space_users_and_contacts";
}

export interface AppSettings {
  referenced_apps: {
    app_id: number;
    view_id: number | null;
  }[];
  multiple: boolean;
}

export interface EmbedSettings {
  // Currently no extra settings defined in the docs
}

export interface TelSettings {
  strict?: boolean;
  display_format?: "INT" | "NAT" | "E164" | "RFC3966";
  default_country_code?: string; // ISO 3166-1 alpha-2
}

export interface CalculationSettings {
  script: string;
  unit?: string | null;
  decimals?: number | null;
  time?: "disabled" | "enabled" | null;
  calendar?: boolean | null;
  color?: string | null;
}
