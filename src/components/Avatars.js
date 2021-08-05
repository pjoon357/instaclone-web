import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { faUser } from "@fortawesome/free-regular-svg-icons";

const SAvatar = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 15px;
  background-color: #2c2c2c;
  overflow: hidden;
`;

const Img = styled.img`
  max-width: 100%;
`;

function Avatar({ url = "" }) {
    return <SAvatar>{url !== "" ? <Img src={url} /> : <FontAwesomeIcon icon={faUser} size="lg" />}</SAvatar>;
}
export default Avatar;