const login = async (data: AccessToken) => {
  if ("googleSSOToken" in data && data.googleSSOToken) {
    localStorage.setItem("access_token", data.googleSSOToken)
    return
  }
const response = await LoginService.loginAccessToken({
  formData: data as AccessToken,
})
localStorage.setItem("access_token", response.access_token)
  onSuccess: () => {
    navigate({ to: "/" })
  },
  onError: (err: ApiError) => {
    handleError(err)
  },
}
