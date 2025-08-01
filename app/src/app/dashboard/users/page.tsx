'use client'

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent } from '@/components/ui/card';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/Topbar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { v4 as uuidv4 } from 'uuid';
import { FormLabel } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { FullScreenLoader } from '@/components/layout/FullScreenLoader';
import AccessControl from '@/components/AccessControl';

function UsersPage() {
    const supabase = createClient()
    const [profiles, setProfiles] = useState<any[]>([]);
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const pageSize = 10;
    const [totalCount, setTotalCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    // Modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<any>(null);
    const [editForm, setEditForm] = useState({ email: '', first_name: '', last_name: '', birth_of_date: '', phone_number: '', role: '' });
    const [addForm, setAddForm] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        birth_of_date: '',
        phone_number: '',
        role: '',
    });

    useEffect(() => {
        fetchProfiles();
    }, [search, page]);

    async function fetchProfiles() {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        let query = supabase
            .from('profiles')
            .select('id, email, avatar, first_name, last_name, birth_of_date, phone_number, role, created_at', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);
        if (search) query = query.ilike('first_name', `%${search}%`).or(`last_name.ilike.%${search}%`);
        const { data, count, error } = await query;
        if (error) console.error('Error fetching profiles:', error);
        else {
            console.log('profiles: ', data)
            setProfiles(data || []);
            setTotalCount(count || 0);
        }

        setLoading(false)
    }

    async function deleteProfile(id: string) {
        setLoading(true)
        const res = await fetch('/api/delete-account', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                uid: id
            })
        })

        if (res.ok) {
            fetchProfiles()
        } else {
            console.error(await res.json())
        }
        setLoading(false)
    }

    async function saveProfile() {
        if (!selectedProfile) return;
        const { error } = await supabase
            .from('profiles')
            .update(editForm)
            .eq('id', selectedProfile.id);
        if (error) console.error('Error updating profile:', error);
        else {
            fetchProfiles();
            setIsEditModalOpen(false);
            setSelectedProfile(null);
        }
    }

    async function addProfile() {
        setLoading(true)
        // 1) Sign up the user
        const { data, error: signUpError } = await supabase.auth.signUp({
            email: addForm.email,
            password: addForm.password,
        });

        if (signUpError) {
            console.error("Error creating auth user:", signUpError);
            setLoading(false)
            return;
        }

        const user = data?.user;
        if (!user) {
            console.error("No user returned from signUp");
            setLoading(false)
            return;
        }

        // 2) Insert the profile row using the returned user.id
        const profileData = {
            id: user.id,
            email: addForm.email,
            first_name: addForm.first_name,
            last_name: addForm.last_name,
            birth_of_date: addForm.birth_of_date,
            phone_number: addForm.phone_number,
            role: addForm.role,
        };

        const { error: insertError } = await supabase
            .from("profiles")
            .insert([profileData]);

        if (insertError) {
            console.error("Error adding profile:", insertError);
        } else {
            fetchProfiles();
            setIsAddModalOpen(false);
            setAddForm({
                email: "",
                password: "",
                first_name: "",
                last_name: "",
                birth_of_date: "",
                phone_number: "",
                role: "",
            });
        }
        setLoading(false)
    }

    const totalPages = Math.ceil(totalCount / pageSize);

    function openDeleteModal(profile: any) {
        setSelectedProfile(profile);
        setIsDeleteModalOpen(true);
    }

    function openEditModal(profile: any) {
        setSelectedProfile(profile);
        setEditForm({
            email: profile.first_name || '',
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            birth_of_date: profile.birth_of_date || '',
            phone_number: profile.phone_number || '',
            role: profile.role || ''
        });
        setIsEditModalOpen(true);
    }

    function openAddModal() {
        setIsAddModalOpen(true);
    }

    if (loading) return <FullScreenLoader />;

    return (
        <>
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <TopBar title="Users" user={{ name: 'Admin' }} />
                    <div className="p-6 bg-gray-50 h-screen overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold"></h1>
                            <div className="flex items-center space-x-2">
                                <Input
                                    placeholder="Search by name"
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                    className="w-64"
                                />
                                <Search />
                                <Button onClick={openAddModal}>Add User</Button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-2 pr-4">Email</th>
                                        <th className="py-2 pr-4">Name</th>
                                        <th className="py-2 pr-4">DOB</th>
                                        <th className="py-2 pr-4">Phone</th>
                                        <th className="py-2 pr-4">Role</th>
                                        <th className="py-2 pr-4">Created At</th>
                                        <th className="py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {profiles.map((p) => (
                                        <tr key={p.id} className="border-b">
                                            <td className="py-2 pr-4">{p.email}</td>
                                            <td className="py-2 pr-4">{p.first_name} {p.last_name}</td>
                                            <td className="py-2 pr-4">{p.birth_of_date}</td>
                                            <td className="py-2 pr-4">{p.phone_number}</td>
                                            <td className="py-2 pr-4">{p.role}</td>
                                            <td className="py-2 pr-4">{new Date(p.created_at).toLocaleDateString()}</td>
                                            <td className="py-2 space-x-2">
                                                <Button size="sm" onClick={() => openEditModal(p)}>Edit</Button>
                                                <Button size="sm" variant="destructive" onClick={() => openDeleteModal(p)}>Delete</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-center items-center space-x-4 mt-4">
                            <Button disabled={page <= 1} onClick={() => setPage(page => Math.max(page - 1, 1))}>Previous</Button>
                            <span>Page {page} of {totalPages}</span>
                            <Button disabled={page >= totalPages} onClick={() => setPage(page => Math.min(page + 1, totalPages))}>Next</Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-90">
                    <Card className="min-w-2/4 max-h-[80vh] overflow-y-auto">
                        <CardContent className="p-6">
                            <h2 className="text-lg font-semibold mb-4">Add New User</h2>
                            <div className="space-y-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={addForm.email}
                                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                                />
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={addForm.password}
                                    onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                                />
                                <Label htmlFor="first_name">First Name</Label>
                                <Input
                                    placeholder="First Name"
                                    value={addForm.first_name}
                                    onChange={(e) => setAddForm({ ...addForm, first_name: e.target.value })}
                                />
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input
                                    placeholder="Last Name"
                                    value={addForm.last_name}
                                    onChange={(e) => setAddForm({ ...addForm, last_name: e.target.value })}
                                />
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    type="date"
                                    value={addForm.birth_of_date}
                                    onChange={(e) => setAddForm({ ...addForm, birth_of_date: e.target.value })}
                                />
                                <Label htmlFor="phone_number">Phone Number</Label>
                                <Input
                                    placeholder="Phone Number"
                                    value={addForm.phone_number}
                                    onChange={(e) => setAddForm({ ...addForm, phone_number: e.target.value })}
                                />
                                <Label htmlFor="role">Select Role</Label>
                                <select
                                    id="add-role"
                                    value={addForm.role}
                                    onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                >
                                    <option value="">Select role</option>
                                    <option value="staff">Staff</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="mt-6 flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                                <Button onClick={addProfile}>Add</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && selectedProfile && (
                <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-90">
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
                            <p>Are you sure you want to delete <strong>{selectedProfile.first_name} {selectedProfile.last_name}</strong>?</p>
                            <div className="mt-4 flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                                <Button variant="destructive" onClick={() => { deleteProfile(selectedProfile.id); setIsDeleteModalOpen(false); }}>Delete</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {isEditModalOpen && selectedProfile && (
                <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-90 overflow-auto py-4">
                    <Card className="min-w-2/4 max-h-[80vh] overflow-y-auto">
                        <CardContent className="p-6">
                            <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
                            <div className="space-y-4">
                                {['Email', 'Password', 'First Name', 'Last Name', 'Date of Birth', 'Phone Number'].map((label, i) => (
                                    <div key={i}>
                                        <Label className="pb-1" htmlFor={`edit-${label.replace(/ /g, '').toLowerCase()}`}>{label}</Label>
                                        <Input
                                            id={`edit-${label.replace(/ /g, '').toLowerCase()}`}
                                            type={label === 'Password' ? 'password' : label === 'Date of Birth' ? 'date' : 'text'}
                                            value={editForm[label.replace(/ /g, '_').toLowerCase()]}
                                            onChange={e => setEditForm({ ...editForm, [label.replace(/ /g, '_').toLowerCase()]: e.target.value })}
                                        />
                                    </div>
                                ))}
                                <div>
                                    <Label htmlFor="edit-role">Role</Label>
                                    <select id="edit-role" value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })} className="w-full px-3 py-2 border rounded">
                                        <option value="">Select role</option>
                                        <option value="staff">Staff</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                                <Button onClick={saveProfile}>Save</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
}

export default AccessControl(UsersPage, { access: ['admin'] })