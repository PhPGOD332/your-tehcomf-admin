import type {AxiosResponse} from "axios";
import type {AuthResponse} from "~/types/AuthResponse";
import $api from "~/http";
import type {LoginDto} from "~/types/dtos/LoginDto";
import type {IUser} from "~/types/IUser";

export class AuthService {
    static async login(data: LoginDto): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/auth/login', data);
    }

    static async logout(user: IUser ): Promise<AxiosResponse<{ success: boolean }>> {
        return $api.post('/auth/logout', user);
    }
}