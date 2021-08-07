import PropTypes from "prop-types";
import { faBookmark, faComment, faHeart, faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { faHeart as SolidHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import Avatar from "../Avatars";
import { FatText } from "../shared";
import { gql, useMutation } from "@apollo/client";
import Comments from "./Comments";
import { Link } from "react-router-dom";

const TOGGLE_LIKE_MUTAITON = gql`
    mutation toggleLike($id:Int!){
        toggleLike(id:$id){
            ok
            error
        }
    }
`;

const PhotoContainer = styled.div`
  background-color: white;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.borderColor};
  margin-bottom: 60px;
  max-width: 615px;
`;
const PhotoHeader = styled.div`
  padding: 15px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(239, 239, 239);
`;

const Username = styled(FatText)`
  margin-left: 15px;
`;

const PhotoFile = styled.img`
  min-width: 100%;
  max-width: 100%;
`;

const PhotoData = styled.div`
  padding: 12px 15px;
`;

const PhotoActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  div {
    display: flex;
    align-items: center;
  }
  svg {
    font-size: 20px;
  }
`;

const PhotoAction = styled.div`
  margin-right: 10px;
  cursor: pointer;
`;

const Likes = styled(FatText)`
  margin-top: 15px;
  display: block;
`;

function Photo({ id, user, file, isLiked, likes, caption, totalComments, comments }) {
    const updateToggleLike = (cache, result) => {
        const { data: { toggleLike: { ok } } } = result;
        if (ok) {
            const photoId = `Photo:${id}`;
            cache.modify({
                id: photoId,
                fields: {
                    isLiked(prev) {
                        return !prev;
                    },
                    likes(prev) {
                        if (isLiked) {
                            return prev - 1;
                        }
                        else {
                            return prev + 1;
                        }
                    }
                }
            });
        }
    };

    const [toggleLikeMutation] = useMutation(TOGGLE_LIKE_MUTAITON, {
        variables: {
            id,
        },
        update: updateToggleLike,
    });

    return (
        <PhotoContainer key={id}>
            <PhotoHeader>
                <Link to={`/users/${user.username}`}>
                    <Avatar lg url={user.avatar} />
                </Link>
                <Link to={`/users/${user.username}`}>
                    <Username>{user.username}</Username>
                </Link>
            </PhotoHeader>
            <PhotoFile src={file} />
            <PhotoData>
                <PhotoActions>
                    <div>
                        <PhotoAction onClick={toggleLikeMutation}>
                            <FontAwesomeIcon
                                style={{ color: isLiked ? "tomato" : "inherit" }}
                                icon={isLiked ? SolidHeart : faHeart}
                            />
                        </PhotoAction>
                        <PhotoAction>
                            <FontAwesomeIcon icon={faComment} />
                        </PhotoAction>
                        <PhotoAction>
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </PhotoAction>
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faBookmark} />
                    </div>
                </PhotoActions>
                <Likes>
                    {`${likes}명이 좋아합니다`}
                </Likes>
                <Comments
                    photoId={id}
                    author={user.username}
                    caption={caption}
                    totalComments={totalComments}
                    comments={comments}
                />
            </PhotoData>
        </PhotoContainer>
    );
}

Photo.propTypes = {
    id: PropTypes.number.isRequired,
    user: PropTypes.shape({
        username: PropTypes.string.isRequired,
        avatar: PropTypes.string,
    }),
    file: PropTypes.string.isRequired,
    isLiked: PropTypes.bool.isRequired,
    likes: PropTypes.number.isRequired,
    totalComments: PropTypes.number.isRequired,
    caption: PropTypes.string,
};

export default Photo;