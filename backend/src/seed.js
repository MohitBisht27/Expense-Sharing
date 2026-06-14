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
