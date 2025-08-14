import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"

import {
  type Body_login_login_access_token as AccessToken,
  type ApiError,
  LoginService,
  type UserPublic,
  type UserRegister,
  UsersService,
} from "@/client"
import { fetchGoogleAuthUrl, googleLogin } from "@/client/GoogleSSOService"

import { handleError } from "@/utils"

const isLoggedIn = () => {
  return localStorage.getItem("access_token") !== null
}

const useAuth = () => {
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: user } = useQuery<UserPublic | null, Error>({
    queryKey: ["currentUser"],
    queryFn: UsersService.readUserMe,
    enabled: isLoggedIn(),
  })

  const signUpMutation = useMutation({
    mutationFn: (data: UserRegister) =>
      UsersService.registerUser({ requestBody: data }),

    onSuccess: () => {
      navigate({ to: "/login" })
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  const login = async (data: AccessToken) => {
  const loginMutation = useMutation({
    mutationFn: async (data: AccessToken) => {
      // Google SSOトークンがある場合
      if ("googleSSOToken" in data && data.googleSSOToken) {
        const response = await googleLogin(data.googleSSOToken)
        localStorage.setItem("access_token", response.access_token)
        return response
      }
      
      // 通常のログイン
      const response = await LoginService.loginAccessToken({
        formData: data as AccessToken,
      })
      localStorage.setItem("access_token", response.access_token)
      return response
    },
    onSuccess: () => {
      navigate({ to: "/" })
    },
    onError: (err: ApiError) => {
      handleError(err)
      setError("ログインに失敗しました。メールアドレスとパスワードを確認してください。")
    },
  })

  // Google認証URLを取得する関数
  const getGoogleAuthUrl = async () => {
    try {
      return await fetchGoogleAuthUrl()
    } catch (err) {
      handleError(err as ApiError)
      setError("Google認証の準備に失敗しました。")
      return null
    }
  }

  // Google認証コードでログインする関数
  const loginWithGoogleCode = async (code: string) => {
    try {
      const response = await googleLogin(code)
      localStorage.setItem("access_token", response.access_token)
      navigate({ to: "/" })
      return true
    } catch (err) {
      handleError(err as ApiError)
      setError("Googleログインに失敗しました。")
      return false
    }
  }
    onSuccess: () => {
      navigate({ to: "/" })
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
  })

  const logout = () => {
    localStorage.removeItem("access_token")
    navigate({ to: "/login" })
  }

  return {
    signUpMutation,
    loginMutation,
    logout,
    user,
    error,
    resetError: () => setError(null),
    getGoogleAuthUrl,
    loginWithGoogleCode,

  }
}

export { isLoggedIn }
export default useAuth
