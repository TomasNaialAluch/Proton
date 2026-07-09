/** Short non-cryptographic fingerprint of a byte buffer — stands in for a real document hash in this prototype. */
export function hashBytes(bytes: Uint8Array): string {
  let hash = 0;
  for (let i = 0; i < bytes.length; i++) {
    hash = (hash * 31 + bytes[i]) | 0;
  }
  return Math.abs(hash).toString(16).padStart(8, "0").slice(0, 8);
}
