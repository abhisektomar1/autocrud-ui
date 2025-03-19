import { Code, Globe, Clock, Mail } from "lucide-react";
import { configurationSchemas } from "./schemas";

interface NodeTemplate {
  type: string;
  label: string;
  icon: any;
  description: string;
  color: string;
  defaultConfig?: any;
  schema?: any;
}

export const nodeLibrary: NodeTemplate[] = [
  {
    type: "code",
    label: "Code",
    icon: Code,
    description: "Execute custom code",
    color: "bg-blue-100 hover:bg-blue-200",
    defaultConfig: {
      language: "javascript",
      code: "// Your code here",
    },
    schema: configurationSchemas.code,
  },
  {
    type: "api",
    label: "API",
    icon: Globe,
    description: "Make API calls",
    color: "bg-green-100 hover:bg-green-200",
    defaultConfig: {
      url: "",
      method: "GET",
      headers: {},
    },
    schema: configurationSchemas.api,
  },
  {
    type: "delay",
    label: "Delay",
    icon: Clock,
    description: "Add time delay",
    color: "bg-yellow-100 hover:bg-yellow-200",
    defaultConfig: {
      duration: 1,
      unit: "seconds",
    },
    schema: configurationSchemas.delay,
  },
  {
    type: "email",
    label: "Email",
    icon: Mail,
    description: "Send emails",
    color: "bg-purple-100 hover:bg-purple-200",
    defaultConfig: {
      to: "",
      subject: "",
      body: "",
    },
    schema: configurationSchemas.email,
  },
];
