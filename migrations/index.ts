import { db } from "../assets/db_connection";
import { createActivities } from "./create_activites";
import { createAdmissions } from "./create_admissions";
import { createFaqs } from "./create_faqs";
import { createGalleries } from "./create_galleries";
import { createUsers } from "./create_users";

async function createTables() {
  try {
    const tables: string[] = [
      createAdmissions,
      createActivities,
      createFaqs,
      createUsers,
      createGalleries,
    ];
    for (const query of tables) {
      await db.query(query);
      console.log("Table created =>", query.split("(")[0]?.trim());
    }
    console.log("All tables created successfully!");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}
createTables();
