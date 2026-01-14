import { db } from "./db_connection";


const sql = `SELECT COLUMNS FROM users `;

db.query(sql, (err:Error, result: any)=> {
    if(err){
      console.log("Error in sqlCall.ts");
    }else{
        console.log(result, 'is result from db')
    }
})