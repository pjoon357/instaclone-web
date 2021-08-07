import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FatText } from "../shared";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
    }
  }
`;

const CommentContainer = styled.div``;
const CommentCaption = styled.span`
  margin-left: 10px;
  a {
    background-color: inherit;
    color: ${(props) => props.theme.accent};
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

function Comment({ id, photoId, isMine, author, payload }) {
    const deleteCommentUpdate = (cache, result) => {
        const { data: { deleteComment: { ok } } } = result;
        if (ok) {
            cache.evict({ id: `Comment:${id}` });
            cache.modify({
                id: `Photo:${photoId}`,
                fields: {
                    totalComments(prev) {
                        return prev - 1;
                    },
                },
            });
        }
    };

    const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
        variables: {
            id,
        },
        update: deleteCommentUpdate,
    });

    const onDeleteClick = () => {
        deleteComment();
    }
    return (
        <>
            {payload ?
                <CommentContainer>
                    <FatText>{author}</FatText>
                    <CommentCaption>
                        {payload?.split(" ").map((word, index) =>
                            /#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/g.test(word) ? (
                                <React.Fragment key={index}>
                                    <Link to={`/hashtags/${word}`}>{word}</Link>{" "}
                                </React.Fragment>
                            ) : (
                                <React.Fragment key={index}>{word} </React.Fragment>
                            )
                        )}
                    </CommentCaption>
                    {isMine ? <button onClick={onDeleteClick}>❌</button> : null}
                </CommentContainer> : null
            }
        </>

    );
}

Comment.propTypes = {
    id: PropTypes.number,
    photoId: PropTypes.number,
    isMine: PropTypes.bool,
    author: PropTypes.string.isRequired,
    payload: PropTypes.string,
};

export default Comment;