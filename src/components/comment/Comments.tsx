import axios from "axios";
import { type } from "os";
import React, { useState, useEffect } from "react";
import { AppConstants } from "../../app/common/app.constants";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import "./style.css";
//
type CommentsProp = {
  currentUserId?: number;
  postId: number;
};

export type CommentClass = {
  id: number;
  parentId: number;
  userId: number;
  postId: number;
  datePosted: string;
  body: string;
};

export type UserClass = {
  id: number,
  email: string,
  displayName: string,
  imageUrl: string
}

export type CommentUserClass = {
    commentDTO: CommentClass,
    userDTO: UserClass
}

export type ActiveCommentClass = {
  id: number;
  type: "replying" | "editing";
};

function Comments({ currentUserId, postId }: CommentsProp) {
  const [backendCommentUsers, setBackendCommentUsers] = useState<CommentUserClass[]>([]);
  const [isReloaded, setIsReloaded] = useState(false);
  const [activeComment, setActiveComment] = useState<ActiveCommentClass | null>(
    null
  );



  // this variable below shows the roots comments without parent id
  const rootCommentUsers = backendCommentUsers.filter(
    
    (backendCommentUser) => {
      return backendCommentUser.commentDTO.parentId === 0
    }
  );

  const getReplies = (commentId: number) => {

    return backendCommentUsers
    .filter((backendCommentUser) => backendCommentUser.commentDTO.parentId === commentId)
    .sort(
      (a: CommentUserClass, b: CommentUserClass) =>
        new Date(a.commentDTO.datePosted).getTime() - new Date(b.commentDTO.datePosted).getTime()
    );
  };

  var getAllCommentsAPI = AppConstants.COMMENT_URL + "getAllComments/postId=" + postId;
  var createCommentAPI = AppConstants.COMMENT_URL + "createComment";
  var deleteCommentAPI = AppConstants.COMMENT_URL + "deleteComment/id=";
  var updateCommentAPI = AppConstants.COMMENT_URL + "updateComment/id=";

  useEffect(() => {
    if (isReloaded) {
      return;
    }

    axios.get(getAllCommentsAPI).then((res) => {
      console.log(res.data);
      setBackendCommentUsers(res.data)
    });

    setIsReloaded(true);
  }, [isReloaded]);

  const addComment = (text: string, parentId: number) => {
    console.log("addComment: ", text, parentId);

    var commentObj = {
      parentId: parentId,
      userId: currentUserId,
      postId: postId,
      datePosted: "date",
      body: text,
    };

    // create comment
    axios.post(createCommentAPI, commentObj).then((res) => {
      setBackendCommentUsers([{commentDTO: res.data.commentDTO , userDTO: res.data.userDTO }, ... backendCommentUsers])
      setIsReloaded(false);
      setActiveComment(null);
    });
  };

  // delete the comment
  const deleteComment = (commentId: number) => {
    if (window.confirm("Are you sure that you want to remove comment ?")) {
      axios.delete(deleteCommentAPI + commentId).then((res) => {
        setIsReloaded(false);
      });
    }
  };

  const updateComment = (text: string, commentId: number) => {
    axios.put(updateCommentAPI + commentId + "/body=" + text).then((res) => {
      console.log(res.data);


      var updatedBackendCommentUsers: CommentUserClass[];

      updatedBackendCommentUsers = backendCommentUsers.map((backendCommentUser) => {
        if (backendCommentUser.commentDTO.id === commentId) {
          return { commentDTO: { ... backendCommentUser.commentDTO, body: text }, userDTO: {... backendCommentUser.userDTO}};
        }
        return backendCommentUser;
      });

      setBackendCommentUsers(updatedBackendCommentUsers);
      setActiveComment(null);
    });
  };

  return (
    <div className="comments">
      <div>

      
      <h3 className="comments-title">Comments</h3>

      <div className="comment-form-title">Write Comment</div>
      <CommentForm
        submitLabel="Write"
        handleSubmit={addComment}
        hasCancelButton = {false}
        initialText={""}
        handleCancel={() => setActiveComment(null)}
      />
      <div className="comments-container">

        {rootCommentUsers.length}
        {rootCommentUsers.map((rootCommentUser) => (
          <Comment
            key={rootCommentUser.commentDTO.id}
            commentUser={rootCommentUser}
            replies={getReplies(rootCommentUser.commentDTO.id)}
            backendCommentUsers={backendCommentUsers}
            currentUserId={currentUserId}
            deleteComment={deleteComment}
            updateComment={updateComment}
            activeComment={activeComment}
            setActiveComment={setActiveComment}
            parentId={rootCommentUser.commentDTO.id}
            addComment={addComment}
          />
        ))}
      </div>
      </div>
    </div>
  );
}

export default Comments;
