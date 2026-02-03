"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "لوحة القيادة",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "نظرة عامة",
          url: "#",
        },
        {
          title: "المفضلة",
          url: "#",
        },
        {
          title: "الإعدادات",
          url: "#",
        },
      ],
    },
    {
      title: "نوذج الذكاء الاصطناعي",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "النماذج",
          url: "#",
        },
        {
          title: "مستكشف",
          url: "#",
        },
        {
          title: "الإعدادات",
          url: "#",
        },
      ],
    },
    {
      title: "التوثيق",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "مقدمة",
          url: "#",
        },
        {
          title: "البدء",
          url: "#",
        },
        {
          title: "الدروس",
          url: "#",
        },
        {
          title: "تغيير السجل",
          url: "#",
        },
      ],
    },
    {
      title: "الإعدادات",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "عام",
          url: "#",
        },
        {
          title: "الفريق",
          url: "#",
        },
        {
          title: "الفواتير",
          url: "#",
        },
        {
          title: "الحدود",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "الهندسة التصميمية",
      url: "#",
      icon: Frame,
    },
    {
      name: "المبيعات والتسويق",
      url: "#",
      icon: PieChart,
    },
    {
      name: "السفر",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar side="right" collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
