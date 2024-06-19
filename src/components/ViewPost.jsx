import { useEffect, useState } from 'react'
import { GetOnePost } from '../services/PostServices'
import { useParams } from 'react-router-dom'
import {
  addComment,
  updateComment,
  deleteComment
} from '../services/CommentServices'

const ViewPost = ({ user }) => {
  const [post, setPost] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [editingCommentIndex, setEditingCommentIndex] = useState(-1)
  const [editedComment, setEditedComment] = useState('')
  const [commentToDelete, setCommentToDelete] = useState(-1)
  const { id } = useParams() //post id

  const handleAddComment = () => {
    if (newComment.trim() !== '') {
      console.log("user", user);
      const data = { comment: newComment.trim(), user: user.id }
      addComment(id, data)
      setNewComment('')
    }
  }

  const handleEditComment = (index) => {
    setEditingCommentIndex(index)
    setEditedComment(post.comments[index].comment)
  }

  const handleUpdateComment = () => {
    if (editedComment.trim() !== '') {
      updateComment(editingCommentIndex, editedComment.trim())
      setEditingCommentIndex(-1)
      setEditedComment('')
    }
  }

  const handleDeleteComment = (index) => {
    setCommentToDelete(index)
  }

  const handleConfirmDeleteComment = () => {
    deleteComment(commentToDelete)
    setCommentToDelete(-1)
  }

  const handleCancelDeleteComment = () => {
    setCommentToDelete(-1)
  }

  const getPost = async () => {
    try {
      const post = await GetOnePost(id)
      setPost(post)
    } catch (error) {
      console.error('Error getting user plans:', error)
    }
  }

  useEffect(() => {
    console.log('using effect')
    getPost()
  }, [id])

  return post ? (
    <div>
      <h3>Published By {post.name}</h3>
      <h3>{post.title}</h3>
      <p>{post.caption}</p>
      <div>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button onClick={handleAddComment}>Add Comment</button>
      </div>
      <details>
        <summary>Comments</summary>
        {post.comments.map((comment, index) => (
          <div key={index}>
            <div className="user">
              <img src="avatar" alt="avatar" />
              {comment.user}
            </div>
            {editingCommentIndex === index ? (
              <div>
                <input
                  type="text"
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                />
                <button onClick={handleUpdateComment}>Update</button>
                <button onClick={() => setEditingCommentIndex(-1)}>
                  Cancel
                </button>
              </div>
            ) : commentToDelete === index ? (
              <div>
                <p>Are you sure you want to delete this comment?</p>
                <button onClick={handleConfirmDeleteComment}>Confirm</button>
                <button onClick={handleCancelDeleteComment}>Cancel</button>
              </div>
            ) : (
              <div>
                <p>{comment.comment}</p>
                <button onClick={() => handleEditComment(index)}>Edit</button>
                <button onClick={() => handleDeleteComment(index)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
        {/* add comment */}
      </details>
    </div>
  ) : (
    <div>LOADING</div>
  )
}

export default ViewPost
