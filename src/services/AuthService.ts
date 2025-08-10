export function getTokenOrRedirect() {
  const token = getToken();
  if (!token) {
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
    return null;
  }
  return token;
}

function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  const token = localStorage.getItem("jwtToken");
  const expiry = localStorage.getItem("expiresIn");

  if (!token || !expiry) {
    return null;
  }

  console.log("before expiry validation");

  if (Date.now() > Number(expiry)) {
    localStorage.removeItem("staffId");
    localStorage.removeItem("role");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("expiresIn");

    return null;
  }

  return token;
}
