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
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface EditRulesFormProps {
    ruleInfo: any;
    partitionName: string;
    onClose: () => void;
    level: number;
    parent: string;
}

const filterSchema = z.object({
    type: z.enum(['allow', 'deny', ""]),
    groups: z.string().optional(),
    users: z.string().optional(),
});

const ruleSchema = z.object({
    name: z.enum(['provided', 'user', 'tag', 'fixed']),
    value: z.string().optional(),
    create: z.boolean().optional(),
    filter: filterSchema.optional(),
});

const EditRulesForm = ({ ruleInfo, partitionName, onClose, level, parent }: EditRulesFormProps) => {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof ruleSchema>>({
        resolver: zodResolver(ruleSchema),
        defaultValues: {
            ...ruleInfo,
            filter: {
                type: ruleInfo?.filter?.type || '',
                groups: ruleInfo?.filter?.groups?.join(',') || '',
                users: ruleInfo?.filter?.users?.join(',') || '',
            }
        },
    });

    const onSubmit = async (data: z.infer<typeof ruleSchema>) => {
        try {
            console.log(data)
            const filteredData = Object.fromEntries(
                Object.entries(data).filter(([key, value]) => {
                    if ((data.name === 'provided' || data.name === 'user') && key === 'value') {
                        return false;
                    }
                    return value !== undefined;
                })
            );
            console.log("submit");
            console.log(filteredData);
            await axios.patch("/api/rule", { filteredData, parentPath: parent, partitionName, originalName: ruleInfo.name });
            window.location.reload()
            toast({ title: "Rule updated successfully!" });
            onClose();
        } catch (error) {
            toast({ title: "Error updating rule", description: "Please check rules config" });
        }
    };

    const nameField = form.watch("name");

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-3">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select name" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="provided">Provided</SelectItem>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="tag">Tag</SelectItem>
                                        <SelectItem value="fixed">Fixed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Value</FormLabel>
                                <Input
                                    {...field}
                                    placeholder="Enter value"
                                    className={nameField === 'provided' || nameField === 'user' ? 'hidden' : ''}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="create"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex gap-3 items-center">
                                    <FormLabel>Create</FormLabel>
                                    <FormControl>
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5"
                                            checked={field.value}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="filter.type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Filter</FormLabel>
                                <div className="flex flex-col gap-3">
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select filter" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="allow">Allow</SelectItem>
                                            <SelectItem value="deny">Deny</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="filter.groups"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Groups</FormLabel>
                                <div className="flex flex-col gap-3">
                                    <Input
                                        {...field}
                                        placeholder="Enter groups (comma separated)"
                                    />
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="filter.users"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Users</FormLabel>
                                <div className="flex flex-col gap-3">
                                    <Input
                                        {...field}
                                        placeholder="Enter users (comma separated)"
                                    />
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex flex-row-reverse gap-3 text-end mt-5">
                    <Button type="submit" disabled={form.formState.isSubmitting}>Submit</Button>
                    <Button type="button" onClick={onClose}>Cancel</Button>
                </div>
            </form>
        </Form>
    );
};

export default EditRulesForm;
