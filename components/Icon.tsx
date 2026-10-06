export default function Icon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    code: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
      </>
    ),
    brain: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 3.5A2.75 2.75 0 006 6.25v.2A3.25 3.25 0 004 9.5c0 .6.16 1.16.44 1.64A3.25 3.25 0 003 14.25c0 1.28.74 2.39 1.82 2.92A3.5 3.5 0 0012 17.5v-11a2.75 2.75 0 00-2.25-3z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.25 3.5A2.75 2.75 0 0118 6.25v.2a3.25 3.25 0 012 2.55c0 .6-.16 1.16-.44 1.64a3.25 3.25 0 011.44 3.11c0 1.28-.74 2.39-1.82 2.92A3.5 3.5 0 0112 17.5"
        />
        <circle cx="12" cy="8.5" r="0.5" fill="currentColor" />
        <circle cx="10.5" cy="12" r="0.5" fill="currentColor" />
        <circle cx="13.5" cy="12.5" r="0.5" fill="currentColor" />
      </>
    ),
    rocket: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 15c-1.5-4.5.5-9 4.5-11.5C20 1 22.5 1.5 22.5 1.5S23 4 20.5 7.5C18 11.5 13.5 13.5 12 15z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12c-2 .5-4 2.5-4.5 5.5C4 20 2 22 2 22s2-.5 4.5-2.5c3-2 5-4.5 5.5-6.5" />
        <circle cx="16" cy="8" r="1.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18l-2 2M12.5 15.5l2 2" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <circle cx="17" cy="9" r="2.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 14.5c2.3.5 4 2.6 4 5" />
      </>
    ),
    bot: (
      <>
        <rect x="4" y="8" width="16" height="11" rx="3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8V4M12 4h3" />
        <circle cx="12" cy="5.5" r="0.75" fill="currentColor" />
        <circle cx="9" cy="13" r="0.9" fill="currentColor" stroke="none" />
        <circle cx="15" cy="13" r="0.9" fill="currentColor" stroke="none" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 16.5h5" />
      </>
    ),
    chart: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V4M4 20h16" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16v-5M12 16V8M16 16v-3M20 16V6" />
      </>
    ),
    spark: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2l1.8 5.7L19.5 9l-5.7 1.8L12 16.5l-1.8-5.7L4.5 9l5.7-1.8L12 2zM19 15l.9 2.6L22.5 18.5l-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9L19 15z"
      />
    ),
    check: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12.5l4.5 4.5L19 7.5" />
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 7l8.5 6 8.5-6" />
      </>
    ),
    pin: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21s-6.5-5.3-6.5-10.5a6.5 6.5 0 1113 0C18.5 15.7 12 21 12 21z"
        />
        <circle cx="12" cy="10.5" r="2.25" />
      </>
    ),
  };

  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.6}
    >
      {paths[name] ?? paths.spark}
    </svg>
  );
}
