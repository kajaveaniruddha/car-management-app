import { ICars } from "@/models/Car";
import { IUser } from "@/models/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  cars: Array<ICars>;
}

export interface userDetailsType {
  name: string;
  email: string;
}

export interface ApiResponseUserDetails {
  user: IUser;
}
