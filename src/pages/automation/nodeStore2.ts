import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Parameters {
  context: string;
  model: string;
  prompt: string;
  type: string;
}

interface Inputs {
  parameters: Parameters;
}

interface Node {
  createdAt: string;
  createdBy: string;
  description: string;
  flowid: string;
  id: string;
  inputs: Inputs;
  name: string;
  space: string;
  type: string;
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

interface NodeStore {
  nodes: Node[];
  newNode?: Node;
  edges: Edge[];
  activeNodeId: string | null;
  highlightedNodeId: string | null;
  searchTerm: string;

  // Node actions
  addNode: (node: Node) => void;
  addNewNode: (node?: Node) => void;
  addNodes: (nodes: Node[]) => void;
  addEdges: (edges: Edge[]) => void;
  clearNode: () => void;
  updateNode: (nodeId: string, updates: Partial<Node>) => void;
  removeNode: (nodeId: string) => void;
  setActiveNode: (nodeId: string | null) => void;
  setHighlightedNode: (nodeId: string | null) => void;

  // Search action
  setSearchTerm: (term: string) => void;

  // Edge actions
  addEdge: (edge: Edge) => void;
  removeEdge: (edgeId: string) => void;
}

export const useNodeBuilderStore = create<NodeStore>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      activeNodeId: null,
      highlightedNodeId: null,
      searchTerm: "",

      clearNode: () => {
        set({
          activeNodeId: null,
          highlightedNodeId: null,
        });
      },

      newNode: undefined,

      addNewNode: (node) => {
        set({
          newNode: node,
        });
      },

      addNodes: (nodes) => {
        set({
          nodes: nodes,
        });
      },

      addEdges: (edges) => {
        set({
          edges: edges,
        });
      },

      addNode: (node) => {
        const { nodes } = get();
        set({
          nodes: [...nodes, node],
        });
      },

      updateNode: (nodeId, updates) => {
        const { nodes } = get();
        const updatedNodes = nodes.map((node) =>
          node.id === nodeId ? { ...node, ...updates } : node
        );

        set({
          nodes: updatedNodes,
        });
      },

      removeNode: (nodeId) => {
        const { nodes } = get();
        set({
          nodes: nodes.filter((node) => node.id !== nodeId),
        });
      },

      setActiveNode: (nodeId) => set({ activeNodeId: nodeId }),

      setHighlightedNode: (nodeId) => {
        set({ highlightedNodeId: nodeId });
        
        if (nodeId) {
          setTimeout(() => {
            set((state) => {
              if (state.highlightedNodeId === nodeId) {
                return { highlightedNodeId: null };
              }
              return state;
            });
          }, 6000);
        }
      },

      setSearchTerm: (term) => set({ searchTerm: term }),

      addEdge: (edge) => {
        const { edges } = get();
        set({
          edges: [...edges, edge],
        });
      },

      removeEdge: (edgeId) => {
        const { edges } = get();
        set({
          edges: edges.filter((edge) => edge.id !== edgeId),
        });
      },
    }),
    {
      name: "node-builder",
    }
  )
);
