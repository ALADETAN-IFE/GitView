import Typography from "./../components/typography";
import { Input } from "./../components/input";
import { Button } from "./../components/button";
import { useState } from "react";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { searchUsers } from "../api/github";
import useDebounce from "../hooks/debounce";

const HomePage = () => {
  const [username, setUsername] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  console.log("Page:", page);
  console.log("Total Pages:", totalPage);

  // Debounce the username input to limit API calls on every keystroke
  const debouncedUsername = useDebounce(username, 500);

  // Create a client
  const queryClient = new QueryClient();

  // Queries
  const { isPending, isError, data, error } = useQuery({
  queryKey: ["usernameFetch", debouncedUsername],
  queryFn: () => searchUsers(debouncedUsername, page),
    // enabled: !!username, // Only run the query if username is not empty
    onSuccess: (data) => {
      if (data && data.total_count) {
        setTotalPage(Math.floor(data.total_count / 10)); // GitHub API returns 10 results per page
      }
    }
  });
  console.log("IsError:", isError);
  console.log("Error:", error);

  // Mutations
  const mutation = useMutation({
    mutationFn: () => searchUsers(username, page),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["usernameFetch"] });
    },
  });

  setTotalPage(Math.ceil(data?.total_count / 10))

  const gitUsers = data?.items?.slice((page - 1) * 10, page * 10);
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col items-center justify-center max-w-2xl gap-6">
        <Typography variant="h1">GitView: A GitHub Explorer</Typography>
        <Typography variant="p" className="text-center">
          A modern GitHub user and repository explorer built with **React
          Query**, optimized for API caching, background refetching, and fast
          performance.
        </Typography>
        <div className="flex w-full gap-4 justify-center">
          <Input
            placeholder="Search for users or repositories..."
            type="text"
            className="min-w-2xs"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button onClick={() => mutation.mutate()}>Search</Button>
        </div>
        <div>
          {username && (
            <Typography variant="p">Searching for: {username}</Typography>
          )}
        </div>
      </div>
      {isPending ||
        isError ||
        data?.total_count >= 0 ? (
          <div className="flex flex-col items-center justify-center w-2xl gap-6 bg-amber-50/35 rounded-md p-2">
            {isPending && <Typography variant="p">Loading...</Typography>}
            {isError && (
              <Typography variant="p">
                An error occurred: {error?.message == `API rate limit exceeded for 129.205.124.211. (But here's the good news: Authenticated requests get a higher rate limit. Check out the documentation for more details.)` ? "Please try again in 2 mins" : error?.message}
              </Typography>
            )}
            {data && data.total_count === 0 && (
              <Typography variant="p">No users found.</Typography>
            )}
            {data && data.items && data.total_count >= 1 && (
              <Typography variant="p">
                {data.total_count} users found.
              </Typography>
            )}
            {data &&
              gitUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 bg-amber-300/45 p-2 rounded-md w-full"
                >
                  <img
                    src={user.avatar_url}
                    alt={`${user.login}'s avatar`}
                    className="w-10 h-10 rounded-full"
                  />
                  <Typography variant="p">{user.login}</Typography>
                </div>
              ))}
            {data && data.total_count > 30 && (
              <div className="flex gap-2">
                <Button
                  onClick={() => setPage((prev) => prev - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={page === totalPage}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        ) : null}
    </div>
  );
};

export default HomePage;
