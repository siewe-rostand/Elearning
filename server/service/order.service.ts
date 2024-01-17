import { NextFunction, Response } from "express";
import { CatchAsyncError } from "../middleware/catch_async_error";
import orderModel from "../models/order.model";

export const newOrder = CatchAsyncError(
  async (data: any, res: Response, next: NextFunction) => {
    const order = await orderModel.create(data);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  }
);
