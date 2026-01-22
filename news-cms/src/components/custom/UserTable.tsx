'use client';

import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User } from '@/types';
import { Plus, Key, ShieldCheck } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createUser, changePassword } from '@/app/(dashboard)/users/actions';
import { toast } from 'sonner';

interface UserTableProps {
    users: User[];
}

export function UserTable({ users }: UserTableProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await createUser(formData);
        setIsLoading(false);
        if (result.success) {
            toast.success("User created successfully");
            setIsCreateOpen(false);
            setFormData({ name: '', email: '', password: '' });
        } else {
            toast.error(result.error || "Failed to create user");
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await changePassword(oldPassword, newPassword);
        setIsLoading(false);
        if (result.success) {
            toast.success("Password updated successfully");
            setIsPasswordOpen(false);
            setNewPassword('');
            setOldPassword('');
        } else {
            toast.error(result.error || "Failed to update password");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">User Management</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsPasswordOpen(true)}>
                        <Key className="h-4 w-4 mr-2" /> Change My Password
                    </Button>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" /> Add Admin
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Administrators</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Created At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-primary">
                                            <ShieldCheck className="h-4 w-4" />
                                            {user.role}
                                        </div>
                                    </TableCell>
                                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Create User Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Administrator</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Initial Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Creating..." : "Create User"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Change Password Dialog */}
            <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change My Password</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleChangePassword} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="old-password">Old Password</Label>
                            <Input
                                id="old-password"
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsPasswordOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Updating..." : "Update Password"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
