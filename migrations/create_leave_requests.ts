import { db } from "../assets/db_connection";

const createLeaveRequestsTable = `CREATE TABLE leave_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    grade_id INT NOT NULL,
    duration VARCHAR(50) NOT NULL,
    manager_id INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    description TEXT NOT NULL,
    note TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

export const createLeaveRequests = async()=> {
   try {
    await db.query(createLeaveRequestsTable);
    console.log("Leave Requests table created successfully");
  } catch (err) {
    console.error("Error occurred while creating leave_requests table", err);
  }
};
createLeaveRequests();