import bcrypt from "bcrypt";
import { User } from "../models/User.js";

export const seedDefaultSuperAdmin = async () => {
  const email = "srivaishnavijewellers1@gmail.com";
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return;
  }

  const hashedPassword = await bcrypt.hash("123456", 10);

  await User.create({
    name: "Super Admin",
    email,
    password: hashedPassword,
    role: "SUPER_ADMIN",
    status: "ACTIVE"
  });

  console.log("Default super admin created");
};

