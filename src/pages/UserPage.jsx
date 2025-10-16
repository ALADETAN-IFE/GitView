import { useParams } from "react-router-dom";

const UserPage = () => {
  const { username } = useParams();

  return <div>User Page: {username}</div>;
};

export default UserPage;
