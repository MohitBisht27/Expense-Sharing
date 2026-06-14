import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import ImportService from "../services/import.service.js";
import { ImportLog, GroupMember } from "../models/index.js";

export const importCSV = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  if (!req.file) {
    throw new ApiError(400, "Please upload a CSV file");
  }

  // Verify membership
  const isMember = await GroupMember.findOne({
    where: { groupId, userId: req.user.id, isActive: true },
  });

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this group");
  }

  const importService = new ImportService();
  const result = await importService.processImport(
    groupId,
    req.file.buffer,
    req.user.id,
  );

  // Create import log
  const importLog = await ImportLog.create({
    groupId,
    fileName: req.file.originalname,
    totalRows: result.totalRows,
    successfulRows: result.successfulRows,
    failedRows: result.failedRows,
    anomalies: result.anomalies,
    importedBy: req.user.id,
    status: "COMPLETED",
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        importLog,
        report: result,
      },
      "CSV imported successfully",
    ),
  );
});

export const getImportLogs = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  // Verify membership
  const isMember = await GroupMember.findOne({
    where: { groupId, userId: req.user.id, isActive: true },
  });

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this group");
  }

  const logs = await ImportLog.findAll({
    where: { groupId },
    order: [["createdAt", "DESC"]],
  });

  res
    .status(200)
    .json(new ApiResponse(200, { logs }, "Import logs retrieved successfully"));
});

export const getImportLog = asyncHandler(async (req, res) => {
  const log = await ImportLog.findByPk(req.params.id);

  if (!log) {
    throw new ApiError(404, "Import log not found");
  }

  // Verify membership
  const isMember = await GroupMember.findOne({
    where: { groupId: log.groupId, userId: req.user.id, isActive: true },
  });

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this group");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { log }, "Import log retrieved successfully"));
});
