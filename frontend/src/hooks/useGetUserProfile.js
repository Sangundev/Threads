import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import { useParams } from "react-router-dom";

const useGetUserProfile = () => {
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(true);
  const { username } = useParams();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", "Error fetching user", "error");
          return;
        }
        if (data.isFrozen) {
          setUser(null);
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [username, showToast]);

  return { loading, user };
};

export default useGetUserProfile;
