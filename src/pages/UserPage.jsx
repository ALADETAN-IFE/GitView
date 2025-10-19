import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { dynamicFunc, getUser } from "../api/github";
import { Button } from "../components/button";
import Typography from "../components/typography";

const UserPage = () => {
  const { username } = useParams();

  const navigate = useNavigate();

  const { isPending: isUserPending, isError: isUserError, data: user, error: userError } = useQuery({
    queryKey: ["userFetch", username],
    queryFn: async () => {
      const data = await getUser(username);
      console.log("Fetched User Data:", data);
      return data;
    },
  });

  // Query to get user's followers
  const { isPending: isFollowerPending, isError: isFollowerError, data: follower, error: followerError } = useQuery({
    queryKey: ["userFollowerFetch"],
    queryFn: async () => {
      const data = await dynamicFunc("get", user.followers_url);
      console.log("Fetched User Follower:", data);
      return data;
    },
    enabled: !!user,
  });

  // Query to get people user is following
  const { isPending: isFollowingPending, isError: isFollowingError, data: following, error: followingError } = useQuery({
    queryKey: ["userFollowingFetch"],
    queryFn: async () => {
  //ser?.following_url retuns "https://api.github.com/users/USERNAME/following{/other_user}".
  // Strip the template part starting at the first "{" so we call a valid URL.
  const followingUrl = user?.following_url ? String(user.following_url).split('{')[0] : undefined;
  const data = await dynamicFunc("get", followingUrl);
      console.log("Fetched User Following:", data);
      return data;
    },
    enabled: !!user,
  });

  if (isUserPending) {
    return <div>Loading...</div>;
  }

  if (isUserError) {
    return <div>Error: {userError.message}</div>;
  }

  if (!user) {
    return <div>No user data available.</div>;
  }

  return (
    <div className="bg-pink-50/10 rounded-lg shadow-md flex flex-col gap-7 items-start w-full max-w-[100rem] h-fit">
      <Button onClick={() => navigate(-1)}>Go Back</Button>
      <section className="flex flex-col md:flex-row gap-14 items-start justify-between w-full py-4 px-9">
        <figure>
          <img
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
            className="min-w-52 min-h-52 w-52 h-52 rounded-full border-4"
            loading="lazy"
            decoding="async"
          />
        </figure>
        <div className="w-full md:w-3/4 lg:w-1/2 flex gap-3">
          <section className="flex flex-col gap-2 w-full">
            <Typography variant="h2" className="text-blue-500">
              {user.name}
            </Typography>
            <Typography variant="h4" className="font-normal text-gray-400">
              @{user.login}
            </Typography>
            <Typography variant="p">
              Bio:{" "}
              <span className="italic">
                {user.bio === null ? "No bio available" : user.bio}
              </span>
            </Typography>
            <Typography variant="p" id="public_repos">
              Public Repos:{" "}
              {user.public_repos === 0
                ? "No public repos available"
                : user.public_repos}
            </Typography>
            <nav className="flex flex-col md:flex-row gap-4">
              <Button asChild>
                <Link
                  to={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </Link>
              </Button>
              <Button>
                {/* <Link to={user.html_url}>View Repo</Link> */}
               View Repo
              </Button>
            </nav>
          </section>
          <section className="flex flex-col gap-2 min-w-fit mt-5">
            <Typography variant="p" id="followers">
              Followers: {user.followers}
            </Typography>
            <Typography variant="p" id="following">
              Following: {user.following}
            </Typography>
          </section>
        </div>
      </section>
      <section className="bg-pink-50/10 flex flex-col md:flex-row gap-14 items-start justify-between w-full py-4 px-9">
        <section>
          Followers:
          {isFollowerPending ? (
            <Typography variant="p">Loading followers...</Typography>
          ) : isFollowerError ? (
            <Typography variant="p">Error: {followerError.message}</Typography>
          ) : follower.length === 0 ? (
            <Typography variant="p">No followers found.</Typography>
          ) : (
            <ul>
              {follower.map((e) => (
                <li key={e.id}>
                  <Link to={`/users/${e.login}`}>{e.login}</Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          Following:
          {isFollowingPending ? (
            <Typography variant="p">Loading following...</Typography>
          ) : isFollowingError ? (
            <Typography variant="p">Error: {followingError.message}</Typography>
          ) : following.length === 0 ? (
            <Typography variant="p">No following found.</Typography>
          ) : (
            <ul>
              {following.map((e) => (
                <li key={e.id}>
                  <Link to={`/users/${e.login}`}>{e.login}</Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </div>
  );
};

export default UserPage;
