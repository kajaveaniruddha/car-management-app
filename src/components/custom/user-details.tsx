"use client";

import { useSession } from "next-auth/react";

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
        </div>
    );
};

export default UserDetails;
