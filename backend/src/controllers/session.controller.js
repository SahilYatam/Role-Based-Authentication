import { 
    asyncHandler, 
    setCookies, 
} from "../utils/index.js";
import { sessionService } from "../services/session.service.js";

export const refreshAccessToken = asyncHandler(async(req, res) => {
    const token = req.cookies.refreshToken;
    const {accessToken, refreshToken} = await sessionService.refreshAccessToken(token);

    setCookies(res, accessToken, refreshToken);

    return res.status(200).json({message: "Token refreshed successfully"})
})