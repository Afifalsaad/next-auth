"use server";

import { dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { IoCompassOutline } from "react-icons/io5";

export const postUser = async (payLoad) => {
  //   0 - validation
  const email = payLoad.email;
  const password = payLoad.password;
  if (!email) {
    return {
      status: 400,
      message: "Please provide email",
    };
  }
  if (!password) {
    return {
      status: 400,
      message: "Please provide password",
    };
  }

  //   1 - check if user exist or not
  const isExist = await dbConnect("users").findOne({ email: payLoad.email });
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

  // 3 - send user data to database
  const res = await dbConnect("users").insertOne(newUser);
  if (res.acknowledged) {
    return {
      success: true,
      message: `user created with ${res.insertedId.toString()}`,
    };
  }
};
