import express , {Request, Response} from "express"
import { addUserFee, ChatLogin, chatLogout, createAdmin, createManager, createStudent, createTeacher, deleteUser, getEmployees, getStudents, getStudentsCountTeacherDashboard, getStudentsTeacherDashboard, getTeachersByGrade, getUserById, getUsers, getUsersByGrade, getUsersWithGrade, login, logout, remainingFees, updateAdmin, updateManager, updatePassword, updateStudent, updateTeacher, updateUser } from "../Controller/userController";
import { upload } from "../../assets/upload";
import { authMiddleware } from "../../assets/middleware";

export const UserRouter = express.Router();

UserRouter.get("/getUsers", (req: Request, res: Response)=> {
    getUsers(req, res);
});
UserRouter.get("/getTeachersByGrade/:grade_id", (req: Request, res: Response)=> {
    getTeachersByGrade(req, res)
})
UserRouter.get("/getUserById/:id", (req: Request<{id: string}>, res: Response)=> {
    getUserById(req, res);
})
UserRouter.get("/getStudents/:gradeId", authMiddleware, (req: Request, res: Response)=> {
    getStudents(req, res);
})
UserRouter.post("/createUser", authMiddleware,
      upload.fields([
        { name: "profile", maxCount: 1 },
        { name: "prevClassDocument", maxCount: 4 },
      ]),
    (req: Request, res: Response)=> {
    if(req.body.role == "teacher"){
        createTeacher(req, res);
        return
    }
    else if(req.body.role == "admin"){
        createAdmin(req, res);
        return
    }else if(req.body.role == "manager"){
        createManager(req, res);
        return
    }
    else{
   createStudent(req, res);
   return
    }
 
});
UserRouter.get("/getStudentsCountByTeacher/:grade_id", authMiddleware, (req: Request, res: Response)=> {
    getStudentsCountTeacherDashboard(req, res)
});
UserRouter.get("/getStudentsByTeacher/:grade_id", authMiddleware, (req: Request, res: Response)=> {
getStudentsTeacherDashboard(req, res)
})
UserRouter.post("/updateUser", authMiddleware, upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "prevClassDocument", maxCount: 4 },
  ]), (req: Request<{id: string}>, res: Response)=> {
   if(req.body.role == "admin"){
     updateAdmin(req, res)
   }else if(req.body.role == "teacher"){
    updateTeacher(req, res)
   }else if(req.body.role == "manager"){
     updateManager(req, res)
   }else{
    updateStudent(req, res)
   }
})
UserRouter.get("/deleteUser/:id", authMiddleware, (req: Request<{id: string}>, res: Response)=> {

    deleteUser(req, res);
});
UserRouter.get("/remainingFees", authMiddleware, (req: Request, res: Response)=> {
    remainingFees(req, res);
});
UserRouter.post("/addUserFee", authMiddleware, (req: Request, res: Response)=> {
    addUserFee(req, res)
})
UserRouter.get("/getEmployees", authMiddleware, (req: Request, res: Response)=> {
    getEmployees(req, res);
})
UserRouter.get('/getUsersWithGrade/:grade', authMiddleware, (req: Request, res:Response)=> {
    getUsersWithGrade(req, res);
})
UserRouter.post("/login", (req: Request, res:Response)=> {
    login(req, res)
})
UserRouter.post("/chatLogin", (req: Request, res:Response)=> {
    ChatLogin(req,res);
})
UserRouter.post("/logout", (req:Request, res:Response)=> {
    logout(req, res)
})
UserRouter.post("/chatLogout", (req:Request, res:Response)=> {
    chatLogout(req, res)
})
UserRouter.get("/getGradeUsers/:grade_id", (req: Request<{grade_id: string}>, res: Response)=> {
    getUsersByGrade(req, res);
});
UserRouter.post("/updatePassword", (req: Request, res: Response)=> {
    updatePassword(req, res);
})