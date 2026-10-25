import { Request, Response } from "express";
import HttpsStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { contactService } from "./contact.service";

const createMessage = catchAsync(async (req: Request, res: Response) => {
  const result = await contactService.createMessageDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus.CREATED,
    message: "Message sent successfully",
    data: { id: result.id },
  });
});

export const contactController = { createMessage };