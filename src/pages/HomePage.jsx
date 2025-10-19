import Typography from "./../components/typography";
import { Input } from "./../components/input";
import { Button } from "./../components/button";
import { useState, useEffect } from "react";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { searchUsers } from "../api/github";
import useDebounce from "../hooks/debounce";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [username, setUsername] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [retryTime, setRetryTime] = useState(60);

  const navigate = useNavigate();

  // Debounce the username input to limit API calls on every keystroke
  const debouncedUsername = useDebounce(username, 500);

  // Create a client
  const queryClient = new QueryClient();

  // Queries
  const { isPending, isError, data, error } = useQuery({
  queryKey: ["usernameFetch", debouncedUsername, page],
  queryFn: async () => { 
    return searchUsers(debouncedUsername, page).then((data) => {
      setTimeout(() => setTotalPage(Math.ceil(data?.total_count / 10)), 1000);
      return data;
    });
  },
    // enabled: !!username, // Only run the query if username is not empty
    // onSuccess: (data) => {
    //   if (data && data.total_count) {
    //     setTotalPage(Math.floor(data.total_count / 10)); 
    //   }
    // }
  });

  useEffect(() => {
    // If there is no rate limit error, reset retryTime and do nothing
    if (!error?.message?.includes(`API rate limit exceeded`)) {
      setRetryTime(60);
      return;
    }

    // Start a 1-second countdown when rate limit error occurs
    const intervalId = setInterval(() => {
      setRetryTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Cleanup the interval when error changes or component unmounts
    return () => clearInterval(intervalId);
  }, [error]);

  // Mutations
  const mutation = useMutation({
    mutationFn: () => searchUsers(username, page),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["usernameFetch"] });
    },
  });


  const gitUsers = data?.items || [];
  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full max-w-[100rem] h-fit">
      <div className="flex flex-col items-center justify-center max-w-2xl gap-6">
        <Typography variant="h1" className="text-center">GitView: A GitHub Explorer</Typography>
        <Typography variant="p" className="text-center">
          A modern GitHub user and repository explorer built with <b className="text-blue-500">React
          Query</b>, optimized for API caching, background refetching, and fast
          performance.
        </Typography>
        <div className="flex w-full gap-4 justify-center @max-xs:flex-col">
          <Input
            placeholder="Search for users by name or username..."
            type="text"
            className="min-w-2xs"
            value={username}
            onChange={(e) => { setPage(1),setUsername(e.target.value) }}
          />
          <Button onClick={() => mutation.mutate()} disabled={!isError}>Search</Button>
        </div>
        <div>
          {username && (
            <Typography variant="p" className="">Searching for:
            <span className="max-w-xs inline-block truncate align-middle" title={username}>&nbsp;{username}</span></Typography>
          )}
        </div>
      </div>
      {isPending ||
        isError ||
        data?.total_count >= 0 ? (
          <div className="flex flex-col items-center justify-center w-full md:w-2xl gap-6 bg-amber-50/10 rounded-md p-2">
            {isPending && <Typography variant="p">Loading...</Typography>}
            {isError && (
              <Typography variant="p" className="text-center">
                An error occurred: {error?.message.includes(`API rate limit exceeded`) ? `Please try again in ${retryTime} seconds by clicking the search button` : error?.message}
              </Typography>
            )}
            {data && data.total_count === 0 && (
              <Typography variant="p">No users found.</Typography>
            )}
            {data && data.items && data.total_count >= 1 && (
              <Typography variant="p" className="w-full text-left">
                {data.total_count} {data.total_count > 1 ? "users" : "user"} found.
              </Typography>
            )}
            {data &&
              gitUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-4 bg-amber-300/45 p-2 rounded-md w-full cursor-pointer hover:bg-amber-300/60"
                  onClick={() => navigate(`/user/${user.login}`)}
                  type="button"
                >
                  <img
                    src={user.avatar_url}
                    alt={`${user.login}'s avatar`}
                    className="w-10 h-10 rounded-full"
                    loading="lazy"
                    decoding="async"
                  />
                  <Typography variant="p">{user.login}</Typography>
                </div>
              ))}
            {data && data.total_count > 10 && (
              <div className="flex gap-4 items-center justify-center w-full relative">
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
                <Typography variant="p" className="place-self-center absolute right-0">Page {page} of {totalPage}</Typography>
              </div>
            )}
          </div>
        ) : null}
    </div>
  );
};

export default HomePage;
