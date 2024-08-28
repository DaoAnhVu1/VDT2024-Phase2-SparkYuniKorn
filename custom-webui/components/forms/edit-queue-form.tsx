"use client";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useModal } from "@/hooks/useModal";

const resourceSchema = z.object({
    vcore: z.number().optional(),
    memory: z.string().optional(),
});

const propertiesSchema = z.object({
    applicationSortPolicy: z.string(),
    applicationSortPriority: z.string(),
    priorityPolicy: z.string(),
    priorityOffset: z.number(),
    preemptionPolicy: z.string(),
    preemptionDelay: z.number()
});

const formSchema = z.object({
    name: z.string(),
    maxapplications: z.number().int().nonnegative(),
    adminacl: z.string(),
    submitacl: z.string(),
    resources: z.object({
        guaranteed: resourceSchema,
        max: resourceSchema,
    }).optional(),
    properties: propertiesSchema.optional()
});

interface EditQueueFormProps {
    queueInfo: any;
    partitionName: any;
    onClose: any;
    level: number;
}

const EditQueueForm = ({ queueInfo, partitionName, onClose, level }: EditQueueFormProps) => {
    console.log(queueInfo)
    const { toast } = useToast();
    const { onOpen } = useModal();
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
            } : undefined,
            properties: {
                applicationSortPolicy: queueInfo?.properties?.["application.sort.policy"] || "fifo",
                applicationSortPriority: queueInfo?.properties?.["application.sort.priority"] || "enabled",
                priorityPolicy: queueInfo?.properties?.["priority.policy"] || "default",
                priorityOffset: parseInt(queueInfo?.properties?.["priority.offset"]) || 0,
                preemptionPolicy: queueInfo?.properties?.["preemption.policy"] || "default",
                preemptionDelay: parseInt(queueInfo?.properties?.["preemption.delay"]) || 30
            }
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values)
            const finalResult = { partitionName, oldName: queueInfo.name, queueInfo: values, level };
            await axios.patch("/api/queue", finalResult);
            onClose();
            window.location.reload()
        } catch (error) {
            console.error(error);
            toast({
                title: "Failed to Change Queue Config",
                description: "There was an error updating the queue configuration. Please try again.",
                variant: "destructive"
            });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                                    <Input
                                        type="number"
                                        placeholder="Max Applications"
                                        onChange={(event) => {
                                            const value = event.target.value ? parseInt(event.target.value) : 0;
                                            field.onChange(value);
                                        }}
                                        value={field.value}
                                    />
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

                    {level !== 0 && (
                        <>
                            <FormField
                                control={form.control}
                                name="resources.guaranteed.vcore"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Guaranteed VCore</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Guaranteed VCore"
                                                onChange={(event) => {
                                                    const value = event.target.value ? parseInt(event.target.value) : 0;
                                                    field.onChange(value);
                                                }}
                                                value={field.value}
                                            />
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
                                            <Input
                                                type="number"
                                                placeholder="Max VCore"
                                                onChange={(event) => {
                                                    const value = event.target.value ? parseInt(event.target.value) : 0;
                                                    field.onChange(value);
                                                }}
                                                value={field.value}
                                            />
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


                    <FormField
                        control={form.control}
                        name="properties.applicationSortPolicy"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Application Sort Policy</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Application Sort Policy" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="fifo">FIFO</SelectItem>
                                        <SelectItem value="fair">FAIR</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="properties.applicationSortPriority"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Application Sort Priority</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Application Sort Priority" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="enabled">Enabled</SelectItem>
                                        <SelectItem value="disabled">Disabled</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="properties.priorityPolicy"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Priority Policy</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Priority Policy" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="default">default</SelectItem>
                                        <SelectItem value="fence">fence</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="properties.priorityOffset"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Priority Offset</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Priority Offset"
                                        onChange={(event) => {
                                            const value = event.target.value ? parseInt(event.target.value) : 0;
                                            field.onChange(value);
                                        }}
                                        value={field.value}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="properties.preemptionPolicy"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Preemption Policy</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Preemption Policy" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="default">default</SelectItem>
                                        <SelectItem value="fence">fence</SelectItem>
                                        <SelectItem value="disable">disable</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="properties.preemptionDelay"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Preemption Delay</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="PreemptionDelay"
                                        onChange={(event) => {
                                            const value = event.target.value ? parseInt(event.target.value) : 0;
                                            field.onChange(value);
                                        }}
                                        value={field.value}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-row-reverse gap-3 text-end mt-5">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        Save
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            onOpen("createChild", { parentName: queueInfo.name, maxapplications: queueInfo.maxapplications });
                        }}
                    >
                        Create child
                    </Button>

                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                            onOpen("deleteQueue", { name: queueInfo.name, partitionName });
                        }}
                    >
                        Delete
                    </Button>
                </div>
            </form >
        </Form >
    );
}

export default EditQueueForm;