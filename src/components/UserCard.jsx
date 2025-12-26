"use client";
import { useSession } from "next-auth/react";
import React from "react";

const UserCard = () => {
  const session = useSession();
  return (
    <div>
      <h2 className="font-bold">User Client</h2>
      <div className="border-2 p-4 rounded">{JSON.stringify(session)}</div>
    </div>
  );
};

export default UserCard;
