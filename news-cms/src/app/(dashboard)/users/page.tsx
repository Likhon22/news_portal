import { UserTable } from '@/components/custom/UserTable';
import { getUsers } from './actions';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
    const users = await getUsers();

    return (
        <div className="container mx-auto py-6">
            <UserTable users={users} />
        </div>
    );
}
