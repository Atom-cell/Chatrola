import React from "react";
import Link from "next/link";

const NotFoundPage = () => {
  return <div>
    <h1>Page Not Found</h1>
    <Link href='/'>Go back</Link>
    </div>;
};

export default NotFoundPage;
