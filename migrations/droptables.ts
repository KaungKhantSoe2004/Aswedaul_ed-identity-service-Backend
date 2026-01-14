import { db } from "../assets/db_connection";
async function dropTables() {
  try {
    await db.query(`DROP TABLE IF EXISTS activities`);
    console.log("Activites Table Dropped Successfully");

    await db.query(`DROP TABLE IF EXISTS admissions`);
    console.log("Admissions Table Dropped Successfully");

    await db.query(`DROP TABLE IF EXISTS faqs`);
    console.log("Faqs Table Dropped Successfully");

    await db.query(`DROP TABLE IF EXISTS galleries`);
    console.log("Galleries Table Dropped Successfully");

    await db.query(`DROP TABLE IF EXISTS users`);
    console.log("Users Table Dropped Successfully");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

dropTables();
