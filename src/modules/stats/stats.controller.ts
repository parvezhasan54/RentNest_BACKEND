
import { Request, Response } from "express";
import HttpsStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { statsService } from "./stats.service";

const getPublic = catchAsync(async (_req: Request, res: Response) =>
  sendResponse(res, { success: true, statusCode: HttpsStatus.OK, message: "Stats", data: await statsService.getPublicStatsDB() }));

const getDashboard = catchAsync(async (req: Request, res: Response) =>
  sendResponse(res, { success: true, statusCode: HttpsStatus.OK, message: "Dashboard stats",
    data: await statsService.getDashboardStatsDB({ id: req.user!.id, role: req.user!.role }) }));

export const statsController = { getPublic, getDashboard };