import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      {/* Styling for nav routes */}
      <nav className="box-border flex-1 text-left m-3">
        <ul>
          {" "}
          <li>
            <Link to="/">Homepage</Link>
          </li>
          <li>
            <Link className="nav">Favorites</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}