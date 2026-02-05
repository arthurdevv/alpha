export const SpinnerIcon = ({ arg0, arg1 }: { arg0?: any; arg1?: any }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 8 24"
    height="1.625rem"
    width="0.625rem"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 7L7 11H1L4 7Z" onClick={arg0} />
    <path d="M4 17L1 13L7 13L4 17Z" onClick={arg1} />
  </svg>
);
