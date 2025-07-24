import {z} from "zod"

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(3)
})

type loginFields = z.infer<typeof loginSchema>

export {
    loginSchema,
    type loginFields
}

