
import { Request, Response } from "express";
import HttpsStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../utils/AppError";
import { aiService } from "./ai.service";

const search = catchAsync(async (req: Request, res: Response) => {
  const query = String(req.body?.query ?? "").trim();
  if (!query) throw new AppError(HttpsStatus.BAD_REQUEST, "Query is required");
  sendResponse(res, { success: true, statusCode: HttpsStatus.OK, message: "Parsed", data: await aiService.parseSearchQuery(query) });
});

const chat = catchAsync(async (req: Request, res: Response) => {
  const raw = Array.isArray(req.body?.messages) ? req.body.messages.slice(-10) : [];
  const clean = raw
    .filter((m: any) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .map((m: any) => ({ role: m.role, content: m.content.slice(0, 1000) }));
  while (clean[0]?.role === "assistant") clean.shift();
  if (!clean.length) throw new AppError(HttpsStatus.BAD_REQUEST, "Message is required");
  sendResponse(res, { success: true, statusCode: HttpsStatus.OK, message: "Reply", data: { reply: await aiService.chat(clean) } });
});

export const aiController = { search, chat };