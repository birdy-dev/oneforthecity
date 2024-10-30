export function Banner() {
  return (
    <div className="relative isolate flex items-center justify-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm/6 text-gray-900">
          <strong className="font-semibold">3-Year Anniversary Jam</strong>
          <svg
            viewBox="0 0 2 2"
            className="mx-2 inline size-1 fill-current"
            aria-hidden="true"
          >
            <circle cx="1" cy="1" r="1" />
          </svg>Edmonton, January 18
        </p>
        <a
          className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          href="https://lu.ma/3zm2zx5d"
        >
          Details <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  );
}
