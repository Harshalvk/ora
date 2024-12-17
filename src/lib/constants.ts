import {
  BookDashed,
  CreditCard,
  Home,
  Logs,
  MonitorUp,
  Settings,
  Workflow,
} from "lucide-react";

export const menuOptions = [
  { name: "Dashboard", Component: Home, href: "/dashboard" },
  { name: "Workflows", Component: Workflow, href: "/workflows" },
  { name: "Settings", Component: Settings, href: "/settings" },
  { name: "Connections", Component: MonitorUp, href: "/connections" },
  { name: "Billing", Component: CreditCard, href: "/billing" },
  { name: "Templates", Component: BookDashed, href: "templates" },
  { name: "Logs", Component: Logs, href: "/logs" },
];
