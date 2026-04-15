import $api from "~/http";

export class AdminService {
    static async getAllPortfolios() {
        $api.get('/')
    }
}