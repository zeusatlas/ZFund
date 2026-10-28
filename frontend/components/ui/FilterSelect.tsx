"use client";

import { useId } from "react";
import Select from "react-select";
import { getSelectStyles } from "@/components/ui/selectStyles";

type Option = { value: string; label: string };

type FilterSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  label: string;
  className?: string;
  minHeight?: string;
};

/** Single-choice dropdown built on react-select, used in place of the native select. */
export default function FilterSelect({ value, onChange, options, label, className, minHeight = "42px" }: Readonly<FilterSelectProps>) {
  const id = useId();
  const styles = getSelectStyles<Option>({ minHeight });
  return (
    <Select<Option, false>
      instanceId={id}
      aria-label={label}
      className={className}
      options={options}
      value={options.find((option) => option.value === value) ?? null}
      onChange={(option) => onChange(option?.value ?? "")}
      isSearchable={false}
      menuPortalTarget={typeof document === "undefined" ? undefined : document.body}
      styles={{ ...styles, menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
    />
  );
}
