import { getUsers } from "../actions/userActions";
import UserList from "@/components/UserList";
export const dynamic = 'force-dynamic';

export default async function HomePage() {
    const users = await getUsers()

    return(
        <main className="min-h-screen p-10 bg-gray-900 flex flex-col items-center">
            <h1 className="text-4x1 font-bold mb-8 text-green-400">Aréa Administrativa</h1>
            <UserList users={users}/>
        </main>
    )
}