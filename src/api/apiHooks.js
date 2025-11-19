import { useState, useEffect } from "react";
import { get, post, patch } from "./fetchUtils";

// Логіка входу/виходу
export const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false);

  const login = async (email, password) => {
    try {
      const users = await get(`/users?email=${email}&password=${password}`);

      if (users.length > 0) {
        setIsAuth(true);
        return { success: true };
      } else {
        return { success: false, error: "Невірний логін або пароль." };
      }
    } catch (error) {
      console.error("Помилка входу:", error);
      return { success: false, error: "Помилка сервера або валідації." };
    }
  };

  const logout = () => {
    setIsAuth(false);
  };

  return { isAuth, login, logout };
};

// Отримання даних профілю
export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await get("/profile");
        setProfile(data);
      } catch (error) {
        console.error("Помилка отримання профілю:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return { profile, isLoading };
};

// Отримання всіх записів та даних для графіків
export const useDiaryEntries = () => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await get("/entries");
        setEntries(data);
      } catch (error) {
        console.error("Помилка отримання записів:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEntries();
  }, []);

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
  }));

  return { entries, moodGraphData, isLoading };
};

// Отримання Порад та Фільмів
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
        console.error("Помилка отримання контенту:", error);
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

  const postEntry = async (data) => {
    setIsPosting(true);
    setIsSuccess(false);

    try {
      await post("/entries", {
        ...data,
        date: new Date().toISOString().split("T")[0],
      });
      setIsSuccess(true);
      return { success: true };
    } catch (error) {
      console.error("Помилка POST запиту:", error);
      return { success: false, error: error.message };
    } finally {
      setIsPosting(false);
    }
  };

  return { isPosting, isSuccess, postEntry };
};

// Оновлення даних профілю
export const useUpdateProfile = (userId = 1) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const updateProfile = async (newFields) => {
    setIsUpdating(true);
    setUpdateError(null);

    try {
      const updatedData = await patch(`/profile`, newFields);

      if (newFields.newPassword) {
        console.log(`Імітація оновлення пароля для користувача ${userId}`);
      }

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
