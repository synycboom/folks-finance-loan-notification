import { useRecoilState } from "recoil";
import { userState } from "../state";
import { getUser } from './api';

export const useUser = () => {
  const [user, setUser] = useRecoilState(userState);

  const fetchUser = async () => {
    const user = await getUser();

    setUser(user);
  };

  return {
    user,
    fetchUser,
  };
};
