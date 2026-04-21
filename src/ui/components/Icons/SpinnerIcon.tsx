export const SpinnerIcon = ({
  onIncrement,
  onDecrement,
}: {
  onIncrement?: () => void;
  onDecrement?: () => void;
}) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 8 24"
    height="1.625rem"
    width="0.625rem"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 7L7 11H1L4 7Z" onClick={onIncrement} />
    <path d="M4 17L1 13L7 13L4 17Z" onClick={onDecrement} />
  </svg>
);
