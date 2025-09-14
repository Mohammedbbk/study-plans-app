"use client";

import { useForm, useFieldArray, FieldArrayPath, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2Icon, PlusCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Plan } from "@/app/api/_store";


const generateUUID = () => {
  if (
    typeof window !== "undefined" &&
    window.crypto &&
    window.crypto.randomUUID
  ) {
    return window.crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const planSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters.")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens.",
    ),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  durationWeeks: z.number().int().positive("Duration must be a positive number."),
  price: z.number().nullable().optional(),
  tags: z.array(z.string()).max(8, "You can add up to 8 tags."),
  isActive: z.boolean(),
  modules: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().min(1, "Module title is required."),
        lessons: z
          .array(z.string().min(1, "Lesson title is required."))
          .min(1, "Each module needs at least one lesson."),
      }),
    )
    .min(1, "You must add at least one module."),
});

type PlanFormValues = z.infer<typeof planSchema>;

async function createPlan({
  planData,
  token,
}: {
  planData: PlanFormValues;
  token: string;
}) {
  const res = await fetch("/api/admin/plans", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": token,
    },
    body: JSON.stringify(planData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to create plan");
  }
  return res.json();
}

async function updatePlan({
  planId,
  planData,
  token,
}: {
  planId: string;
  planData: Partial<PlanFormValues>;
  token: string;
}) {
  const res = await fetch(`/api/admin/plans/${planId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": token,
    },
    body: JSON.stringify(planData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update plan");
  }
  return res.json();
}

type PlanFormProps = {
  initialData?: Plan | null;
  onFinish?: () => void;
  adminToken: string;
};

export function PlanForm({ initialData, onFinish, adminToken }: PlanFormProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!initialData;

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      durationWeeks: 8,
      price: 299,
      tags: [],
      isActive: true,
      modules: [{ id: generateUUID(), title: "", lessons: [""] }],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        tags: initialData.tags || [],
      });
    } else {
      form.reset({
        title: "",
        slug: "",
        description: "",
        durationWeeks: 8,
        price: 299,
        tags: [],
        isActive: true,
        modules: [{ id: generateUUID(), title: "", lessons: [""] }],
      });
    }
  }, [initialData, form]);

  const {
    fields: moduleFields,
    append: appendModule,
    remove: removeModule,
  } = useFieldArray({
    control: form.control,
    name: "modules",
  });

  const createMutation = useMutation({
    mutationFn: createPlan,
    onSuccess: () => {
      toast.success("Plan created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
      form.reset({
        title: "",
        slug: "",
        description: "",
        durationWeeks: 8,
        price: 299,
        tags: [],
        isActive: true,
        modules: [{ id: generateUUID(), title: "", lessons: [""] }],
      });
    },
    onError: (error) => {
      toast.error("Creation Failed", { description: error.message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updatePlan,
    onSuccess: () => {
      toast.success("Plan updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
      onFinish?.();
    },
    onError: (error) => {
      toast.error("Update Failed", { description: error.message });
    },
  });

  function onSubmit(data: PlanFormValues) {
    if (!adminToken) {
      toast.error("Admin Token is required.");
      return;
    }
    
    // Convert string values to numbers for numeric fields
    const processedData = {
      ...data,
      durationWeeks: Number(data.durationWeeks),
      price: data.price !== null && data.price !== undefined ? Number(data.price) : null,
    };

    if (isEditMode) {
      updateMutation.mutate({
        planId: initialData.id,
        planData: processedData,
        token: adminToken,
      });
    } else {
      createMutation.mutate({ planData: processedData, token: adminToken });
    }
  }

  const mutation = isEditMode ? updateMutation : createMutation;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="React for Beginners" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="react-for-beginners" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the plan..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="durationWeeks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (Weeks)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="299" 
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input
                  placeholder="React, JavaScript, Beginner (comma separated)"
                  defaultValue={
                    Array.isArray(field.value) ? field.value.join(", ") : ""
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.split(",").map((tag) => tag.trim()),
                    )
                  }
                />
              </FormControl>
              <FormDescription>Separate tags with a comma.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <h3 className="text-lg font-medium mb-2">Modules</h3>
          {moduleFields.map((module, moduleIndex) => (
            <ModuleField
              key={module.id}
              moduleIndex={moduleIndex}
              control={form.control}
              removeModule={removeModule}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() =>
              appendModule({
                id: generateUUID(),
                title: "",
                lessons: [""],
              })
            }
          >
            <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Module
          </Button>
        </div>

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Activate Plan</FormLabel>
                <FormDescription>
                  Allow users to see and subscribe to this plan.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="pt-6 border-t">
          <div className="flex items-center gap-4">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending
              ? isEditMode
                ? "Saving..."
                : "Creating..."
              : isEditMode
                ? "Save Changes"
                : "Create Plan"}
          </Button>
          {isEditMode && (
            <Button type="button" variant="ghost" onClick={onFinish}>
              Cancel Edit
            </Button>
          )}
          </div>
        </div>
      </form>
    </Form>
  );
}

function ModuleField({
  moduleIndex,
  control,
  removeModule,
}: {
  moduleIndex: number;
  control: Control<PlanFormValues>;
  removeModule: (index: number) => void;
}) {
  const {
    fields: lessonFields,
    append: appendLesson,
    remove: removeLesson,
  } = useFieldArray({
    control,
    name: `modules.${moduleIndex}.lessons` as FieldArrayPath<PlanFormValues>,
  });


  return (
    <Card className="mb-4 bg-secondary/50">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        <CardTitle className="text-base">Module {moduleIndex + 1}</CardTitle>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => removeModule(moduleIndex)}
        >
          <Trash2Icon className="h-4 w-4 text-destructive" />
        </Button>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <FormField
          control={control}
          name={`modules.${moduleIndex}.title`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Module Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-4">
          <FormLabel>Lessons</FormLabel>
          <div className="space-y-2 mt-2">
            {lessonFields.map((lesson, lessonIndex) => (
              <div key={lesson.id} className="flex items-center gap-2">
                <FormField
                  control={control}
                  name={`modules.${moduleIndex}.lessons.${lessonIndex}`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLesson(lessonIndex)}
                >
                  <Trash2Icon className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => appendLesson("" as never)}
          >
            <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Lesson
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}