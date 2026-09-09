import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

// CommentSection component.
function CommentSection({ videoId, comments, onCommentChange }) {
    // Get the logged-in user.
    const { user } = useAuth();
    // Store new comment text.
    const [text, setText] = useState("");
    // Store the comment ID currently being edited.
    const [editingId, setEditingId] = useState(null);
    // Store edited comment text.
    const [editText, setEditText] = useState("");
    // Store error message.
    const [error, setError] = useState("");

    // Add a new comment.
    const addComment = async (event) => {
        // Prevent page refresh.
        event.preventDefault();

        // Check if the user is logged in.
        if (!user) {
            setError("Please login to comment");
            return;
        }

        // Check if the comment is empty.
        if (!text.trim()) {
            setError("Comment cannot be empty");
            return;
        }

        try {
            // Send the new comment to the backend.
            await api.post("/comments", {
                videoId,
                text: text.trim(),
                timestamp: new Date(),
                isPinned: false
            });

            // Clear the comment input.
            setText("");

            // Clear the error message.
            setError("");

            // Refresh the comments list.
            onCommentChange();
        } catch (error) {
            // Display backend error message.
            setError(
                error.response?.data?.message ||
                "Failed to add comment"
            );
        }
    };

    // Start editing a comment.
    const startEdit = (comment) => {
        setEditingId(comment.commentId || comment._id);
        setEditText(comment.text);
        setError("");
    };

    // Update an existing comment.
    const updateComment = async (commentId) => {
        try {
            // Check empty edited comment. 
            if (!editText.trim()) {
                setError("Comment cannot be empty");
                return;
            }
            // Send updated comment text to the backend.
            await api.put(
                `/comments/${commentId}`,
                {
                    text: editText.trim()
                }
            );

            // Exit edit mode.
            setEditingId(null);

            // Clear edited text.
            setEditText("");
            // Clear error.
            setError("");
            // Refresh the comments list.
            onCommentChange();
        } catch (error) {
            // Display backend error message.
            setError(
                error.response?.data?.message ||
                "Failed to update comment"
            );
        }
    };
    //Cancel 
    // Delete a comment.
    const deleteComment = async (commentId) => {
        // Ask the user for confirmation.
        const confirmed = window.confirm(
            "Delete this comment?"
        );

        // Stop if the user cancels.
        if (!confirmed) {
            return;
        }

        try {
            // Delete the comment from the backend.
            await api.delete(
                `/comments/${commentId}`
            );
            // Clear error. 
            setError("");
            // Refresh the comments list.
            onCommentChange();
        } catch (error) {
            // Display backend error message.
            setError(
                error.response?.data?.message ||
                "Failed to delete comment"
            );
        }
    };

    return (
        <section className="comments-section">
            <h2>
                Comments
            </h2>

            {/* Display error message. */}
            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {/* Show comment form for logged-in users. */}
            {user ? (
                <form
                    className="comment-form"
                    onSubmit={addComment}
                >
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={text}
                        onChange={(event) =>
                            setText(event.target.value)
                        }
                    />

                    <button type="submit">
                        Comment
                    </button>
                </form>
            ) : (
                /* Show login message for logged-out users. */
                <p>
                    Please login to comment.
                </p>
            )}

            {/* Display all comments. */}
            <div className="comments-list">
                {/* Show message when there are no comments. */}
                {comments?.length === 0 && (
                    <p>
                        No comments yet.
                    </p>
                )}

                {/* Loop through the comments. */}
                {comments?.map((comment) => {
                    const commentId = comment.commentId || comment._id;
                    const isOwner = user && String(user.userId) === String(comment.userId);
                    return (<div
                        key={commentId}
                        className="comment"
                    >
                        <div className="comment-content">


                            {/* Show input when editing the comment. */}
                            {editingId === commentId ? (
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={(event) =>
                                        setEditText(
                                            event.target.value
                                        )
                                    }
                                />
                            ) : (
                                /* Display the comment text. */
                                <p>
                                    {comment.text}
                                </p>
                            )}
                        </div>

                        {/* Show edit and delete actions for the comment owner. */}
                        {isOwner && (
                            <div className="comment-actions">
                                {/* Show Save and Cancel buttons while editing. */}
                                {editingId === commentId ? (
                                    <>  {/*Save*/}
                                        <button type="button"
                                            onClick={() =>
                                                updateComment(commentId
                                                )
                                            }
                                        >
                                            Save
                                        </button>
                                        {/*Cancel Button*/}

                                        <button type="button"
                                            onClick={() => {
                                                setEditingId(null);
                                                setEditText("");
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (

                                    <>
                                        {/*Edit button*/}
                                        <button type="button"
                                            onClick={() =>
                                                startEdit(comment)
                                            }
                                        >
                                            Edit
                                        </button>
                                        {/*Delete Button*/}
                                        <button type="button"
                                            onClick={() =>
                                                deleteComment(commentId)
                                            }>
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    );

                })}
            </div>
        </section>
    );
}

// Export CommentSection component.
export default CommentSection;
