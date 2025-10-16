import { useParams } from "react-router-dom";

const RepoPage = () => {
  const { owner, repo } = useParams();
  return (
    <div>
      Repo Page: {owner}/{repo}
    </div>
  );
};
export default RepoPage;
