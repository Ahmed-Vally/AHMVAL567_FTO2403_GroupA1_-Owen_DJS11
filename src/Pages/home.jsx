import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl">Welcome to Podify🎧</h1>
      <h3 className="m-16">
        Welcome to our Website Podify that has all the podcasts that you could ever want and need.
        We have a large variety of podacts ranging from humorous to the most serious conversations you will ever listen too.
      </h3>
      <Link to="/Shows" className="text-xl font-bold">
        Find your first show
      </Link>
    </div>
  );
}