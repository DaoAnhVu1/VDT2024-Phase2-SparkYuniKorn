import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button';
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";

// Define the schema
const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters"),
    nodesortpolicy: z.string().max(50, "Policy cannot exceed 50 characters").optional(),
    preemption: z.boolean().optional(),
});

interface EditPartitionFormProps {
    data: {
        name?: string;
        nodesortpolicy?: { type: string };
        preemption?: { enabled: boolean };
    };
    onClose: any;
}

export default function EditPartitionForm({ data, onClose }: EditPartitionFormProps) {
    const router = useRouter()
    const { toast } = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: data?.name || "",
            nodesortpolicy: data?.nodesortpolicy?.type || "fair",
            preemption: data?.preemption?.enabled || false,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            let finalResult = { currentName: data.name, newConfig: { ...values } }
            console.log(finalResult)
            await axios.patch("/api/partition", finalResult)
            window.location.reload()
            onClose()
        } catch (error) {
            toast({
                title: "Failed to change queue config",
                description: "Please make sure the input is correct and follow the rule of Yunikorn",
            })
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Field */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="PARTITION NAME" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Node Sort Policy Field */}
                <FormField
                    control={form.control}
                    name="nodesortpolicy"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Node Sort Policy</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a policy" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fair">Fair</SelectItem>
                                        <SelectItem value="binpacking">Binpacking</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Preemption Field */}
                <FormField
                    control={form.control}
                    name="preemption"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Preemption</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={(value) => field.onChange(value === "true")}
                                    value={field.value?.toString()}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">True</SelectItem>
                                        <SelectItem value="false">False</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Submit Button */}
                <div className="text-end">
                    <Button type="submit" disabled={form.formState.isSubmitting}>Submit</Button>
                </div>
            </form>
        </Form>
    );
}
