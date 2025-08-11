import React from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

function Icon({
  name,
  size = 24,
  color = "currentColor",
  className = "",
  ...props
}) {
  // For now, ignore Lucide and always show fallback icon
  return (
    <HelpOutlineIcon
      style={{ fontSize: size, color }}
      className={className}
      {...props}
    />
  );
}

export default Icon;
