/**
 * Checks if a user has the required permissions.
 * * @param userPermissions - Array of permissions the user possesses.
 * @param requiredPermissions - A single permission string or array of permissions required.
 * @returns boolean - True if the user has AT LEAST ONE of the required permissions.
 */
export function hasPermission(
    userPermissions: string[] | undefined,
    requiredPermissions: string | string[] | undefined
  ): boolean {
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No permissions required
    }
  
    if (!userPermissions) {
      return false;
    }
  
    const required = Array.isArray(requiredPermissions)
      ? requiredPermissions
      : [requiredPermissions];
  
    // Check if user has ANY of the required permissions
    return required.some((permission) => userPermissions.includes(permission));
  }