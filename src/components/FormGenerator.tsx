"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";

interface FieldProps {
  field: PodioField;
  control: any;
}

const getFieldValidation = (field: PodioField) => {
  const { type, config } = field;
  let validation: z.ZodTypeAny = z.any();

  if (config.required) {
    validation = validation.refine(
      (val) => {
        if (val === undefined || val === null) return false;
        if (typeof val === "string" && val.trim() === "") return false;
        if (Array.isArray(val) && val.length === 0) return false;
        return true;
      },
      { message: "This field is required" }
    );
  }

  switch (type) {
    case "text":
      return z.string();
    case "number":
      return z.number();
    case "money":
      return z.object({
        currency: z.string(),
        amount: z.number(),
      });
    case "category":
      const settings = config.settings as CategorySettings;
      if (settings.multiple) {
        return z.array(z.string()).min(config.required ? 1 : 0);
      }
      return z.string();
    case "date":
      return z.date();
    case "duration":
      return z.object({
        days: z.number().optional(),
        hours: z.number().optional(),
        minutes: z.number().optional(),
        seconds: z.number().optional(),
      });
    case "image":
    case "file":
      return z.instanceof(File).optional();
    // case "contact":
    //   if (config.settings.multiple) {
    //     return z.array(z.string());
    //   }
    //   return z.string();
    // case "app":
    //   if (config.settings.multiple) {
    //     return z.array(z.string());
    //   }
    //   return z.string();
    case "embed":
      return z.string().url();
    case "phone":
      return z.string().min(6);
    case "email":
      return z.string().email();
    case "progress":
      return z.number().min(0).max(100);
    default:
      return z.any();
  }
};

const FieldRenderer = ({ field, control }: FieldProps) => {
  const { label, external_id, type, config } = field;

  switch (type) {
    case "text": {
      const settings = config.settings as TextSettings;
      return (
        <FormField
          control={control}
          name={external_id}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                {settings.size === "large" ? (
                  <Textarea placeholder={label} {...field} />
                ) : (
                  <Input placeholder={label} {...field} />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    case "number": {
      const settings = config.settings as NumberSettings;
      return (
        <FormField
          control={control}
          name={external_id}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step={1 / 10 ** settings.decimals}
                  placeholder={label}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    case "money": {
      const settings = config.settings as MoneySettings;
      return (
        <FormField
          control={control}
          name={external_id}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Select
                    onValueChange={(currency) =>
                      field.onChange({ ...field.value, currency })
                    }
                    value={field.value?.currency}
                  >
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
                </FormControl>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={field.value?.amount || ""}
                    onChange={(e) =>
                      field.onChange({
                        ...field.value,
                        amount: Number(e.target.value),
                      })
                    }
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    case "category": {
      const settings = config.settings as CategorySettings;
      const options = settings.options.filter((o) => o.status === "active");

      if (settings.multiple) {
        if (settings.display === "dropdown") {
          return (
            <FormField
              control={control}
              name={external_id}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={options.map((opt) => ({
                        label: opt.text,
                        value: opt.id.toString(),
                      }))}
                      placeholder={`Select ${label}`}
                      value={field.value || []}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        }

        return (
          <FormField
            control={control}
            name={external_id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <div
                  className={
                    settings.display === "inline" ? "flex gap-4" : "space-y-2"
                  }
                >
                  {options.map((opt) => (
                    <FormField
                      key={opt.id}
                      control={control}
                      name={external_id}
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={opt.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(
                                  opt.id.toString()
                                )}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...(field.value || []),
                                        opt.id.toString(),
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value: string) =>
                                            value !== opt.id.toString()
                                        ) || []
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {opt.text}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      }

      if (settings.display === "dropdown") {
        return (
          <FormField
            control={control}
            name={external_id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${label}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id.toString()}>
                        {opt.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      }

      return (
        <FormField
          control={control}
          name={external_id}
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-col space-y-1"
                >
                  {options.map((opt) => (
                    <FormItem
                      key={opt.id}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={opt.id.toString()} />
                      </FormControl>
                      <FormLabel className="font-normal">{opt.text}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    case "date":
      return (
        <FormField
          control={control}
          name={external_id}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <DatePicker selected={field.value} onSelect={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "duration": {
      const settings = config.settings as DurationSettings;
      return (
        <FormField
          control={control}
          name={external_id}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <div className="flex gap-2">
                {settings.fields.includes("days") && (
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Days"
                      value={field.value?.days || ""}
                      onChange={(e) =>
                        field.onChange({
                          ...field.value,
                          days: Number(e.target.value),
                        })
                      }
                    />
                  </FormControl>
                )}
                {settings.fields.includes("hours") && (
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Hours"
                      value={field.value?.hours || ""}
                      onChange={(e) =>
                        field.onChange({
                          ...field.value,
                          hours: Number(e.target.value),
                        })
                      }
                    />
                  </FormControl>
                )}
                {settings.fields.includes("minutes") && (
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Minutes"
                      value={field.value?.minutes || ""}
                      onChange={(e) =>
                        field.onChange({
                          ...field.value,
                          minutes: Number(e.target.value),
                        })
                      }
                    />
                  </FormControl>
                )}
                {settings.fields.includes("seconds") && (
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Seconds"
                      value={field.value?.seconds || ""}
                      onChange={(e) =>
                        field.onChange({
                          ...field.value,
                          seconds: Number(e.target.value),
                        })
                      }
                    />
                  </FormControl>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    case "image":
    case "file": {
      const settings = config.settings as FileSettings;
      return (
        <FormField
          control={control}
          name={external_id}
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept={settings.allowed_mimetypes.join(",")}
                  onChange={(e) => onChange(e.target.files?.[0])}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    case "contact": {
      const settings = config.settings as ContactSettings;
      return (
        <FormField
          control={control}
          name={external_id}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                {settings.type === "space_users" ||
                settings.type === "all_users" ? (
                  <Select onValueChange={field.onChange} value={field.value}>
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
                    value={field.value || []}
                    onValueChange={field.onChange}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    case "app": {
      const settings = config.settings as AppSettings;
      return (
        <FormField
          control={control}
          name={external_id}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                {settings.multiple ? (
                  <MultiSelect
                    options={[]}
                    placeholder={`Select ${label}`}
                    value={field.value || []}
                    onValueChange={field.onChange}
                  />
                ) : (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {/* TODO: populate options dynamically */}
                    </SelectContent>
                  </Select>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    case "embed":
      return (
        <FormField
          control={control}
          name={external_id}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input type="url" placeholder="Enter URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "phone":
      return (
        <FormField
          control={control}
          name={external_id}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="Enter phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "email":
      return (
        <FormField
          control={control}
          name={external_id}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={`Enter email`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "progress":
      return (
        <FormField
          control={control}
          name={external_id}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Slider
                  defaultValue={[field.value || 0]}
                  max={100}
                  step={1}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
  onSubmit: (values: any) => void;
}

export default function FormGenerator({
  appData,
  onSubmit,
}: FormGeneratorProps) {
  const visibleFields = appData.fields.filter(
    (f) => !f.config.hidden && f.config.visible && f.status === "active"
  );

  const generateFormSchema = useCallback(() => {
    const schemaFields: Record<string, z.ZodTypeAny> = {};

    visibleFields.forEach((field) => {
      schemaFields[field.external_id] = getFieldValidation(field);
    });

    return z.object(schemaFields);
  }, [visibleFields]);

  const formSchema = generateFormSchema();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: visibleFields.reduce((acc, field) => {
      if (field.config.default_value !== undefined) {
        acc[field.external_id] = field.config.default_value;
      }
      return acc;
    }, {} as Record<string, any>),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="p-6 space-y-6 border rounded-lg"
      >
        {visibleFields.map((field) => (
          <FieldRenderer
            key={field.field_id}
            field={field}
            control={form.control}
          />
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
