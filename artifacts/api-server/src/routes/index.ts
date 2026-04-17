import { Router, type IRouter } from "express";
import healthRouter from "./health";
import listingsRouter from "./listings";
import usersRouter from "./users";
import watchlistRouter from "./watchlist";
import adminRouter from "./admin";
import myListingsRouter from "./my-listings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(listingsRouter);
router.use(usersRouter);
router.use(watchlistRouter);
router.use(adminRouter);
router.use(myListingsRouter);

export default router;
