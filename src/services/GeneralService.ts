import { BASE_URL } from "@/constants/GlobalConstant";
import { GeneralResponse, RequestStructure } from "@/models/GeneralDTO";

export class GeneralService {
  private static showBlockingRedirectOverlay(message: string = "Session expired. Redirecting...") {
    // prevent adding multiple overlays
    if (document.getElementById("redirect-overlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "redirect-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)"; // darker to block interaction
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "9999";
    overlay.style.color = "#fff";
    overlay.style.fontSize = "1.5rem";
    overlay.style.flexDirection = "column";
    overlay.style.pointerEvents = "all"; // ensures it blocks clicks
    overlay.style.userSelect = "none"; // optional, prevent text selection

    overlay.innerHTML = `
      <div>${message}</div>
      <div style="margin-top: 20px;">
        <div style="
          border: 4px solid #fff;
          border-top: 4px solid transparent;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;">
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Add spinner animation
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  private static redirectToLogin(message?: string) {
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      this.showBlockingRedirectOverlay(message);
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }
  }

  static async callApi<TData, TBody = unknown>(request: RequestStructure<TBody>): Promise<GeneralResponse<TData>> {
    const token = localStorage.getItem("token");

    const { api, method, body } = request;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const options: RequestInit = {
      method: method,
      headers: headers,
    };

    if (body && method !== 'GET' && method !== 'HEAD') {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(BASE_URL + api, options);

    return response.json();
  }
}