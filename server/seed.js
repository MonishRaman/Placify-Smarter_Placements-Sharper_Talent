// seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Student from "./models/Student.js";
import connectDB from "./config/db.js";

dotenv.config();
await connectDB();

const students = [
  {
    name: "Amit Kumar",
    email: "amit@example.com",
    university: "Zeal College",
    major: "CSE",
      password: "test1234",
    role: "student",
    placementStatus: "Placed", // ✅ match the enum

    interviewAttended: 5,
    passedInterviews: 4,
    failedInterviews: 1,
    attendance: 92,
  },
  {
    name: "Sneha Patil",
    email: "sneha@example.com",
    university: "Zeal College",
    major: "IT",
    password: "test123",
    role: "student",
    placementStatus: "Not Placed",

    interviewAttended: 3,
    passedInterviews: 1,
    failedInterviews: 2,
    attendance: 88,
  },
  
  {
    name: "Rohit Sharma",
    email: "rohit@example.com",
    university: "Zeal College",
    major: "CSE",
    password: "test1234",
    role: "student",
    placementStatus: "Placed",
    interviewAttended: 6,
    passedInterviews: 5,
    failedInterviews: 1,
    attendance: 95,
    
  },
  {
    name: "Pooja Desai",
    email: "pooja@example.com",
    university: "Zeal College",
    major: "IT",
    password: "test1234",
    role: "student",
    placementStatus: "Not Placed",
    interviewAttended: 2,
    passedInterviews: 0,
    failedInterviews: 2,
    attendance: 75,
    
  },
  {
    name: "Karan Mehta",
    email: "karan@example.com",
    university: "Zeal College",
    major: "CSE",
    password: "test1234",
    role: "student",
    placementStatus: "Placed",
    interviewAttended: 4,
    passedInterviews: 3,
    failedInterviews: 1,
    attendance: 85,
    
  },
  {
    name: "Neha Jadhav",
    email: "neha@example.com",
    university: "Zeal College",
    major: "ENTC",
    password: "test1234",
    role: "student",
    placementStatus: "Not Placed",
    interviewAttended: 3,
    passedInterviews: 1,
    failedInterviews: 2,
    attendance: 80,
    
  },
  {
    name: "Aniket Salunkhe",
    email: "aniket@example.com",
    university: "Zeal College",
    major: "CSE",
    password: "test1234",
    role: "student",
    placementStatus: "Placed",
    interviewAttended: 7,
    passedInterviews: 6,
    failedInterviews: 1,
    attendance: 90,
    
  },
  {
    name: "Rutuja Pawar",
    email: "rutuja@example.com",
    university: "Zeal College",
    major: "IT",
    password: "test1234",
    role: "student",
    placementStatus: "Placed",
    interviewAttended: 5,
    passedInterviews: 4,
    failedInterviews: 1,
    attendance: 91,
    
  },
  {
    name: "Sanket More",
    email: "sanket@example.com",
    university: "Zeal College",
    major: "ENTC",
    password: "test1234",
    role: "student",
    placementStatus: "Not Placed",
    interviewAttended: 1,
    passedInterviews: 0,
    failedInterviews: 1,
    attendance: 68,
    
  },
  {
    name: "Snehal Gaikwad",
    email: "snehal@example.com",
    university: "Zeal College",
    major: "CSE",
    password: "test1234",
    role: "student",
    placementStatus: "Placed",
    interviewAttended: 6,
    passedInterviews: 5,
    failedInterviews: 1,
    attendance: 97,
   
  },
  {
    name: "Tanmay Joshi",
    email: "tanmay@example.com",
    university: "Zeal College",
    major: "IT",
    password: "test1234",
    role: "student",
    placementStatus: "Placed",
    interviewAttended: 3,
    passedInterviews: 3,
    failedInterviews: 0,
    attendance: 93,
   
  },
  {
    name: "Sayali Kulkarni",
    email: "sayali@example.com",
    university: "Zeal College",
    major: "ENTC",
    password: "test1234",
    role: "student",
    placementStatus: "Not Placed",
    interviewAttended: 2,
    passedInterviews: 1,
    failedInterviews: 1,
    attendance: 82,
   
  }

];

async function seed() {
  try {
    await Student.deleteMany();
    await Student.insertMany(students);
    console.log("🌱 Student data seeded");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
