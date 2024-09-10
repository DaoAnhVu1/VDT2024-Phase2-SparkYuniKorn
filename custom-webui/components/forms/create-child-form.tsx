import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useModal } from "@/hooks/useModal";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters"),
    maxapplications: z.number()
});

interface CreateChildFormProps {
    parentName: string;
    parentmaxapplications?: number;
}

export default function CreateChildForm({ parentName, parentmaxapplications }: CreateChildFormProps) {
    const { toast } = useToast();
    const { onClose } = useModal();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            maxapplications: 0
        }
    });

    const router = useRouter();

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if ((parentmaxapplications && values.maxapplications > parentmaxapplications) || (parentmaxapplications && !values.maxapplications)) {
            toast({
                title: "Invalid value for max applications",
                description: "If parent max applications is set, it must be smaller than this value.",
                variant: "destructive" // You can use different variants for different types of messages
            });
            return;
        }

        try {
            await axios.post("/api/queue", { parentName, ...values });
            window.location.reload()
        } catch (error) {
            toast({
                title: "Failed to Create Queue",
                description: "There was an error creating the queue. Please try again.",
                variant: "destructive"
            });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} >
                <div className="space-y-6 max-h-[500px] overflow-y-scroll px-3">
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
                                        placeholder="Max Applications"
                                        type="number" // Ensure the input type is number for validation
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

                    <div className="text-end">
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            Create
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}
