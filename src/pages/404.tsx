import Link from "next/link";

const Error404 = () => {
  return (
    <div className="flex flex-col  place-items-center py-24">
      <h2 className="text-9xl font-bold">404</h2>
      <h3 className="text-4xl font-bold">This page is lost</h3>
      <h4 className="text-lg mt-6">
        We've explored deep and wide, but we can't find the page you were
        looking for.
      </h4>
      <Link href="/">
        <div className="bg-indigo-400 cursor-pointer rounded mt-8 px-5 py-3 font-bold">
          Navigate back home
        </div>
      </Link>
    </div>
  );
};

export default Error404;
