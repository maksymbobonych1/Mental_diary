import { useState, useEffect } from "react";
import { get, post, patch } from "./fetchUtils";

const getCurrentUserId = () => {
  return localStorage.getItem("userId");
};

export const useAuth = () => {
  const [isAuth, setIsAuth] = useState(!!getCurrentUserId());

  const login = async (email, password) => {
    try {
      const response = await post("/api/login", { email, password });

      if (response.success) {
        localStorage.setItem("userId", response.userId);
        setIsAuth(true);
        return { success: true };
      } else {
        return { success: false, error: "Невірний логін або пароль." };
      }
    } catch (error) {
      const errorMessage =
        error.message || "Помилка сервера або автентифікації.";
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem("userId");
    setIsAuth(false);
  };

  return { isAuth, login, logout };
};

export const useRegister = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const register = async (userData) => {
    setIsRegistering(true);
    try {
      const response = await post("/api/register", userData);
      return { success: response.success, message: response.message };
    } catch (error) {
      return { success: false, error: error.message || "Помилка реєстрації." };
    } finally {
      setIsRegistering(false);
    }
  };

  return { isRegistering, register };
};

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refetchIndex, setRefetchIndex] = useState(0);
  const userId = getCurrentUserId();

  const refetch = () => setRefetchIndex((prev) => prev + 1);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const data = await get(`/profile?userId=${userId}`);
        setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [refetchIndex, userId]);

  return { profile, isLoading, refetch };
};

export const useDiaryEntries = () => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchIndex, setFetchIndex] = useState(0);
  const userId = getCurrentUserId();

  const refetch = () => setFetchIndex((prev) => prev + 1);

  useEffect(() => {
    if (!userId) return;

    const fetchEntries = async () => {
      try {
        const data = await get(`/entries?userId=${userId}`);
        setEntries(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEntries();
  }, [fetchIndex, userId]);

  const moodGraphData = entries.map((e, index) => ({
    day: index + 1,
    moodValue:
      e.mood === "😊"
        ? 5
        : e.mood === "🙂"
          ? 4
          : e.mood === "😐"
            ? 3
            : e.mood === "🙁"
              ? 2
              : 1,
    date: e.date,
  }));

  return { entries, moodGraphData, isLoading, refetch };
};

export const useContent = () => {
  const [content, setContent] = useState({ tips: [], films: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [tipsData, filmsData] = await Promise.all([
          get("/tips"),
          get("/films"),
        ]);

        setContent({ tips: tipsData, films: filmsData });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  return { content, isLoading };
};

export const usePostEntry = () => {
  const [isPosting, setIsPosting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const userId = getCurrentUserId();

  const postEntry = async (data) => {
    setIsPosting(true);
    setIsSuccess(false);

    try {
      await post("/entries", {
        ...data,
        userId: userId,
      });
      setIsSuccess(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsPosting(false);
    }
  };

  return { isPosting, isSuccess, postEntry };
};

export const useUpdateProfile = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const userId = getCurrentUserId();

  const updateProfile = async (newFields) => {
    setIsUpdating(true);
    setUpdateError(null);

    try {
      const updatedData = await patch(`/profile`, {
        ...newFields,
        userId: userId,
      });
      return { success: true, data: updatedData };
    } catch (error) {
      setUpdateError(error.message || "Помилка оновлення даних.");
      return { success: false, error: error.message };
    } finally {
      setIsUpdating(false);
    }
  };

  return { isUpdating, updateError, updateProfile };
};

export const useUploadAvatar = () => {
  const [isUploading, setIsUploading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
  const userId = getCurrentUserId();

  const uploadAvatar = async (file) => {
    setIsUploading(true);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/upload-avatar?userId=${userId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, uploadAvatar };
};
