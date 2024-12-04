import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeletons";
import { baseURL } from "../../constant/url";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType }) => {

  const getPostEndPoint = () => {
    switch (feedType) {
      case "foryou":
        return `${baseURL}/api/posts/all`;
      case "following":
        return `${baseURL}/api/posts/following`;
      default:
        return `${baseURL}/api/posts/all`;
    }
  };

  const END_POINT = getPostEndPoint();

  const { data: posts, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ["posts", feedType], // Added feedType to query key to avoid caching issues
    queryFn: async () => {
      try {
        const res = await fetch(END_POINT, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        console.log(error);
        throw new Error(error.message || "Something went wrong");
      }
    },
   
  });

  // Effect to refetch data when feedType changes
  useEffect(() => {
    refetch();
  }, [feedType, refetch]);

  if (isLoading || isRefetching) {
    return (
      <div className="flex flex-col justify-center">
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  if (isError) {
    return <p className="text-center my-4 text-red-500">Error: {error.message}</p>;
  }

  // Ensure posts is an array before calling .map
  if (!Array.isArray(posts) || posts.length === 0) {
    return <p className="text-center my-4">No posts in this tab. Switch 👻</p>;
  }

  return (
    <div>
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
