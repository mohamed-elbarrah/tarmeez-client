import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { Action, Resource } from '@/lib/types/rbac';
import { StoreRole } from '@/lib/types/auth';

export function useRole() {
  const user = useSelector((state: RootState) => state.auth.user);
  const currentRole = user?.currentRole as StoreRole | undefined;

  const isAdmin = currentRole === 'OWNER' || currentRole === 'ADMIN';
  const isMarketer = currentRole === 'MARKETER';
  const isEditor = currentRole === 'EDITOR';

  console.log('[useRole] Resolved Role:', currentRole, 'isAdmin:', isAdmin);

  const can = (action: Action, resource: Resource): boolean => {
    if (isAdmin) return true;

    // Global Read Policy
    if (action === Action.READ) return true;

    // MARKETER Logic
    if (isMarketer) {
      if (resource === Resource.TEAM) return false;
      
      const canManage = [
        Resource.PRODUCTS,
        Resource.CATEGORIES,
        Resource.ORDERS,
        Resource.PAGES,
        Resource.CUSTOMERS,
        Resource.ANALYTICS,
      ].includes(resource);

      if (canManage) return true;
      return false;
    }

    // EDITOR Logic
    if (isEditor) {
      if (resource === Resource.SETTINGS || resource === Resource.TEAM) return false;

      const canManage = [
        Resource.PRODUCTS,
        Resource.CATEGORIES,
        Resource.ORDERS,
      ].includes(resource);

      if (canManage) return true;
      return false;
    }

    return false;
  };

  const canManage = (resource: Resource) => can(Action.MANAGE, resource);
  const canRead = (resource: Resource) => can(Action.READ, resource);
  const canCreate = (resource: Resource) => can(Action.CREATE, resource);
  const canUpdate = (resource: Resource) => can(Action.UPDATE, resource);
  const canDelete = (resource: Resource) => can(Action.DELETE, resource);

  return {
    user,
    role: currentRole,
    isAdmin,
    isMarketer,
    isEditor,
    can,
    canManage,
    canRead,
    canCreate,
    canUpdate,
    canDelete,
  };
}
