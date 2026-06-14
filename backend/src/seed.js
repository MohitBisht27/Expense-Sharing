import dotenv from "dotenv";
dotenv.config();

import sequelize from "./config/db.js";
import { User, Group, GroupMember } from "./model/index.js";

const seedDatabase = async () => {
  try {
    console.log("Connecting to the database...");
    await sequelize.authenticate();
    
    // Sync the database (this will create tables if they don't exist, but won't drop them)
    await sequelize.sync();
    console.log("Database synced.");

    // Create Users
    const usersData = [
      { name: "Aisha", email: "aisha@example.com", password: "password123" },
      { name: "Rohan", email: "rohan@example.com", password: "password123" },
      { name: "Priya", email: "priya@example.com", password: "password123" },
      { name: "Meera", email: "meera@example.com", password: "password123" },
      { name: "Dev", email: "dev@example.com", password: "password123" },
      { name: "Sam", email: "sam@example.com", password: "password123" },
    ];

    console.log("Creating users...");
    const users = {};
    for (const data of usersData) {
      const [user] = await User.findOrCreate({
        where: { email: data.email },
        defaults: data,
      });
      users[data.name] = user;
    }
    console.log("Users created successfully.");

    // Create Group
    console.log("Creating 'Flatmates' group...");
    const [group] = await Group.findOrCreate({
      where: { name: "Flatmates" },
      defaults: {
        description: "Shared expenses for the flat",
        createdBy: users["Aisha"].id,
      },
    });
    console.log("Group created successfully.");

    // Add Members to Group with specific timelines based on the assignment
    // - Aisha, Rohan, Priya, Meera have been tracking since February.
    // - Meera moved out at the end of March (set leftAt to 2026-03-31).
    // - Sam moved in mid-April (set joinedAt to 2026-04-15).
    // - Dev joined for a trip, but also visited in Feb, so we set his joinedAt to early Feb to avoid timeline anomalies for his earlier visit.
    
    const membersData = [
      { name: "Aisha", joinedAt: new Date("2026-01-01"), leftAt: null },
      { name: "Rohan", joinedAt: new Date("2026-01-01"), leftAt: null },
      { name: "Priya", joinedAt: new Date("2026-01-01"), leftAt: null },
      { name: "Meera", joinedAt: new Date("2026-01-01"), leftAt: new Date("2026-03-31") },
      { name: "Dev", joinedAt: new Date("2026-01-01"), leftAt: null },
      { name: "Sam", joinedAt: new Date("2026-04-15"), leftAt: null },
    ];

    console.log("Adding members to the group...");
    for (const mData of membersData) {
      const user = users[mData.name];
      
      const existingMember = await GroupMember.findOne({
        where: { groupId: group.id, userId: user.id }
      });

      if (existingMember) {
        await existingMember.update({
          joinedAt: mData.joinedAt,
          leftAt: mData.leftAt,
          isActive: mData.leftAt ? false : true
        });
      } else {
        await GroupMember.create({
          groupId: group.id,
          userId: user.id,
          joinedAt: mData.joinedAt,
          leftAt: mData.leftAt,
          isActive: mData.leftAt ? false : true
        });
      }
    }
    console.log("Members configured with correct joinedAt and leftAt timelines.");
    
    // Seed Expenses from CSV
    console.log("Seeding expenses from CSV...");
    const csvContent = `date,description,paid_by,amount,currency,split_type,split_with,split_details,notes
01-02-2026,February rent,Aisha,48000,INR,equal,Aisha;Rohan;Priya;Meera,,
03-02-2026,Groceries BigBasket,Priya,2340,INR,equal,Aisha;Rohan;Priya;Meera,,
05-02-2026,Wifi bill Feb,Rohan,1199,INR,equal,Aisha;Rohan;Priya;Meera,,
08-02-2026,Dinner at Marina Bites,Dev,3200,INR,equal,Aisha;Rohan;Priya;Dev,,Dev visiting for the weekend
08-02-2026,dinner - marina bites,Dev,3200,INR,equal,Aisha;Rohan;Priya;Dev,,
10-02-2026,Electricity Feb,Aisha,1200,INR,equal,Aisha;Rohan;Priya;Meera,,
12-02-2026,Maid salary Feb,Meera,3000,INR,equal,Aisha;Rohan;Priya;Meera,,
14-02-2026,Movie night snacks,priya,640,INR,equal,Aisha;Rohan;Priya,,Meera skipped
15-02-2026,Cylinder refill,Rohan,899.995,INR,equal,Aisha;Rohan;Priya;Meera,,
18-02-2026,Groceries DMart,Priya,1875,INR,equal,Aisha;Rohan;Priya;Meera,,
20-02-2026,Aisha birthday cake,Rohan,1500,INR,unequal,Rohan;Priya;Meera,Rohan 700; Priya 400; Meera 400,Aisha not charged obviously
22-02-2026,House cleaning supplies,,,780,INR,equal,Aisha;Rohan;Priya;Meera,,can't remember who paid
25-02-2026,Rohan paid Aisha back,Rohan,5000,INR,,Aisha,,this is a settlement not an expense??
28-02-2026,Pizza friday,Aisha,1440,INR,percentage,Aisha;Rohan;Priya;Meera,Aisha 20%; Rohan 30%; Priya 30%; Meera 20%,percentages might be off
01-03-2026,March rent,Aisha,48000,INR,equal,Aisha;Rohan;Priya;Meera,,
03-03-2026,Groceries BigBasket,Meera,2810,INR,equal,Aisha;Rohan;Priya;Meera,,
05-03-2026,Wifi bill Mar,Rohan,1199,INR,equal,Aisha;Rohan;Priya;Meera,,
08-03-2026,Goa flights,Aisha,32400,INR,equal,Aisha;Rohan;Priya;Dev,,trip starts!
09-03-2026,Goa villa booking,Dev,540,USD,equal,Aisha;Rohan;Priya;Dev,,booked on intl site
10-03-2026,Beach shack lunch,Rohan,84,USD,equal,Aisha;Rohan;Priya;Dev,,
10-03-2026,Scooter rentals,Priya,3600,INR,share,Aisha;Rohan;Priya;Dev,Aisha 1; Rohan 2; Priya 1; Dev 2,Rohan and Dev took the bigger ones
11-03-2026,Parasailing,Dev,150,USD,Aisha;Rohan;Priya;Dev,,Kabir joined for the day
11-03-2026,Dinner at Thalassa,Aisha,2400,INR,equal,Aisha;Rohan;Priya;Dev,,
11-03-2026,Thalassa dinner,Rohan,2450,INR,equal,Aisha;Rohan;Priya;Dev,,Aisha also logged this I think hers is wrong
12-03-2026,Parasailing refund,Dev,-30,USD,equal,Aisha;Rohan;Priya;Dev,,one slot got cancelled
14-03-2026,Airport cab,rohan,1100,INR,equal,Aisha;Rohan;Priya;Dev,,
15-03-2026,Groceries DMart,Priya,2105,,equal,Aisha;Rohan;Priya;Meera,,forgot to set currency
18-03-2026,Electricity Mar,Aisha,1450,INR,equal,Aisha;Rohan;Priya;Meera,,
20-03-2026,Maid salary Mar,Meera,3000,INR,equal,Aisha;Rohan;Priya;Meera,,
22-03-2026,Dinner order Swiggy,Priya,0,INR,equal,Aisha;Rohan;Priya;Meera,,counted twice earlier - fixing later
25-03-2026,Weekend brunch,Meera,2200,INR,percentage,Aisha;Rohan;Priya;Meera,Aisha 20%; Rohan 30%; Priya 30%; Meera 20%,
28-03-2026,Meera farewell dinner,Aisha,4800,INR,equal,Aisha;Rohan;Priya;Meera,,Meera moving out Sunday :(
04-05-2026,Deep cleaning service,Rohan,2500,INR,equal,Aisha;Rohan;Priya,,is this April 5 or May 4? format is a mess
01-04-2026,April rent,Aisha,48000,INR,share,Aisha;Rohan;Priya,Aisha 2; Rohan 1; Priya 1,Aisha took Meera's room too
02-04-2026,Groceries BigBasket,Priya,2640,INR,equal,Aisha;Rohan;Priya;Meera,,oops Meera still in the group list
05-04-2026,Wifi bill Apr,Rohan,1199,INR,equal,Aisha;Rohan;Priya,,
08-04-2026,Sam deposit share,Sam,15000,INR,equal,Aisha,,Sam moving in! paid Aisha his deposit
10-04-2026,Housewarming drinks,Sam,3100,INR,equal,Aisha;Rohan;Priya;Sam,,
12-04-2026,Electricity Apr,Aisha,1380,INR,equal,Aisha;Rohan;Priya;Sam,,
15-04-2026,Groceries DMart,Sam,1990,INR,equal,Aisha;Rohan;Priya;Sam,,
18-04-2026,Furniture for common room,Aisha,12000,INR,equal,Aisha;Rohan;Priya;Sam,,Aisha 1 part; Priya 1 part,someone added shares anyway
20-04-2026,Maid salary Apr,Priya,3000,INR,equal,Aisha;Rohan;Priya;Sam,,`;
    
    // We dynamically import the ImportService to process this CSV
    const ImportService = (await import('./services/import.service.js')).default;
    const { ImportLog } = await import('./model/index.js');
    
    const importService = new ImportService();
    const result = await importService.processImport(group.id, Buffer.from(csvContent), users["Aisha"].id);
    
    await ImportLog.create({
      groupId: group.id,
      fileName: 'seed_expenses.csv',
      totalRows: result.totalRows,
      successfulRows: result.successfulRows,
      failedRows: result.failedRows,
      anomalies: result.anomalies,
      importedBy: users["Aisha"].id,
      status: "COMPLETED",
    });
    console.log(`Imported ${result.successfulRows} expenses with ${result.failedRows} failed and ${result.anomalies.length} anomalies.`);
    
    console.log("\n=================================");
    console.log("SEEDING COMPLETED SUCCESSFULLY!");
    console.log(`Test Group ID: ${group.id}`);
    console.log("Use Aisha's email (aisha@example.com) and password 'password123' to login.");
    console.log("=================================\n");
    
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
};

seedDatabase();
