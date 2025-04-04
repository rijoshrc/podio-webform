"use client";

import {
  AppSettings,
  CategorySettings,
  ContactSettings,
  DurationSettings,
  FileSettings,
  MoneySettings,
  NumberSettings,
  PodioField,
  TextSettings,
} from "@/types/podio";
import { Checkbox } from "./ui/checkbox";
import { DatePicker } from "./ui/date-picker";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { MultiSelect } from "./ui/multi-select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import { Textarea } from "./ui/textarea";

interface FieldProps {
  field: PodioField;
}

const FieldRenderer = ({ field }: FieldProps) => {
  const { label, external_id, type, config } = field;

  switch (type) {
    case "text": {
      const settings = config.settings as TextSettings;
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          {settings.size === "large" ? (
            <Textarea placeholder={label} />
          ) : (
            <Input placeholder={label} />
          )}
        </div>
      );
    }

    case "number": {
      const settings = config.settings as NumberSettings;
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <Input
            type="number"
            step={1 / 10 ** settings.decimals}
            placeholder={label}
          />
        </div>
      );
    }

    case "money": {
      const settings = config.settings as MoneySettings;
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <div className="flex gap-2">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                {settings.allowed_currencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Amount" />
          </div>
        </div>
      );
    }

    case "category": {
      const settings = config.settings as CategorySettings;
      const options = settings.options.filter((o) => o.status === "active");

      if (settings.multiple) {
        if (settings.display === "dropdown") {
          return (
            <div className="space-y-2">
              <Label>{label}</Label>
              <MultiSelect
                options={options.map((opt) => ({
                  label: opt.text,
                  value: opt.id.toString(),
                }))}
                placeholder={`Select ${label}`}
                onValueChange={() => {}}
              />
            </div>
          );
        }

        return (
          <div className="space-y-2">
            <Label>{label}</Label>
            <div
              className={
                settings.display === "inline" ? "flex gap-4" : "space-y-2"
              }
            >
              {options.map((opt) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <Checkbox id={`${external_id}_${opt.id}`} />
                  <label htmlFor={`${external_id}_${opt.id}`}>{opt.text}</label>
                </div>
              ))}
            </div>
          </div>
        );
      }

      if (settings.display === "dropdown") {
        return (
          <div className="space-y-2">
            <Label>{label}</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${label}`} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.id} value={opt.text}>
                    {opt.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      }

      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <RadioGroup>
            {options.map((opt) => (
              <div key={opt.id} className="flex items-center gap-2">
                <RadioGroupItem
                  id={`${external_id}_${opt.id}`}
                  value={opt.text}
                />
                <label htmlFor={`${external_id}_${opt.id}`}>{opt.text}</label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
    }

    case "date":
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <DatePicker />
        </div>
      );

    case "duration": {
      const settings = config.settings as DurationSettings;
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <div className="flex gap-2">
            {settings.fields.includes("days") && (
              <Input type="number" placeholder="Days" />
            )}
            {settings.fields.includes("hours") && (
              <Input type="number" placeholder="Hours" />
            )}
            {settings.fields.includes("minutes") && (
              <Input type="number" placeholder="Minutes" />
            )}
            {settings.fields.includes("seconds") && (
              <Input type="number" placeholder="Seconds" />
            )}
          </div>
        </div>
      );
    }

    case "image":
    case "file": {
      const settings = config.settings as FileSettings;
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <Input type="file" accept={settings.allowed_mimetypes.join(",")} />
        </div>
      );
    }

    case "contact": {
      const settings = config.settings as ContactSettings;
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          {settings.type === "space_users" || settings.type === "all_users" ? (
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${label}`} />
              </SelectTrigger>
              <SelectContent>
                {/* TODO: populate options dynamically */}
              </SelectContent>
            </Select>
          ) : (
            <MultiSelect
              options={[]}
              placeholder={`Select ${label}`}
              onValueChange={() => {}}
            />
          )}
        </div>
      );
    }

    case "app": {
      const settings = config.settings as AppSettings;
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          {settings.multiple ? (
            <MultiSelect
              options={[]}
              placeholder={`Select ${label}`}
              onValueChange={() => {}}
            />
          ) : (
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${label}`} />
              </SelectTrigger>
              <SelectContent>
                {/* TODO: populate options dynamically */}
              </SelectContent>
            </Select>
          )}
        </div>
      );
    }

    case "embed":
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <Input type="url" placeholder="Enter URL" />
        </div>
      );

    case "phone":
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <Input type="tel" placeholder="Enter phone number" />
        </div>
      );
    case "email":
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <Input type="email" placeholder={`Enter email`} />
        </div>
      );

    case "progress":
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <Slider defaultValue={[0]} max={100} step={1} />
        </div>
      );

    case "calculation":
      return null;

    default:
      return (
        <div className="p-2 border rounded bg-red-50 text-red-700">
          Unsupported field type: {type}
        </div>
      );
  }
};

interface FormGeneratorProps {
  appData: { fields: PodioField[] };
}

export default function FormGenerator({ appData }: FormGeneratorProps) {
  const visibleFields = appData.fields.filter(
    (f) => !f.config.hidden && f.config.visible && f.status === "active"
  );

  return (
    <div className="p-6 space-y-6 border rounded-lg">
      {visibleFields.map((field) => (
        <FieldRenderer key={field.field_id} field={field} />
      ))}
    </div>
  );
}
