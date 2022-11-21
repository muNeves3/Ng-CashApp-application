import axios from "axios";
import {
  useContext,
  useMemo,
  useState,
  createContext,
  useCallback,
  useEffect,
} from "react";

type User = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    username: string;
    password: string;
    accountId: number;
  };
};

type UserContextType = {
  user: User;
  login: (username: string, password: string) => Promise<void>;
  setUser: (user: any) => void;
};

const UserContext = createContext<UserContextType>({} as UserContextType);

export function UserContextProvider({ children }: any) {
  const [user, setUser] = useState<User>({} as User);

  useEffect(() => {
    const userStorage = localStorage.getItem("@Ngcash:user");
    if (userStorage) {
      setUser(JSON.parse(userStorage));
    } else {
      setUser({} as User);
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:3001/user/login", {
        username,
        password,
      });

      localStorage.setItem("@Ngcash:user", JSON.stringify(response.data));
      setUser(response.data);
    } catch (error: any) {
      console.log(error.response);
    }
  }, []);

  //   const UserContextValue = useMemo(
  //     () => ({ user, login, setUser }),
  //     [user, login, setUser]
  //   );

  return (
    <UserContext.Provider value={{ user, login, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext<UserContextType>(UserContext);
