
export interface JobExecutionResponse {
    id: string;
    execId: string;
    flowid: string;
    spaceid: string;
    status: string;
    requestHash: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    execution: JobExecutionDetail;
  }
  // For the status object
  interface ExecutionStatus {
    status: string;
    at: string;
    message: string;
  }
  
  // For the joke data structure
  interface Joke {
    id: number;
    type: string;
    setup: string;
    punchline: string;
  }
  
  // For HTTP headers
  interface Headers {
    "Access-Control-Allow-Origin": string[];
    "Alt-Svc": string[];
    "Content-Type": string[];
    Date: string[];
    Etag: string[];
    Server: string[];
    Vary: string[];
    "X-Cloud-Trace-Context": string[];
    "X-Powered-By": string[];
  }
  
  // For node output structure
  interface NodeOutput {
    attempt?: number;
    base64EncodedBody?: string;
    body?: Joke[];
    headers?: Headers;
    logs?: string[];
    name: string;
    statusCode?: number;
    type?: string;
    status?: string;
  }
  
  // For variable result structure
  interface VariableResult {
    error: null | string;
    output: NodeOutput;
    success: boolean;
    type: string;
  }
  
  // For timing information
  interface ExecutionTiming {
    Begin: string;
    End: string;
    TimeTaken: number;
  }
  
  // For job execution details
  interface JobExecution {
    name: string;
    job: string;
    at: ExecutionTiming;
  }
  
  // Main execution response interface
  export interface JobExecutionDetail {
    id: string;
    eventId: string;
    spaceid: string;
    flowid: string;
    status: ExecutionStatus;
    snapshotId: string;
    attempt: number;
    variables: {
      [key: string]: VariableResult;
    };
    jobExecs: {
      [key: string]: JobExecution;
    };
  }

  