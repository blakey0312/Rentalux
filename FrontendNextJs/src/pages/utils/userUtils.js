function checkUserRole(session) {
  if (!session || !session.user) {
    return null; // Return null if the user is not signed in
  }

  // Check for role in public metadata (Clerk v5 approach)
  const userRole = session.user.publicMetadata?.role;

  if (userRole) {
    return userRole.toLowerCase(); // Return the role in lowercase
  }

  return null; // Return null if no role is found
}

export default checkUserRole;
