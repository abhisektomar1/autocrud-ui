export const getDefaultConfig = (node: any) => {
  const [group, actionType] = node.type.split(":");

  const baseConfig = {
    group: node.group,
    nodeType: node.type,
    category: node.category,
  };

  switch (group) {
    case "api":
      return {
        ...baseConfig,
        url: "",
        method: "GET",
        headers: {},
        params: {},
      };
    case "code":
      return {
        ...baseConfig,
        language: "javascript",
        code: "// Your code here",
      };
    case "delay":
      return {
        ...baseConfig,
        duration: 1,
        unit: "seconds",
      };
    case "email":
      return {
        ...baseConfig,
        to: "",
        subject: "",
        body: "",
      };
    case "table":
      return {
        ...baseConfig,
        tableName: "",
        ...(actionType.includes("create") && { data: {} }),
        ...(actionType.includes("update") && { data: {}, conditions: {} }),
        ...(actionType.includes("delete") && { conditions: {} }),
        ...(actionType.includes("search") && { conditions: {} }),
      };
    default:
      return baseConfig;
  }
  // ... (keeping existing getDefaultConfig function)
};
