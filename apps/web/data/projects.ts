import { TaskCardProps } from "../components/TaskCard";

export interface Task extends TaskCardProps {
  id: string;
  status?: string; // We'll add this to track column
  budget?: string;
  deadline?: string;
  aiInsights?: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export const PROJECTS_DATA: Column[] = [
  {
    id: "todo",
    title: "To-Do",
    tasks: [
      {
        id: "t1",
        priority: "Medium",
        date: "Jan 4, 2025",
        title: "Atlas.inc website redesign and full branding",
        description:
          "A dual bar chart showing revenue (green) vs expense (red) over time (weekly or monthly)...",
        progress: 30,
        assignees: [
          "https://i.pravatar.cc/150?u=a042581f4e29026024d",
          "https://i.pravatar.cc/150?u=a042581f4e29026704d",
          "https://i.pravatar.cc/150?u=a04258114e29026302d",
        ],
        comments: 12,
        progressColor: "bg-linear-to-r from-cyan-400 to-blue-500",
        // Extended properties
        status: "To do",
        budget: "$4,900",
        deadline: "Jan 4, 2025",
        aiInsights: "High chance of delay",
      },
      {
        id: "t2",
        priority: "High",
        date: "Jan 4, 2025",
        title: "Atlas.inc website redesign and full branding",
        description:
          "A dual bar chart showing revenue (green) vs expense (red) over time (weekly or monthly)...",
        progress: 60,
        assignees: [
          "https://i.pravatar.cc/150?u=a042581f4e29026024d",
          "https://i.pravatar.cc/150?u=a042581f4e29026704d",
          "https://i.pravatar.cc/150?u=a04258114e29026302d",
        ],
        comments: 12,
        progressColor: "bg-linear-to-r from-orange-400 to-red-500",
        status: "In progress",
        budget: "$4,900",
        deadline: "Jan 4, 2025",
        aiInsights: "High chance of delay",
      },
      {
        id: "t21",
        priority: "Low",
        date: "Jan 4, 2025",
        title: "Atlas.inc website redesign and full branding",
        description:
          "A dual bar chart showing revenue (green) vs expense (red) over time...",
        progress: 67,
        assignees: [
          "https://i.pravatar.cc/150?u=a042581f4e29026024d",
          "https://i.pravatar.cc/150?u=a042581f4e29026704d",
          "https://i.pravatar.cc/150?u=a04258114e29026302d",
        ],
        comments: 12,
        progressColor: "bg-linear-to-r from-cyan-400 to-blue-500",
        status: "To do",
        budget: "$4,900",
        deadline: "Jan 4, 2025",
        aiInsights: "High chance of delay",
      },
    ],
  },
  {
    id: "in_progress",
    title: "In Progress",
    tasks: [
      {
        id: "t3",
        priority: "Low",
        date: "Jan 4, 2025",
        title: "Atlas.inc website redesign and full branding",
        description:
          "A dual bar chart showing revenue (green) vs expense (red) over time (weekly or monthly)...",
        progress: 45,
        image: "/assets/images/dummy/img1.jpg",
        assignees: ["https://i.pravatar.cc/150?u=a04258114e29026302d"],
        comments: 12,
        progressColor: "bg-linear-to-r from-pink-400 to-rose-500",
        status: "In progress",
        budget: "$4,900",
        deadline: "Jan 4, 2025",
        aiInsights: "High chance of delay",
      },
      {
        id: "t4",
        priority: "Medium",
        date: "Jan 4, 2025",
        title: "Atlas.inc website redesign and full branding",
        description:
          "A dual bar chart showing revenue (green) vs expense (red) over time (weekly or monthly)...",
        progress: 20,
        assignees: ["https://i.pravatar.cc/150?u=a042581f4e29026024d"],
        comments: 12,
        progressColor: "bg-linear-to-r from-yellow-400 to-orange-500",
        status: "In progress",
        budget: "$4,900",
        deadline: "Jan 4, 2025",
        aiInsights: "High chance of delay",
      },
    ],
  },
  {
    id: "under_review",
    title: "Under review",
    tasks: [
      {
        id: "t5",
        priority: "High",
        date: "Jan 4, 2025",
        title: "Atlas.inc website redesign and full branding",
        description:
          "A dual bar chart showing revenue (green) vs expense (red) over time (weekly or monthly)...",
        progress: 80,
        assignees: [
          "https://i.pravatar.cc/150?u=a042581f4e29026024d",
          "https://i.pravatar.cc/150?u=a042581f4e29026704d",
          "https://i.pravatar.cc/150?u=a04258114e29026302d",
        ],
        comments: 12,
        progressColor: "bg-linear-to-r from-yellow-400 to-orange-500",
        status: "Under review",
        budget: "$4,900",
        deadline: "Jan 4, 2025",
        aiInsights: "High chance of delay",
      },
    ],
  },
  {
    id: "completed",
    title: "Completed",
    tasks: [], // keeping empty for brevity as per mock in list
  },
  {
    id: "overdue",
    title: "Overdue",
    tasks: [
      {
        id: "t9",
        priority: "Medium",
        date: "Jan 4, 2025",
        title: "Atlas.inc website redesign and full branding",
        description: "A dual bar chart showing...",
        progress: 60,
        assignees: ["https://i.pravatar.cc/150?u=a042581f4e29026024d"],
        comments: 12,
        progressColor: "bg-linear-to-r from-yellow-400 to-orange-500",
        status: "Overdue",
        budget: "$4,900",
        deadline: "Jan 4, 2025",
        aiInsights: "High chance of delay",
      },
    ],
  },
  {
    id: "cancelled",
    title: "Cancelled",
    tasks: [
      {
        id: "t13",
        priority: "Low",
        date: "Jan 4, 2025",
        title: "Atlas.inc website redesign and full branding",
        description: "A dual bar chart showing...",
        progress: 0,
        assignees: ["https://i.pravatar.cc/150?u=a04258114e29026302d"],
        comments: 12,
        progressColor: "bg-linear-to-r from-cyan-400 to-blue-500",
        status: "Cancelled",
        budget: "$4,900",
        deadline: "Jan 4, 2025",
        aiInsights: "High chance of delay",
      },
    ],
  },
];
