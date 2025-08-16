"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2, Edit2, Trash2, Check } from "lucide-react";
import { useAuth } from "../../providers/AuthContext";
import Modal from "../../components/Modal";

const CommentsModal = ({
  recipe,
  isOpen,
  onClose,
  onCommentSubmit,
  onCommentEdit,
  onCommentDelete,
}) => {
  const { user } = useAuth();
  const [newCommentText, setNewCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentShowFull, setCommentShowFull] = useState({});
  const commentInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setNewCommentText("");
      setEditingCommentId(null);
      setEditCommentText("");
    } else {
      setTimeout(() => commentInputRef.current?.focus(), 120);
    }
  }, [isOpen, recipe]);

  const handleSubmit = async () => {
    if (!newCommentText.trim()) return;
    setIsSubmitting(true);
    try {
      await onCommentSubmit(newCommentText);
      setNewCommentText("");
      commentInputRef.current?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (comment) => {
    setEditingCommentId(comment._id);
    setEditCommentText(comment.commentText);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditCommentText("");
  };

  const handleEditSubmit = async () => {
    if (!editCommentText.trim() || !editingCommentId) return;
    setIsSubmitting(true);
    try {
      await onCommentEdit(editingCommentId, editCommentText);
      cancelEditing();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setIsSubmitting(true);
      try {
        await onCommentDelete(commentId);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!recipe) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Comments (${recipe.comments?.length || 0})`}
    >
      <div className="space-y-4 pb-16">
        {recipe.comments && recipe.comments.length > 0 ? (
          recipe.comments.map((comment) => (
            <div
              key={comment._id}
              className="flex flex-col bg-gray-50 rounded-lg p-3 gap-2"
            >
              <div className="flex items-start gap-2">
                <img
                  src={
                    comment.userProfilePicture ||
                    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                  }
                  alt={comment.username}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-gray-800 text-sm">{comment.username}</p>

                    {user?.id === comment.userId && editingCommentId !== comment._id && (
                      <div className="flex gap-4">
                        <button
                          onClick={() => startEditing(comment)}
                          className="text-gray-500 hover:text-green-500 transition-colors cursor-pointer"
                          title="Edit comment"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(comment._id)}
                          className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                          title="Delete comment"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Comment Text or Edit Textarea */}
                  {editingCommentId === comment._id ? (
                    <div className="mt-1 flex flex-col gap-2">
                      <textarea
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-0"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleEditSubmit}
                          disabled={isSubmitting}
                          className="px-3 py-1 bg-green-600 text-white rounded-md flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                        >
                          {isSubmitting ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Check size={16} />
                          )}
                          <span>Save</span>
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1 flex flex-col gap-1">
                      <p
                        className={`text-gray-600 text-sm whitespace-pre-line ${commentShowFull[comment._id] ? "" : "line-clamp-4"
                          }`}
                      >
                        {comment.commentText}
                      </p>

                      {comment.commentText?.length > 100 && (
                        <button
                          onClick={() =>
                            setCommentShowFull((prev) => ({
                              ...prev,
                              [comment._id]: !prev[comment._id],
                            }))
                          }
                          className="text-green-600 text-xs font-medium hover:underline self-start"
                        >
                          {commentShowFull[comment._id] ? "See less" : "See more"}
                        </button>
                      )}

                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(comment.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
      {user ? (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 mt-4 p-4">
          <div className="flex items-center gap-2">
            <img
              src={
                user.profilePicture ||
                "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg"
              }
              alt={user.username}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 relative flex items-center ">
              <textarea
                ref={commentInputRef}
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Write a comment..."
                rows={1}
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg shadow-sm focus:ring-2 outline-0 focus:ring-green-500 focus:border-green-500 resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey && !isSubmitting) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                disabled={isSubmitting}
              />
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !newCommentText.trim()}
                className="absolute right-2 bottom-2 p-1 text-green-600 hover:text-green-800 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>

          </div>
        </div>
      ) : (
        <div className="p-4 border-t border-gray-200 text-center text-gray-500 mt-4">
          Please log in to leave a comment.
        </div>
      )}
    </Modal>
  );
};

export default CommentsModal;
