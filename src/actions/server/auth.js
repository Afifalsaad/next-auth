"use server";

import { dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { IoCompassOutline } from "react-icons/io5";

export const postUser = async (payLoad) => {
  console.log(payLoad);

  //   1 - check if user exist or not
  const isExist = await dbConnect("users").findOne({ email: payLoad.email });
  console.log(dbConnect);
  if (isExist) {
    return {
      success: false,
      message: "user already exists",
    };
  }

  const hashPassword = await bcrypt.hash(payLoad.password, 10);
  // 2 - register user

  const newUser = {
    ...payLoad,
    createdAt: new Date().toISOString(),
    role: "user",
    password: hashPassword,
  };

  console.log(newUser);

  // 3 - send user data to database
  const res = await dbConnect("users").insertOne(newUser);
  if (res.acknowledged) {
    return {
      success: true,
      message: `user created with ${res.insertedId.toString()}`,
    };
  }
};
