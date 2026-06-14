import express from "express";
import {
  createGroup,
  getMyGroups,
  getGroup,
  updateGroup,
  addMember,
  removeMember,
  getGroupMembers,
} from "../controllers/group.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createGroup).get(getMyGroups);

router.route("/:id").get(getGroup).put(updateGroup);

router.route("/:id/members").post(addMember).get(getGroupMembers);

router.route("/:id/members/:userId").delete(removeMember);

export default router;
