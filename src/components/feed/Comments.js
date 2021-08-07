import { gql, useMutation } from "@apollo/client";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import useUser from "../hooks/useUser";
import Comment from "./Comment";

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($photoId: Int!, $payload: String!) {
    createComment(photoId: $photoId, payload: $payload) {
      ok
      error
      id
    }
  }
`;


const CommentsContainer = styled.div`
  margin-top: 20px;
`;
const CommentCount = styled.span`
  opacity: 0.7;
  margin: 10px 0px;
  display: block;
  font-weight: 600;
  font-size: 10px;
`;

const PostCommentContainer = styled.div`
  margin-top: 10px;
  padding-top: 15px;
  padding-bottom: 10px;
  border-top: 1px solid ${(props) => props.theme.borderColor};
`;

const PostCommentInput = styled.input`
  width: 100%;
  &::placeholder {
    font-size: 12px;
  }
`;

function Comments({ photoId, author, caption, totalComments, comments }) {
    const { data: userData } = useUser();
    const { register, handleSubmit, getValues, setValue } = useForm();
    const onValid = (data) => {
        if (loading) {
            return;
        }
        const { payload } = data;
        createComment({
            variables: {
                photoId,
                payload,
            }
        });
    };

    const createCommentUpdate = (cache, result) => {
        const { payload } = getValues();
        setValue("payload", "");
        const {
            data: {
                createComment: { ok, id },
            }
        } = result;
        if (ok && userData?.me) {
            const newComment = {
                __typename: "Comment",
                id,
                user: { ...userData.me },
                payload,
                isMine: true,
                createdAt: Date.now() + "",
            };
            const newCacheComment = cache.writeFragment({
                data: newComment,
                fragment: gql`
                    fragment any on Comment { 
                        id
                        user{
                            username
                            avatar
                        }
                        payload
                        isMine
                        createdAt
                    }
                `,
            });
            cache.modify({
                id: `Photo:${photoId}`,
                fields: {
                    totalComments(prev) {
                        return prev + 1;
                    },
                    comments(prev) {
                        return [...prev, newCacheComment];
                    }
                }
            });
        }
    };

    const [createComment, { loading }] = useMutation(CREATE_COMMENT_MUTATION, {
        update: createCommentUpdate,
    });

    return (
        <CommentsContainer>
            <Comment author={author} payload={caption} />
            <CommentCount>
                {totalComments === 1 ? "1 comment" : `${totalComments} comments`}
            </CommentCount>
            {comments?.map((comment) => (
                <Comment
                    key={comment.id}
                    author={comment.user.username}
                    payload={comment.payload}
                />
            ))}
            <PostCommentContainer>
                <form onSubmit={handleSubmit(onValid)}>
                    <PostCommentInput
                        {...register("payload", { required: true })}
                        type="text"
                        placeholder="Write a comment..."
                    />
                </form>
            </PostCommentContainer>
        </CommentsContainer>
    );
}

Comments.propTypes = {
    photoId: PropTypes.number.isRequired,
    author: PropTypes.string.isRequired,
    caption: PropTypes.string,
    totalComments: PropTypes.number.isRequired,
    comments: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            user: PropTypes.shape({
                avatar: PropTypes.string,
                username: PropTypes.string.isRequired,
            }),
            payload: PropTypes.string.isRequired,
            isMine: PropTypes.bool.isRequired,
            createdAt: PropTypes.string.isRequired,
        })
    ),
};

export default Comments;