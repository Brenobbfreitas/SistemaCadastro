import UserForm from "@/components/UserForm";
import {addUser} from "@/app/actions";

export default function CadastroPage() {
    return(
        <div className="flex min-h-screen items-center justify-center bg-gray-900">
            <UserForm saveAction={addUser}/>
        </div>
    )
}