import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

const resourceSchema = z.object({
    vcore: z.number().optional(),
    memory: z.string().optional(),
});

const formSchema = z.object({
    name: z.string(),
    maxapplications: z.number().int().nonnegative(),
    adminacl: z.string(),
    submitacl: z.string(),
    resources: z.object({
        guaranteed: resourceSchema,
        max: resourceSchema,
    }).optional(), // Mark resources as optional in the schema
});

interface EditQueueFormProps {
    queueInfo: any;
    partitionName: any;
    onClose: any;
    level: number;
}

const EditQueueForm = ({ queueInfo, partitionName, onClose, level }: EditQueueFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: queueInfo?.name || "",
            maxapplications: queueInfo?.maxapplications || 0,
            submitacl: queueInfo?.submitacl || "",
            adminacl: queueInfo?.adminacl || "",
            resources: level !== 0 ? {
                guaranteed: {
                    vcore: queueInfo?.resources?.guaranteed?.vcore || 0,
                    memory: queueInfo?.resources?.guaranteed?.memory || ""
                },
                max: {
                    vcore: queueInfo?.resources?.max?.vcore || 0,
                    memory: queueInfo?.resources?.max?.memory || ""
                }
            } : undefined // Do not set resources if level is 0
        }
    });

    const router = useRouter()

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const finalResult = { partitionName, oldName: queueInfo.name, queueInfo: values, level };
        console.log(finalResult);
        await axios.patch("/api/queue", finalResult);
        onClose();
        window.location.reload()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} >
                <div className="space-y-6 max-h-[500px] overflow-y-scroll p-3">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="QUEUE NAME" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="maxapplications"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Max Applications</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Max Applications" onChange={(event) => {
                                        const value = event.target.value ? parseInt(event.target.value) : 0;
                                        field.onChange(value);
                                    }} value={field.value} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="adminacl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>AdminACL</FormLabel>
                                <FormControl>
                                    <Input placeholder="AdminACL" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="submitacl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>SubmitACL</FormLabel>
                                <FormControl>
                                    <Input placeholder="SubmitACL" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Conditionally render resource fields only if level is not 0 */}
                    {level !== 0 && (
                        <>
                            <FormField
                                control={form.control}
                                name="resources.guaranteed.vcore"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Guaranteed VCore</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Guaranteed VCore" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="resources.guaranteed.memory"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Guaranteed Memory</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Guaranteed Memory" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="resources.max.vcore"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Max VCore</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Max VCore" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="resources.max.memory"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Max Memory</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Max Memory" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                </div>

                <div className="text-end mt-5">
                    <Button type="submit" disabled={form.formState.isSubmitting}>Save</Button>
                </div>
            </form>
        </Form>
    );
}

export default EditQueueForm;