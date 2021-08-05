import { gql, useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import Photo from "./Photo";


const FEED_QUERY = gql`
    query seeFeed {
    seeFeed {
      id
      user {
        username
        avatar
      }
      file
      caption
      likes
      comments
      createdAt
      isMine
      isLiked
    }
  }
`;



function Home() {
    const { data } = useQuery(FEED_QUERY);
    const history = useHistory();
    return (
        <div>
            <PageTitle title="Home" />
            {data?.seeFeed?.map((photo) => <Photo key={photo.id} {...photo} />)}
        </div>
    );
}

export default Home;