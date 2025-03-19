export interface SpaceModel {
  id?: string;
  name: string;
  friendlyName?: string;
  description?: string;
}

export interface FlowModel {
  data?: any;
  id?: string;
  name?: string;
  space?: string;
  description?: string;
  nodes?: any[];
  trigger?: any;
}

export interface ConnectModel {
  space: string;
  flowId: string;
  sourceId: string;
  nextNodeId: string;
}
export interface TableModel {
  tableId: string;
  spaceId: string;
  name: string;
  space: string;
  columns: ColumnModel[];
  columnCount: number;
  createdAt: string;
  createdBy: string;
  id: string;
}

export interface TableCreateColumnModel {
  name: string;
  fieldType: string;
  length: number;
}

export interface TableCreateModel {
  name: string;
  space: string;
  description: string;
  columns: TableCreateColumnModel[];
}

export interface ColumnModel {
  name: string;
  dataType: string;
  length?: number;
  isSearchable?: boolean;
  isRequired?: boolean;
  enum?: string[];
}

export interface CommentModel {
  message: string;
}

export interface CommentDataModel {
  app: string;
  appType: string;
  category: string;
  createdAt: string;
  createdBy: string;
  entityId: string;
  id: string;
  message: string;
  space: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}
