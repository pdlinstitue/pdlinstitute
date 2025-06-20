import Tokens from 'csrf';

const csrf = new Tokens();

export function generateCsrfTokenAndSecret(): { csrfToken: string; csrfSecret: string } {
  const csrfSecret = csrf.secretSync();      // secure, per-user/session
  const csrfToken = csrf.create(csrfSecret);     // CSRF token based on secret
  return { csrfToken, csrfSecret };
}

export function verifyCsrfToken(csrfToken: string, csrfSecret: string): boolean {
  return csrf.verify(csrfSecret, csrfToken);
}


