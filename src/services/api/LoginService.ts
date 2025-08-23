import { Credential, LoginDTO } from "@/models/Staff";
import { RequestStructure } from "@/models/GeneralDTO";
import { GeneralService } from "../GeneralService";

export class LoginService {
   static login(param: LoginDTO) {
      const request: RequestStructure<LoginDTO> = {
         api: "/login",
         method: "POST",
         body: param,
      };
      return GeneralService.fetchData<Credential>(request);
   }
   static logout() {
      localStorage.removeItem("staffId");
      localStorage.removeItem("role");
      localStorage.removeItem("token");
      localStorage.removeItem("ttl");
   }
}