//  dynamic theme configuration
import { useTheme } from "../components/theme/theme-provider";

// Function to get theme-specific colors
export const getThemeColors = (themeName) => {
  switch (themeName) {
    case "light":
      return {
        primary: "#0090ed",
        secondary: "#ff8534",
        background: "#ffffff",
        cardBg: "#ffffff",
        tableBg: "#f8fafc",
        tableHeaderBg: "#f1f5fe",
        tableRowHoverBg: "rgba(0, 144, 237, 0.08)",
        tableSelectedRowBg: "rgba(0, 144, 237, 0.12)",
        borderColor: "#e2e8f0",
        textColor: "#0a0f29",
        mutedTextColor: "#646b82",
      };
    case "royal":
      return {
        primary: "#6a5acd",
        secondary: "#9370db",
        background: "#0a0a1a",
        cardBg: "#15152a",
        tableBg: "#15152a",
        tableHeaderBg: "#1e1e3f",
        tableRowHoverBg: "rgba(106, 90, 205, 0.15)",
        tableSelectedRowBg: "rgba(106, 90, 205, 0.25)",
        borderColor: "#252540",
        textColor: "#f0f0ff",
        mutedTextColor: "#a0a0c0",
      };
    case "emerald":
      return {
        primary: "#41c791",
        secondary: "#38b2ac",
        background: "#213947",
        cardBg: "#2a4758",
        tableBg: "#2a4758",
        tableHeaderBg: "#325261",
        tableRowHoverBg: "rgba(65, 199, 145, 0.15)",
        tableSelectedRowBg: "rgba(65, 199, 145, 0.25)",
        borderColor: "#325261",
        textColor: "#e0f7fa",
        mutedTextColor: "#a0bcc5",
      };
    case "dark":
    default:
      return {
        primary: "#00f3ff",
        secondary: "#ff2d55",
        background: "#0a0a0f",
        cardBg: "#15151f",
        tableBg: "#15151f",
        tableHeaderBg: "#1e1e2f",
        tableRowHoverBg: "rgba(0, 243, 255, 0.08)",
        tableSelectedRowBg: "rgba(0, 243, 255, 0.15)",
        borderColor: "#252535",
        textColor: "#e0e0ff",
        mutedTextColor: "#9090a0",
      };
  }
};

// Dynamic theme configuration function
export const getAntdTheme = (themeName) => {
  const colors = getThemeColors(themeName);

  return {
    token: {
      colorPrimary: colors.primary,
      colorSuccess: "#10B981", // Consistent across themes
      colorWarning: "#F59E0B", // Consistent across themes
      colorError: colors.secondary,
      colorInfo: colors.primary,

      colorBgBase: colors.background,
      colorTextBase: colors.textColor,

      borderRadius: 8,
      wireframe: false,
      fontSizeHeading3: 24,
      fontSizeHeading4: 20,
      fontSizeHeading5: 16,
      fontWeightStrong: 600,

      // Animation settings
      motionEaseInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      motionDurationMid: "0.2s",
      motionDurationSlow: "0.3s",
    },
    components: {
      Button: {
        colorPrimary: colors.primary,
        algorithm: true,
        borderRadius: 6,
        controlHeight: 36,
        fontSize: 14,
        fontWeight: 500,
      },
      Input: {
        colorBgContainer: colors.cardBg,
        colorBorder: colors.borderColor,
        borderRadius: 6,
        activeShadow: `0 0 0 2px ${colors.primary}33`,
      },
      Select: {
        colorBgContainer: colors.cardBg,
        colorBorder: colors.borderColor,
        borderRadius: 6,
        optionSelectedBg: `${colors.primary}1A`,
        dropdownClassName: "theme-aware-dropdown",
      },
      Table: {
        colorBgContainer: colors.tableBg,
        colorBorderSecondary: colors.borderColor,
        headerBg: colors.tableHeaderBg,
        headerColor: colors.textColor,
        headerSplitColor: colors.borderColor,
        rowHoverBg: colors.tableRowHoverBg,
        selectedRowBg: colors.tableSelectedRowBg,
        borderRadius: 8,
        fontSize: 14,
      },
      Modal: {
        colorBgElevated: colors.cardBg,
        colorBorderSecondary: colors.borderColor,
        borderRadiusLG: 12,
        paddingContentHorizontalLG: 24,
      },
      Card: {
        colorBgContainer: colors.cardBg,
        colorBorderSecondary: colors.borderColor,
        borderRadiusLG: 12,
        boxShadowTertiary:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      Tabs: {
        colorBgContainer: colors.cardBg,
        colorPrimary: colors.primary,
        borderRadius: 8,
        inkBarColor: colors.primary,
      },
      Popconfirm: {
        colorBgElevated: colors.cardBg,
        colorBorderSecondary: colors.borderColor,
      },
    },
  };
};

// Hook to get the current theme configuration
export const useAntdTheme = () => {
  const { theme } = useTheme();
  return getAntdTheme(theme);
};

// Export a default theme for static contexts
export const theme = getAntdTheme("dark");
