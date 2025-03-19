import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, UserPlus, MoreHorizontal } from "lucide-react";

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: "Creator" | "Editor" | "Commenter" | "Viewer";
  invitedBy: string;
  invitedAt: string;
  avatar?: string;
}

const AccessSettings: React.FC = () => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("Creator");
  const [notifyPeople, setNotifyPeople] = useState(true);

  // Mock data - replace with actual data from your backend
  const collaborators: Collaborator[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "Creator",
      invitedBy: "You",
      invitedAt: "2 days ago",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Editor",
      invitedBy: "John Doe",
      invitedAt: "Dec 19, 2024",
    },
  ];

  const handleInvite = (email: string) => {
    // Implement your invite logic here
    console.log("Inviting:", email, "with role:", selectedRole);
    setIsInviteOpen(false);
  };

  const filteredCollaborators = collaborators.filter(
    (collab) =>
      collab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collab.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Access Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage who has access to this workspace
          </p>
        </div>
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Invite
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Invite to Workspace</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  placeholder="Enter email addresses..."
                  type="email"
                />
              </div>
              <div className="grid gap-2">
                <Label>Permission level</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Creator">
                      Creator - Full access
                    </SelectItem>
                    <SelectItem value="Editor">
                      Editor - Can edit records
                    </SelectItem>
                    <SelectItem value="Commenter">
                      Commenter - Can comment only
                    </SelectItem>
                    <SelectItem value="Viewer">
                      Viewer - Can only view
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notify"
                  checked={notifyPeople}
                  onCheckedChange={(checked) => setNotifyPeople(!!checked)}
                />
                <Label htmlFor="notify">Notify people</Label>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => handleInvite("")}>Send invite</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Find a collaborator or group"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by permission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All permissions</SelectItem>
                <SelectItem value="creator">Creator</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="commenter">Commenter</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Collaborator</TableHead>
                <TableHead>Permission</TableHead>
                <TableHead>Invited by</TableHead>
                <TableHead className="text-right">Invited</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCollaborators.map((collab) => (
                <TableRow key={collab.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {collab.name[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{collab.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {collab.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select defaultValue={collab.role.toLowerCase()}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="creator">Creator</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="commenter">Commenter</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{collab.invitedBy}</TableCell>
                  <TableCell className="text-right">{collab.invitedAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Remove access</DropdownMenuItem>
                        <DropdownMenuItem>Copy email</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AccessSettings;
