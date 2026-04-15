export interface IUser {
    id: string;
    email: string;
    refreshTokenHash: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}