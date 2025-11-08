

import express from "express";
import logger from '../utils/logger.js';
const router = express.Router();
import Student from "../models/Student.js";

router.get("/", async (req, res) => {
  try {
 const { year, semester } = req.query;
    const query = { role: "student" };

    if (year) query.year = year;
    if (semester) query.semester = semester;

    const students = await Student.find(query);


    const totalPlaced = students.filter(
      (s) => s.placementStatus.toLowerCase() === "placed"
    ).length;

    const totalInterviews = students.reduce(
  (acc, s) => acc + ((s.passedInterviews || 0) + (s.failedInterviews || 0)),
  0
);


    const avgAttendance = Math.floor(
      students.reduce((acc, s) => acc + (s.attendance || 0), 0) /
        (students.length || 1)
    );

    let passCount = 0;
    let failCount = 0;
    const departmentStatsMap = {};

    students.forEach((s) => {
      passCount += s.passedInterviews || 0;
      failCount += s.failedInterviews || 0;

      const dept = s.major;
      if (!departmentStatsMap[dept]) {
        departmentStatsMap[dept] = { pass: 0, fail: 0 };
      }
      departmentStatsMap[dept].pass += s.passedInterviews || 0;
      departmentStatsMap[dept].fail += s.failedInterviews || 0;
    });

    const attendanceData = students.map((s) => ({
      name: s.name,
      attendancePercent: s.attendance || 0,
    }));

    const departmentStats = Object.entries(departmentStatsMap).map(
      ([department, { pass, fail }]) => ({
        department,
        pass,
        fail,
      })
    );

    res.json({
      totalPlaced,
      totalInterviews,
      avgAttendance,
      attendanceData,
      passFailStats: [
        { status: "Pass", value: passCount },
        { status: "Fail", value: failCount },
      ],
      departmentStats,
    });
  } catch (error) {
    logger.error("Error in /performance route:", error);
    res.status(500).json({ message: "Failed to fetch stats", error });
  }
});

export default router;
