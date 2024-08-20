import React from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/header";
import usePreviewStore from "../stores/FavStore";

function Shows() {
  // State of previewStore and favStore
  const { previews, fetchAllShows, error } = usePreviewStore();

  useEffect(() => {
    if (!previews) {
      console.log("Fetched previews");
      fetchAllShows();
    }
  }, [fetchAllShows, previews]);

  // Displays an error message on page if data is fetched incorrectly
  if (error) {
    return <h1>Data fetching failed</h1>;
  }

  return (
    <>
      <div>
        <h1 className="text-4xl text-left">All available shows</h1>
        <nav>
          <Header />
        </nav>
      </div>
      <div>
        <ul>
          {previews &&
            previews.map((preview) => (
              <li key={preview.id}>
                <div>
                  {preview.id}. {preview.title}
                </div>
                <div>{preview.description}</div>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}

export default Shows;

{
  /* {previews &&
          previews.map((preview) => (
            <li key={preview.id}>
              <Link to={`/Shows/${preview.id}`}>{preview.title}</Link>
            </li>
          ))} */
}