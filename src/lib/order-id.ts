const ID_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous 0/O, 1/I/L

/** Short, counter-friendly order id like "INV-7K2QRT" — matches the PRD's "INV-001" example. */
export function generateOrderId(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += ID_CHARS[Math.floor(Math.random() * ID_CHARS.length)];
  }
  return `INV-${code}`;
}
