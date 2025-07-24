import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type loginFields, loginSchema } from "@/form/formSchema";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import {
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
    FormField,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";

const Login = () => {
    const form = useForm<loginFields>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: loginFields) {
        try {
            toast.info("logging in ...");
            console.log(
                `API CALL NOW WITH: ${data.email} AND ${data.password}`
            );
        } catch {
            toast.error("Invalid credentials!");
        }
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-300 px-4">
                <div className="flex flex-col md:flex-row w-full max-w-2xl h-auto md:h-[400px] rounded-xl overflow-hidden shadow-2xl bg-white">
                    <div className="md:w-[30%] w-full bg-neutral-800 flex flex-col items-center justify-center p-6">
                        <img
                            src={logo}
                            alt="Company Logo"
                            className="w-24 h-24 mb-3 shadow-lg rounded-full"
                        />
                        <h1 className="text-lg font-semibold text-white">
                            Defsecone
                        </h1>
                    </div>
                    <div className="md:w-[70%] w-full flex items-center justify-center p-5 border-l ">
                        <div className="w-full max-w-80">
                            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                                Login
                            </h2>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-8"
                                >
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="JohnDoe@email.com"
                                                        {...field}
                                                        className="w-80"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        {...field}
                                                        className="w-80 mb-2"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    

                                    <div className="flex justify-center items-center gap-4">
                                        <Button
                                            type="submit"
                                            className="hover:bg-blue-300 hover:text-black h-10 w-20 bg-black text-white text-lg"
                                        >
                                            Login
                                        </Button>
                                        <p>
                                            Or
                                            <a
                                                href="/signup"
                                                className="text-blue-400 text-lg ml-3"
                                            >
                                                Signup
                                            </a>
                                        </p>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
