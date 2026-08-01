import { Request, Response } from "express";
import HttpStatus from "http-status-codes";

import { paymentService } from "./payment.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../utils/AppError";



// CREATE CHECKOUT

const createPayment =
catchAsync(async(req:Request,res:Response)=>{


    const tenantId =
        req.user?.id;



    const result =
    await paymentService.createPaymentIntoDB(
        req.body,
        tenantId as string
    );



    sendResponse(res,{

        success:true,

        statusCode:
        HttpStatus.CREATED,

        message:
        "Payment session created",

        data:result

    });

});





// WEBHOOK

const confirmPayment =
catchAsync(async(req:Request,res:Response)=>{


    const signature =
    req.headers[
        "stripe-signature"
    ] as string;



    if(!signature){

        throw new AppError(
            HttpStatus.BAD_REQUEST,
            "Stripe signature missing"
        );

    }



    const result =
    await paymentService.confirmPaymentIntoDB(

        req.body,

        signature

    );



    sendResponse(res,{

        success:true,

        statusCode:200,

        message:
        "Payment confirmed",

        data:result

    });

});





// OPTIONAL VERIFY

const verifyPayment =
catchAsync(async(req:Request,res:Response)=>{


    const {sessionId}=req.body;



    if(!sessionId){

        throw new AppError(
            400,
            "Session ID required"
        );

    }



    const result =
    await paymentService.verifyPayment(
        sessionId
    );



    sendResponse(res,{

        success:true,

        statusCode:200,

        message:
        "Payment verified",

        data:result

    });

});





export const paymentController = {

    createPayment,

    confirmPayment,

    verifyPayment

};