import { accessLevels } from '@constants/protectedRoutes';
import {
  IUser,
  IUserContext,
  IWhoAmIResponse,
} from '@custom-types/data/IUser';
import { isSuccessful, sendRequest } from '@requests/request';
import { clearCookie, getCookie, setCookie } from '@utils/cookies';
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const UserContext = createContext<IUserContext>(null!);

export const UserProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const whoAmI = useCallback(async () => {
    const cookie_user = getCookie('user');
    if (!cookie_user) {
      const res = await sendRequest<{}, IWhoAmIResponse>(
        'auth/whoami',
        'GET'
      );
      if (!res.error) {
        const user = res.response.current_user;
        const accessLevel = user.role.accessLevel;
        setCookie('user', JSON.stringify(user), {
          path: '/',
        });

        setValue((prev) => ({
          ...prev,
          authorized: true,
          user: user,
          accessLevel,
          accounts: res.response.users,
          isUser: user.role.accessLevel >= accessLevels.user,
          isStudent: accessLevel >= accessLevels.student,
          isTeacher: accessLevel >= accessLevels.teacher,
          isAdmin: accessLevel >= accessLevels.admin,
          isDeveloper: accessLevel >= accessLevels.student,
        }));
      } else {
        setValue((prev) => ({
          ...prev,
          authorized: false,
          user: undefined,
          accounts: [],
          accessLevel: 0,
          isUser: false,
          isStudent: false,
          isTeacher: false,
          isAdmin: false,
          isDeveloper: false,
        }));
      }
    } else {
      try {
        const user = JSON.parse(cookie_user) as IUser;
        // TODO accounts

        setValue((prev) => ({
          ...prev,
          authorized: true,
          user: user,
          accessLevel: user.role.accessLevel,
          isUser: user.role.accessLevel >= accessLevels.user,
          isStudent: user.role.accessLevel >= accessLevels.student,
          isTeacher: user.role.accessLevel >= accessLevels.teacher,
          isAdmin: user.role.accessLevel >= accessLevels.admin,
          isDeveloper:
            user.role.accessLevel >= accessLevels.developer,
        }));
      } catch (error) {
        setCookie('user', '', { 'max-age': 0 });
        whoAmI();
      }
    }
  }, []);

  const refresh = useCallback(async () => {
    // TODO
    return;
    const res = await isSuccessful('auth/refresh', 'GET');
    if (!res.error) {
      await whoAmI();
    }
  }, [whoAmI]);

  const signIn = useCallback(
    async (organization: string, login: string, password: string) => {
      const res = await isSuccessful('auth/signin', 'POST', {
        organization,
        login,
        password,
      });
      if (!res.error) {
        await whoAmI();
        return true;
      }
      return false;
    },
    [whoAmI]
  );

  const signOut = useCallback(async () => {
    const res = await isSuccessful('auth/signout', 'GET');
    if (!res.error) {
      clearCookie('access_token_cookie');
      clearCookie('user');
      setValue((prev) => ({
        ...prev,
        authorized: false,
        accounts: [],
        user: undefined,
        accessLevel: 0,
        isUser: false,
        isStudent: false,
        isTeacher: false,
        isAdmin: false,
        isDeveloper: false,
      }));
      return true;
    }
    return false;
  }, []);

  const refreshAccess = useCallback(() => {
    if (getCookie('access_token_cookie')) {
      whoAmI();
      return 0;
    }
    if (getCookie('refresh_token_cookie')) {
      refresh();
      return 1;
    }
    setValue((prev) => ({
      ...prev,
      authorized: false,

      user: undefined,
      accessLevel: 0,
      isUser: false,
      isStudent: false,
      isTeacher: false,
      isAdmin: false,
      isDeveloper: false,
    }));
    return 2;
  }, [refresh, whoAmI]);

  const checkTokensExpiration = useCallback(() => {
    if (!!!getCookie('refresh_token_cookie')) {
      whoAmI();
      return;
    }
    if (!!!getCookie('access_token_cookie')) {
      refresh();
      return;
    }
  }, [refresh, whoAmI]);

  useEffect(() => {
    const id = setInterval(checkTokensExpiration, 300000);
    return () => {
      clearInterval(id);
    };
  }, [checkTokensExpiration]);

  const [value, setValue] = useState<IUserContext>(() => ({
    authorized: false,
    user: undefined,
    accounts: [],
    accessLevel: 0,
    isUser: false,
    isStudent: false,
    isTeacher: false,
    isAdmin: false,
    isDeveloper: false,
    signIn,
    signOut,
    refresh,
    refreshAccess,
  }));

  useEffect(() => {
    refreshAccess();
  }, [refreshAccess]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  return useContext(UserContext);
}
