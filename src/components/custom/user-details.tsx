"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

const UserDetails = () => {
    const { data: session } = useSession()

    return (
        <div className="mb-8 p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-2">User Details</h2>
            <p className="text-gray-700">
                <strong>Name:</strong> {session?.user.name}
            </p>
            <p className="text-gray-700">
                <strong>Email:</strong> {session?.user.email}
            </p>
            <Button
                variant="ghost"
                className="w-full justify-start text-red-600 pt-10"
                onClick={() => signOut()}
            >
                <LogOut className="w-4 h-4 mr-2" />
                Log out
            </Button>
        </div>
    );
};

export default UserDetails;
