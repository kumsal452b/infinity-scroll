import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { fetchItems } from "./api/items";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

function App() {
  const { data, error, status, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["items"],
      queryFn: fetchItems,
      initialPageParam: 0,
      getNextPageParam: (lastPage: any) => lastPage.nextPage,
    });
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
    return () => {};
  }, [fetchNextPage, inView]);

  return status === "pending" ? (
    <div>Loading...</div>
  ) : status === "error" ? (
    <div>Error: {error.message}</div>
  ) : (
    <div className="flex flex-col gap-2">
      {data?.pages.map((page, i) => {
        return (
          <div className="flex flex-col gap-2" key={page.currentPage}>
            {page.data.map((item: any) => {
              return (
                <div
                  className="bg-slate-400 rounded-md bg-grayscale-700 p-10"
                  key={item.id}
                >
                  {item.name}
                </div>
              );
            })}
          </div>
        );
      })}
      <div ref={ref}>{isFetchingNextPage && "Loading..."}</div>
    </div>
  );
}

export default App;
