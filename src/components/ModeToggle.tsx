"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import { Computer, Moon, Sun } from "lucide-react";

const ModeToggle = () => {
  const { setTheme } = useTheme();
  return (
    <Tabs defaultValue="system" className="w-80 h-fit">
      <TabsList>
        <TabsTrigger value="light" onClick={() => setTheme("light")}>
          <Sun height={16} width={16}/>
        </TabsTrigger>
        <TabsTrigger value="system" onClick={() => setTheme("dark")}>
          <Computer height={16} width={16}/>
        </TabsTrigger>
        <TabsTrigger value="dark" onClick={() => setTheme("dark")}>
          <Moon height={16} width={16}/>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ModeToggle;
