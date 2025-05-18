import React from "react";
import { useLocation, Link } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Hide ID-like values (e.g., numbers or UUIDs)
  const filteredPathnames = pathnames.filter(
    (segment) => isNaN(segment) && !/^[0-9a-fA-F]{24}$/.test(segment) // optional: hide MongoDB ObjectIds
  );

  return (
    <nav style={{ margin: '1rem 0', fontSize: '0.9rem' }}>
      <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>Home</Link>
      {filteredPathnames.map((value, index) => {
        const to = "/" + pathnames.slice(0, index + 1).join("/");
        const isLast = index === filteredPathnames.length - 1;

        const formatted = value
          .replace(/-/g, " ")            // replace dashes with spaces
          .replace(/\b\w/g, (l) => l.toUpperCase()); // capitalize

        return (
          <span key={to}>
            {" > "}
            {isLast ? (
              <span style={{ fontWeight: "bold" }}>{formatted}</span>
            ) : (
              <Link to={to} style={{ color: '#007bff', textDecoration: 'none' }}>
                {formatted}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
