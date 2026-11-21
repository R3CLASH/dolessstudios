/**
 * The 404 boundary for the admin route group.
 *
 * (admin) is its own root layout, so without this file a notFound() from an
 * admin page falls through to Next's built-in error UI rather than anything
 * that looks like this site. Two paths reach here routinely: ADMIN_PASSWORD
 * being unset, which 404s the whole area including the login form, and an
 * order reference that doesn't exist.
 *
 * Deliberately featureless — no "sign in" link, no explanation. A 404 that
 * offers a login link isn't a 404, and the whole point of 404ing an
 * unconfigured admin area is to not advertise that it's there.
 */
export default function AdminNotFound() {
  return (
    <div className="grid min-h-dvh place-items-center px-6">
      <p className="font-mono text-sm text-mist">404</p>
    </div>
  );
}
