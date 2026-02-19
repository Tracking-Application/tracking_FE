import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomers } from "../../slice/admin/usersSlice";
import "../../style/admin/Users.css";

const Users = () => {
  const dispatch = useDispatch();
  const {
    users,
    loading,
    error,
  } = useSelector((state) => state.adminUsers);

  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users: {error}</div>;

  return (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th className="users-table-head-green">Email</th>
            <th>Phone</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            [...users]
              .sort((a, b) => {
                const idA = a.id || a._id;
                const idB = b.id || b._id;
                // Assuming IDs are numbers or strings that can be compared
                if (typeof idA === "string" && typeof idB === "string") {
                  return idA.localeCompare(idB, undefined, { numeric: true });
                }
                return idA - idB;
              })
              .map((user) => (
                <tr key={user.id || user._id}>
                  <td className="td-id">{user.id || user._id}</td>
                  <td className="td-name">{user.name}</td>
                  <td className="td-text">{user.email}</td>
                  <td className="td-text">
                    {user.phone || user.mobile || user.phoneNumber || "N/A"}
                  </td>
                  <td className="td-text">{user.role || "User"}</td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="5" className="admin-empty">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
