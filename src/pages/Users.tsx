import React, { useEffect, useState } from 'react';
import { adminService } from '../api/adminService';
import { User } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { formatDate } from '../lib/utils';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = async (p: number) => {
    setLoading(true);
    try {
      const res = await adminService.getUsers(p, 20);
      // Assuming the response structure might be { users: User[], total: number } or just User[]
      // The adminService I wrote expects { users: User[]; total: number; pages: number }
      setUsers(res.users);
      setTotal(res.total);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleUpdateStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      await adminService.updateUser(user.id, { status: newStatus as any });
      setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus as any } : u));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleUpdateRole = async (user: User) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await adminService.updateUser(user.id, { role: newRole as any });
      setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole as any } : u));
    } catch (err) {
      alert("Failed to update role");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await adminService.deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
      } catch (err) {
        alert("Failed to delete user");
      }
    }
  };

  if (loading) return <div className="p-8">Loading users...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Users</h2>
          <p className="text-sm md:text-base text-gray-500">Manage your customer base.</p>
        </div>
        <Button className="w-full sm:w-auto">Add User</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar || 'https://ui-avatars.com/api/?name=' + user.name} alt="" className="h-10 w-10 rounded-full bg-gray-200" />
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleUpdateRole(user)}>
                          <Badge variant={user.role === 'admin' ? 'default' : 'neutral'} className="capitalize cursor-pointer hover:opacity-80">
                            {user.role}
                          </Badge>
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleUpdateStatus(user)}>
                          <Badge variant={user.status === 'active' ? 'success' : 'warning'} className="capitalize cursor-pointer hover:opacity-80">
                            {user.status || (user.isVerified ? 'active' : 'inactive')}
                          </Badge>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(user.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleUpdateRole(user)} title="Toggle Role">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(user.id)} title="Delete User">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {total > 20 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Showing {users.length} of {total} users
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={users.length < 20}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
