export interface NodeInterface {
    createdAt: string; // ISO 8601 date string
    createdBy: string; // Email address of the creator
    description: string; // Description of the event
    space?: string;
    flowId?: string;
    id: string; // Unique identifier
    inputs: {
      parameters: {
        [key: string]: string; // Dynamic key-value pairs where both keys and values are strings
      };
    };
    name: string; // Name of the event
  
    type: string;
    position: NodePosition;
    // Event type
    links?: LinkInterface[];
    display?:{
      icon:string,
      color:string,
    }
  }
  
  export interface NodePosition {
    Measured: {
      width: number; // Width of the element
      height: number; // Height of the element
    };
    Coordinates: {
      x: number; // X coordinate
      y: number; // Y coordinate
    };
  }
  
  export interface Coordinates {
    x: number;
    y: number;
  }
  
  export interface Measured {
    width: number;
    height: number;
  }
  
  export interface FlowInterface {
    Trigger: any;
    createdAt: string;
    createdBy: string;
    description: string;
    id: string;
    name: string;
    nodeCount: number;
    nodes: NodeInterface[];
    space: string;
  }
  
  export interface LinkInterface {
    nextNodeId: string;
    sequence: number;
    type: string;
  }
  