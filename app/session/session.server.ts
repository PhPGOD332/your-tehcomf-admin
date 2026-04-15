import { createCookie } from "react-router";

export const accessTokenCookie = createCookie('accessToken', {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/"
});

export const refreshTokenCookie = createCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/"
})