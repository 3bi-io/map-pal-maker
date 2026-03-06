

## Assign Admin Role to c@3bi.io

The user `c@3bi.io` (ID: `a8641aaa-0cbe-4e1c-9a22-1d4e55a0b67c`) currently has only the `user` role. I will insert an `admin` role entry into the `user_roles` table for this user.

### Action
Run this SQL via the Supabase SQL Editor:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('a8641aaa-0cbe-4e1c-9a22-1d4e55a0b67c', 'admin');
```

This adds a second row with the `admin` role while keeping the existing `user` role.

### Verification
After insertion, the user will have both roles: `user` and `admin`. The `has_role()` function will return `true` for `admin` checks.

