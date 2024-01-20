import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createOrder, getAllOrders } from "../controller/order.controller";

const orderRouter = express.Router();

orderRouter.post("/order/create", isAuthenticated, createOrder);

orderRouter.get(
  "/orders",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllOrders
);

export default orderRouter;
