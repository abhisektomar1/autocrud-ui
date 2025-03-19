import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ActivityIcon,
  Clock,
  FileIcon,
  MessageSquareMore,
  User,
  // Trash2,
  X,
} from "lucide-react";
import {
  useCreateComment,
  useDeleteComment,
  useGetComments,
  useUpdateComment,
  useGetAttachments,
  useDownloadAttachments,
  useGetAuditLogs,
} from "@/queries/collabaration";
import { queryClient } from "@/queries/client";
import { toast } from "react-toastify";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { useMutation } from "react-query";
import { uploadAttachment } from "@/api/collabaration";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { CommentDataModel } from "@/types/model";

type TimeInterval = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

const CommentsAuditTabs = ({
  spaceId,
  tableId,
  rowId,
}: {
  spaceId: string;
  tableId: string;
  rowId: string;
}) => {
  const [comment, setComment] = useState("");
  const [editMode, setEditMode] = useState<{
    id: string;
    message: string;
  } | null>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(
    null
  );

  const { data: comments = [] } = useGetComments(spaceId, tableId, rowId);
  //  const { data: audits = [] } = useGetAuditLogs(spaceId, tableId, rowId)
  const { data: attachments = [] } = useGetAttachments(spaceId, tableId, rowId);
  const { data: auditlogs = [] } = useGetAuditLogs(spaceId, tableId, rowId);
  const { data, isError } = useDownloadAttachments(
    spaceId,
    tableId,
    rowId,
    selectedAttachment || ""
  );

  const handleDownload = (attachmentId: string) => {
    setSelectedAttachment(attachmentId);
  };

  useEffect(() => {
    if (data && selectedAttachment) {
      try {
        const arrayBuffer =
          data instanceof ArrayBuffer ? data : new Uint8Array(data).buffer;

        const attachment = attachments.find((a) => a.id === selectedAttachment);

        const fileName = attachment?.name || `download-${selectedAttachment}`;
        const fileExtension = fileName.split(".").pop()?.toLowerCase();

        const mimeTypes: { [key: string]: string } = {
          pdf: "application/pdf",
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          png: "image/png",
          doc: "application/msword",
          docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          xls: "application/vnd.ms-excel",
          xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          txt: "text/plain",
        };

        const contentType = fileExtension
          ? mimeTypes[fileExtension] || "application/octet-stream"
          : "application/octet-stream";

        const blob = new Blob([arrayBuffer], { type: contentType });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);
      } catch (err) {
        void err;
      }

      setSelectedAttachment(null);
    }
  }, [data, selectedAttachment]);

  if (isError) {
    void isError;
  }

  const { mutate: postComment } = useCreateComment();
  const { mutate: updateComment } = useUpdateComment();
  const { mutate: deleteComment } = useDeleteComment();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("comments");

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadAttachment(spaceId, tableId, rowId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAttachments", spaceId, tableId, rowId],
      });
      toast("Image uploaded successfully", {
        autoClose: 2000,
        type: "success",
      });
      setSelectedFile(null);
      setUploadLoading(false);
    },
    onError: () => {
      toast("Failed to upload image", {
        autoClose: 2000,
        type: "error",
      });
      setUploadLoading(false);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      setUploadLoading(true);
      uploadMutation.mutate(selectedFile);
    } else {
      toast("Please select a file first", {
        autoClose: 2000,
        type: "warning",
      });
    }
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      setLoading(true);
      postComment(
        {
          spaceId,
          tableId,
          rowId,
          commentData: { message: comment },
        },
        {
          onSuccess() {
            queryClient.invalidateQueries([
              "getComments",
              spaceId,
              tableId,
              rowId,
            ]);
            setComment("");
            toast("Comment Added Successfully", {
              autoClose: 2000,
              type: "success",
            });
            setLoading(false);
          },
          onError() {
            toast("Unable to Comment", {
              autoClose: 2000,
              type: "error",
            });
            setLoading(false);
          },
        }
      );
    }
  };

  const handleUpdateComment = (id: string, newMessage: string) => {
    updateComment(
      {
        spaceId,
        tableId,
        rowId,
        commentId: id,
        commentData: { message: newMessage },
      },
      {
        onSuccess() {
          queryClient.invalidateQueries([
            "getComments",
            spaceId,
            tableId,
            rowId,
          ]);
          setEditMode(null);
          toast("Comment Updated Successfully", {
            autoClose: 2000,
            type: "success",
          });
        },
        onError() {
          toast("Unable to Update Comment", {
            autoClose: 2000,
            type: "error",
          });
        },
      }
    );
  };

  const handleDeleteComment = (commentId: string) => {
    deleteComment(
      {
        spaceId,
        tableId,
        rowId,
        commentId,
      },
      {
        onSuccess() {
          queryClient.invalidateQueries([
            "getComments",
            spaceId,
            tableId,
            rowId,
          ]);
          toast("Comment Deleted Successfully", {
            autoClose: 2000,
            type: "success",
          });
        },
        onError() {
          toast("Unable to Delete Comment", {
            autoClose: 2000,
            type: "error",
          });
        },
      }
    );
  };

  const formatRelativeTime = (date: string | Date | number): string => {
    const now = new Date();
    const diffInSeconds: number = Math.floor(
      (now.getTime() - new Date(date).getTime()) / 1000
    );

    const intervals: TimeInterval = {
      year: 31536000,
      month: 2592000,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };

    if (diffInSeconds < 0) {
      return "in the future";
    }

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const difference: number = Math.floor(diffInSeconds / secondsInUnit);

      if (difference >= 1) {
        return `${difference} ${unit}${difference === 1 ? "" : "s"} ago`;
      }
    }

    return "just now";
  };

  return (
    <Card className="w-full pr-0 h-full border-0 bg-transparent">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="relative w-full flex flex-col-reverse md:flex-row-reverse h-full"
      >
        <TabsList className=" h-full flex flex-row md:flex-col p-0 justify-start bg-gray-50 gap-3 border-l border-gray-100">
          <TabsTrigger
            value="comments"
            className={cn(
              "bg-transparent h-14 w-full flex items-center justify-center",
              "data-[state=active]:bg-white data-[state=active]:border-r-2 data-[state=active]:border-blue-500",
              "transition-all duration-200"
            )}
          >
            <MessageSquareMore
              size={18}
              className={
                activeTab === "comments" ? "text-blue-500" : "text-gray-400"
              }
            />
          </TabsTrigger>
          <TabsTrigger
            value="audit"
            className={cn(
              "bg-transparent h-14 w-full flex items-center justify-center",
              "data-[state=active]:bg-white data-[state=active]:border-r-2 data-[state=active]:border-blue-500",
              "transition-all duration-200"
            )}
          >
            <ActivityIcon
              size={18}
              className={
                activeTab === "audit" ? "text-blue-500" : "text-gray-400"
              }
            />
          </TabsTrigger>
          <TabsTrigger
            value="attachments"
            className={cn(
              "bg-transparent h-14 w-full flex items-center justify-center",
              "data-[state=active]:bg-white data-[state=active]:border-r-2 data-[state=active]:border-blue-500",
              "transition-all duration-200"
            )}
          >
            <FileIcon
              size={18}
              className={
                activeTab === "attachments" ? "text-blue-500" : "text-gray-400"
              }
            />
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="comments"
          className="h-[calc(100%-16px)] w-full pb-0 mt-0"
        >
          <div className="flex flex-col gap-1 w-full h-full space-y-1 pb-0">
            <div className="p-4 border-b">
              <h3 className="text-sm font-medium text-gray-700">Comments</h3>
              <p className="text-xs text-gray-500 mt-1">
                Collaborate with your team
              </p>
            </div>
            <ScrollArea className="flex-1 pb-[60px] h-full">
              <div className="flex flex-col gap-2">
                {comments && comments.length > 0 ? (
                  <AnimatePresence mode="popLayout">
                    {(comments ?? [])
                      .sort(
                        (
                          a: Partial<CommentDataModel>,
                          b: Partial<CommentDataModel>
                        ) =>
                          new Date(b.createdAt ?? "").getTime() -
                          new Date(a.createdAt ?? "").getTime()
                      )
                      .map((comment: Partial<CommentDataModel>, index) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                              delay: index * 0.05,
                              duration: 0.25,
                            },
                          }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <div className="mx-2 p-3 bg-sky-100 relative group rounded-lg transition-colors group">
                            {editMode?.id === comment.id ? (
                              <div className="flex gap-2">
                                <Input
                                  value={editMode?.message}
                                  disabled={loading}
                                  onChange={(e) =>
                                    setEditMode(
                                      editMode
                                        ? {
                                            ...editMode,
                                            message: e.target.value,
                                          }
                                        : { id: "", message: e.target.value }
                                    )
                                  }
                                  className="flex-1"
                                />
                                <Button
                                  onClick={() =>
                                    handleUpdateComment(
                                      comment.id ?? "",
                                      editMode?.message ?? ""
                                    )
                                  }
                                  variant="secondary"
                                  size="sm"
                                >
                                  Save
                                </Button>
                                <Button
                                  onClick={() => setEditMode(null)}
                                  variant="outline"
                                  size="sm"
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="text-blue-600 font-semibold text-sm">
                                    {(comment.message ?? "")
                                      .charAt(0)
                                      .toUpperCase() +
                                      (comment.message ?? "").slice(1)}
                                  </p>
                                  <div className="flex justify-between gap-1 text-gray-600 items-center">
                                    <p className="text-xs">
                                      {comment.createdBy ?? ""}
                                    </p>
                                    <p className="text-xs">
                                      {comment.createdAt
                                        ? formatRelativeTime(comment.createdAt)
                                        : ""}
                                    </p>
                                  </div>
                                </div>
                                {/* <Button
                          className="p-1 px-2 bg-red-400 hover:bg-red-500 text-black"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Trash2 size={10} />
                        </Button> */}
                                <div
                                  className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                  onClick={() =>
                                    handleDeleteComment(comment.id ?? "")
                                  }
                                >
                                  <X className="w-4 h-4 text-gray-500 hover:text-gray-800" />
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="flex flex-col items-center justify-center h-[400px] text-center px-4">
                      <div className="w-10 h-10 rounded-full bg-accent-foreground/10 flex items-center justify-center mb-4 border">
                        <MessageSquareMore className="h-4 w-4 text-accent-foreground/50" />
                      </div>
                      <h3 className="text-sm font-medium text-text">
                        No comments yet
                      </h3>
                      <p className="text-xs text-gray-500 mt-2 max-w-xs">
                        Be the first to add a comment and start the discussion
                        with your team.
                      </p>
                      <div className="mt-5 border-primary/20 text-blue-600 bg-primary/10 p-2 text-xs rounded-md">
                        Add your first comment
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="flex gap-2 p-4 absolute   bottom-0 w-full mb-0 bg-background border-t">
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
              />
              <Button
                onClick={handleAddComment}
                variant="secondary"
                className="px-6 border"
              >
                Add
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="audit" className="h-[calc(100%-48px)] w-full mt-0">
          <div className="flex flex-col w-full h-full space-y-4 pb-0">
            <div className="p-4 border-b ">
              <h3 className="text-sm font-medium text-gray-700">Audit Logs</h3>
              <p className="text-xs text-gray-500 mt-1">
                Track all changes to this record
              </p>
            </div>
            <ScrollArea className="flex-1 pb-6 px-2">
              <div className="relative pl-5 border-gray-200 ml-4">
                {auditlogs && auditlogs.length > 0 ? (
                  <AnimatePresence mode="popLayout">
                    {(auditlogs ?? [])
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )
                      .map((log, index) => (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            transition: {
                              delay: index * 0.1,
                              duration: 0.25,
                            },
                          }}
                          className="mb-6 relative"
                        >
                          <div className="absolute -left-[19px] top-0 w-8 h-8 bg-white border-2 border-blue-200 rounded-full flex items-center justify-center">
                            <ActivityIcon className="h-4 w-4 text-blue-500" />
                          </div>
                          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 ml-4">
                            <p className="text-sm text-gray-800">
                              {log.action}
                            </p>
                            <div className="flex justify-between mt-2 text-gray-500">
                              <div className="flex items-center gap-1.5">
                                <User className="h-3 w-3" />
                                <p className="text-xs">{log.createdBy}</p>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-3 w-3" />
                                <p className="text-xs">
                                  {formatRelativeTime(log.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="flex flex-col items-center justify-center h-[400px] text-center px-4">
                      <div className="w-10 h-10 rounded-full bg-accent-foreground/10 flex items-center justify-center mb-4 border">
                        <ActivityIcon className="h-4 w-4 text-accent-foreground/50" />
                      </div>
                      <h3 className="text-sm font-medium text-text">
                        Activity history empty
                      </h3>
                      <p className="text-xs text-gray-500 mt-2 max-w-xs">
                        Changes to this record will be tracked and displayed
                        here automatically.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
        <TabsContent
          value="attachments"
          className="h-[calc(100%-48px)] w-full mt-0 pb-0"
        >
          <div className="flex flex-col w-full h-full space-y-1 pb-0">
            <div className="p-4 border-b">
              <h3 className="text-sm font-medium text-gray-700">Attachments</h3>
              <p className="text-xs text-gray-500 mt-1">
                Upload and manage images
              </p>
            </div>
            <ScrollArea className="flex-1 pb-[60px]">
              <div className="flex flex-col gap-2 px-2 pt-1">
                {attachments && attachments.length > 0 ? (
                  <AnimatePresence>
                    {attachments &&
                      attachments.map((attachment, index) => (
                        <motion.div
                          key={attachment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                              delay: index * 0.05,
                              duration: 0.25,
                            },
                          }}
                        >
                          <div className="flex flex-col gap-1 justify-center bg-sky-100 rounded-md p-3 ">
                            {/* <img
                      className="w-28 h-28 object-cover rounded-lg"
                      src={attachment.publicUrl.url as string}
                      alt="Attachment"
                    /> */}

                            <div
                              className="text-blue-600 text-sm hover:underline text-left bg-none font-semibold cursor-pointer"
                              onClick={() => handleDownload(attachment.id)}
                            >
                              {attachment.name}
                            </div>
                            <div className="flex-1 flex justify-between gap-1 text-gray-600 text-xs">
                              <div className="flex items-center gap-2">
                                {/* <span className="font-medium">Created By:</span> */}
                                <span>{attachment.createdBy}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {/* <span className="font-medium">Created at:</span> */}
                                <span>
                                  {formatRelativeTime(attachment.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="flex flex-col items-center justify-center h-[400px] text-center px-4">
                      <div className="w-10 h-10 rounded-full bg-accent-foreground/10 flex items-center justify-center mb-4 border">
                        <FileIcon className="h-4 w-4 text-accent-foreground/50" />
                      </div>
                      <h3 className="text-sm font-medium text-text">
                        No files attached
                      </h3>
                      <p className="text-xs text-gray-500 mt-2 max-w-xs">
                        Upload documents, images, and other files to share with
                        your team.
                      </p>
                      <div className="mt-5 border-primary/20 text-blue-600 bg-primary/10 p-2 text-xs rounded-md">
                        Upload your attachments
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="flex gap-2 p-4 absolute bottom-0 w-full mb-0 bg-background border-t">
              <Input
                type="file"
                onChange={handleFileSelect}
                accept="image/*"
                className="flex-1"
                disabled={uploadLoading}
              />
              <Button
                onClick={handleUpload}
                variant="secondary"
                className="border border-gray-300"
                disabled={!selectedFile || uploadLoading}
              >
                {uploadLoading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default CommentsAuditTabs;
