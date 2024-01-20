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

// get all orders
export const getAllOrdersService = async (res: Response) => {
  const orders = await orderModel.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "All orders gotten successfully",
    orders,
  });
};
