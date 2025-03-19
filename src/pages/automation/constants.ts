  // src/components/ThreadNodeBuilder/config/constants.ts
  export const NODE_TYPES = {
    API: 'api',
    CODE: 'code',
    DELAY: 'delay',
    EMAIL: 'email',
  } as const;
  
  export const TIME_UNITS = {
    SECONDS: 'seconds',
    MINUTES: 'minutes',
    HOURS: 'hours',
  } as const;
  
  export const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
  } as const;
  
  export const PROGRAMMING_LANGUAGES = {
    JAVASCRIPT: 'javascript',
    PYTHON: 'python',
    TYPESCRIPT: 'typescript',
  } as const;
  
