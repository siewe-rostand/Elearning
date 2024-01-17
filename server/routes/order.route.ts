import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { createOrder } from "../controller/order.controller";

const orderRouter = express.Router();

orderRouter.post("/order/create", isAuthenticated, createOrder);

export default orderRouter;
