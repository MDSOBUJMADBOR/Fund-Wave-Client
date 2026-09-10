
"use client";

import React, { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: "Admin" | "Creator" | "Supporter";
  credits: number;
}

const ManageUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // Fetch Users
  // =========================
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/user");

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // Remove User
  // =========================
  const handleRemove = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this user?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/user/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== id)
      );

      alert("User removed successfully");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to remove user");
    }
  };

  // =========================
  // Update Role
  // =========================
  const handleRoleChange = async (
    id: string,
    role: "Admin" | "Creator" | "Supporter"
  ) => {
    try {
      const res = await fetch(`http://localhost:5000/user/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        throw new Error("Failed to update role");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, role } : user
        )
      );

      alert("Role updated successfully");
    } catch (error) {
      console.error("Role update error:", error);
      alert("Failed to update role");
    }
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="text-sm text-gray-500">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
      {/* =========================
          Header
      ========================== */}
      <div className="mb-5 sm:mb-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
              Manage Users
            </h1>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500 sm:text-sm">
              Manage all users, update their roles, or remove users.
            </p>
          </div>

          {/* Total Users */}
          <div className="w-fit rounded-lg bg-blue-50 px-3 py-2 sm:px-4">
            <p className="text-xs text-blue-500">
              Total Users
            </p>

            <p className="text-lg font-bold text-blue-700">
              {users.length}
            </p>
          </div>
        </div>
      </div>

      {/* =================================================
          MOBILE CARD VIEW
          hidden from md and above
      ================================================== */}
      <div className="space-y-3 md:hidden">
        {users.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-10 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              No users found.
            </p>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              {/* User Info */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={
                      user.image ||
                      "https://ui-avatars.com/api/?name=User"
                    }
                    alt={user?.name}
                    className="h-11 w-11 shrink-0 rounded-full object-cover"
                  />

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-800">
                      {user.name}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Credits */}
                <div className="shrink-0 text-right">
                  <p className="text-xs text-gray-400">
                    Credits
                  </p>

                  <p className="font-bold text-blue-600">
                    {user.credits}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="my-4 border-t border-gray-100" />

              {/* Role + Action */}
              <div className="flex flex-col gap-3 xs:flex-row sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    Role
                  </label>

                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(
                        user._id,
                        e.target.value as
                          | "Admin"
                          | "Creator"
                          | "Supporter"
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Creator">Creator</option>
                    <option value="Supporter">Supporter</option>
                  </select>
                </div>

                <button
                  onClick={() => handleRemove(user._id)}
                  className="w-full rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-600 hover:text-white sm:w-auto"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* =================================================
          TABLE VIEW
          tablet + desktop
      ================================================== */}
      <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            {/* Table Header */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600 lg:px-5">
                  User
                </th>

                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600 lg:px-5">
                  Email
                </th>

                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600 lg:px-5">
                  Role
                </th>

                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600 lg:px-5">
                  Credits
                </th>

                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600 lg:px-5">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-sm text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="transition hover:bg-gray-50"
                  >
                    {/* User */}
                    <td className="px-4 py-4 lg:px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            user.image ||
                            "https://ui-avatars.com/api/?name=User"
                          }
                          alt={user.image}
                          className="h-10 w-10 rounded-full object-cover lg:h-11 lg:w-11"
                        />

                        <div className="min-w-0">
                          <p className="max-w-[150px] truncate text-sm font-semibold text-gray-800 lg:max-w-[200px]">
                            {user.name}
                          </p>

                          <p className="max-w-[150px] truncate text-xs text-gray-400 lg:max-w-[200px]">
                            ID: {user._id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-4 lg:px-5">
                      <p className="max-w-[180px] truncate text-sm text-gray-600 lg:max-w-[250px]">
                        {user.email}
                      </p>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-4 lg:px-5">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(
                            user._id,
                            e.target.value as
                              | "Admin"
                              | "Creator"
                              | "Supporter"
                          )
                        }
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Creator">Creator</option>
                        <option value="Supporter">Supporter</option>
                      </select>
                    </td>

                    {/* Credits */}
                    <td className="px-4 py-4 lg:px-5">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
                        {user.credits}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 lg:px-5">
                      <button
                        onClick={() => handleRemove(user._id)}
                        className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-600 hover:text-white"
                      >
                        Remove
                      </button>
                      
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsersPage;

