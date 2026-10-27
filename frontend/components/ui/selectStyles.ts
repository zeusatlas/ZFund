import type { StylesConfig, GroupBase } from "react-select";

export function getSelectStyles<Option = { value: string; label: string }, IsMulti extends boolean = false>(
  options?: { minHeight?: string; borderColor?: string }
): StylesConfig<Option, IsMulti, GroupBase<Option>> {
  const minHeight = options?.minHeight ?? "46px";
  const defaultBorder = options?.borderColor ?? "rgba(11, 37, 69, 0.15)";

  return {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#ffffff",
      borderColor: state.isFocused ? "#0b2545" : defaultBorder,
      borderRadius: "0.75rem",
      minHeight,
      boxShadow: state.isFocused ? "0 0 0 1px #0b2545" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#0b2545" : "rgba(11, 37, 69, 0.3)",
      },
      cursor: "pointer",
      fontSize: "0.875rem",
      transition: "all 150ms ease",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 12px",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#0b2545",
      fontWeight: 500,
    }),
    placeholder: (base) => ({
      ...base,
      color: "#2e4c6d",
      opacity: 0.6,
    }),
    input: (base) => ({
      ...base,
      color: "#0b2545",
      margin: 0,
      padding: 0,
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#ffffff",
      borderRadius: "0.75rem",
      overflow: "hidden",
      boxShadow: "0 10px 25px -5px rgba(11, 37, 69, 0.1), 0 8px 10px -6px rgba(11, 37, 69, 0.05)",
      border: "1px solid rgba(11, 37, 69, 0.1)",
      zIndex: 9999,
    }),
    menuList: (base) => ({
      ...base,
      padding: "4px",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#0b2545"
        : state.isFocused
        ? "rgba(11, 37, 69, 0.05)"
        : "#ffffff",
      color: state.isSelected ? "#ffffff" : "#0b2545",
      borderRadius: "0.5rem",
      margin: "2px 0",
      fontSize: "0.875rem",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#0b2545",
        color: "#ffffff",
      },
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: state.isFocused ? "#0b2545" : "#2e4c6d",
      padding: "0 8px",
      "&:hover": {
        color: "#0b2545",
      },
    }),
    clearIndicator: (base) => ({
      ...base,
      color: "#2e4c6d",
      padding: "0 6px",
      cursor: "pointer",
      "&:hover": {
        color: "#a13d3d",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };
}
