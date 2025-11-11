"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditUserProfileSchema } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { User } from "next-auth";

type Props = {
  user: Pick<User, "name" | "email">;
};

const ProfileForm = ({ user }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof EditUserProfileSchema>>({
    mode: "onChange",
    resolver: zodResolver(EditUserProfileSchema),
    defaultValues: {
      email: user.email || "",
      name: user.name || "",
    },
  });

  function onSubmit() {}

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User full name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            disabled={isLoading}
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="self-start hover:bg-zinc-900 hover:text-white border transition-all duration-300"
          >
            {isLoading ? (
              <div className="flex items-center gap-1">
                <span>Saving</span>
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <span>Save User Settings</span>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ProfileForm;
