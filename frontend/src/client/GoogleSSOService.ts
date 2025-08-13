import axios from "axios";

export const fetchGoogleAuthUrl = async (): Promise<string> => {
  const res = await axios.get("/api/v1/login/google");
  return res.data.auth_url;
};

export const googleLogin = async (code: string): Promise<{ access_token: string }> => {
  const res = await axios.post("/api/v1/login/google/callback", { code });
  return res.data;
};