import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import { type loginFields, loginSchema } from "@/form/formSchema"

import {
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
    FormField
} from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Login = () => {
    return(
        <>
            <h1>Login</h1>
        </>
    )
}

export default Login
