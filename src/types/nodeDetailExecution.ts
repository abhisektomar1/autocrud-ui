export interface NodeDetailExecution {
    id: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    requestHash: string;
    spaceid: string;
    flowid: string;
    execId: string;
    status: string;
    execution: Execution;
}

export interface Execution {
    id: string;
    eventId: string;
    spaceid: string;
    flowid: string;
    status: StatusInfo;
    snapshotId: string;
    attempt: number;
    variables: Record<string, Variable>;
    jobExecs: Record<string, JobExec>;
}

export interface StatusInfo {
    status: string;
    at: string;
    message: string;
}

export interface Variable {
    is_executed?: boolean;
    is_success?: boolean;
    error?: null | string;
    output: any;
    success?: boolean;
    type: string;
}

export interface JobExec {
    name: string;
    job: string;
    output: {
        Response: any;
        Error: null | string;
    };
    at: TimeInfo;
}

export interface TimeInfo {
    Begin: string;
    End: string;
    TimeTaken: number;
}

export interface APIResponse {
    attempt: number;
    base64EncodedBody: string;
    body: any[];
    headers: Record<string, string[]>;
    logs: string[];
    name: string;
    statusCode: number;
    type: string;
}

export interface JokeItem {
    id: number;
    type: string;
    setup: string;
    punchline: string;
}

export interface DelayResponse {
    name: string;
    status: string;
}