"use client";

import { useState, useEffect, useMemo, memo } from "react";
import { Plus, MoreVertical, ArrowUpRight, ArrowDownLeft, Briefcase } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  DropAnimation,
  useDroppable,
  MeasuringStrategy,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard, { TaskCardProps } from "./TaskCard";
import { useSidebar } from "./SidebarContext";

// Define Data Structures
interface Task extends TaskCardProps {
  id: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const INITIAL_DATA: Column[] = [
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
      },
      {
        id: "t6",
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
        progressColor: "bg-linear-to-r from-cyan-400 to-blue-500",
      },
    ],
  },
  {
    id: "completed",
    title: "Completed",
    tasks: [
      {
        id: "t7",
        priority: "Medium",
        date: "Jan 4, 2025",
        title: "Atlas.inc website redesign and full branding",
        description:
          "A dual bar chart showing revenue (green) vs expense (red) over time (weekly or monthly)...",
        progress: 100,
        assignees: [
          "https://i.pravatar.cc/150?u=a042581f4e29026024d",
          "https://i.pravatar.cc/150?u=a042581f4e29026704d",
          "https://i.pravatar.cc/150?u=a04258114e29026302d",
        ],
        comments: 12,
        progressColor: "bg-linear-to-r from-pink-400 to-rose-500",
      },
      {
        id: "t8",
        priority: "Medium",
        date: "Jan 4, 2025",
        title: "Atlas.inc website redesign and full branding",
        description:
          "A dual bar chart showing revenue (green) vs expense (red) over time (weekly or monthly)...",
        progress: 100,
        assignees: [
          "https://i.pravatar.cc/150?u=a042581f4e29026024d",
          "https://i.pravatar.cc/150?u=a042581f4e29026704d",
          "https://i.pravatar.cc/150?u=a04258114e29026302d",
        ],
        comments: 12,
        progressColor: "bg-linear-to-r from-pink-400 to-rose-500",
      },
    ],
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
        description:
          "A dual bar chart showing revenue (green) vs expense (red) over time (weekly or monthly)...",
        progress: 60,
        assignees: [
          "https://i.pravatar.cc/150?u=a042581f4e29026024d",
          "https://i.pravatar.cc/150?u=a042581f4e29026704d",
          "https://i.pravatar.cc/150?u=a04258114e29026302d",
        ],
        comments: 12,
        progressColor: "bg-linear-to-r from-yellow-400 to-orange-500",
      },
      {
        id: "t10",
        priority: "Medium",
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
        progressColor: "bg-linear-to-r from-yellow-400 to-orange-500",
      },
    ],
  },
  {
    id: "on_hold",
    title: "On hold",
    tasks: [
      {
        id: "t11",
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
        progressColor: "bg-linear-to-r from-orange-400 to-red-500",
      },
      {
        id: "t12",
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
        progressColor: "bg-linear-to-r from-orange-400 to-red-500",
      },
    ],
  },
  {
    id: "cancelled",
    title: "Cancelled",
    tasks: [
      {
        id: "t13",
        priority: "Medium",
        date: "Jan 4, 2025",
        title: "Atlas.inc website redesign and full branding",
        description:
          "A dual bar chart showing revenue (green) vs expense (red) over time (weekly or monthly)...",
        progress: 0,
        assignees: [
          "https://i.pravatar.cc/150?u=a042581f4e29026024d",
          "https://i.pravatar.cc/150?u=a042581f4e29026704d",
          "https://i.pravatar.cc/150?u=a04258114e29026302d",
        ],
        comments: 12,
        progressColor: "bg-linear-to-r from-cyan-400 to-blue-500",
      },
      {
        id: "t14",
        priority: "Medium",
        date: "Jan 4, 2025",
        title: "Atlas.inc website redesign and full branding",
        description:
          "A dual bar chart showing revenue (green) vs expense (red) over time (weekly or monthly)...",
        progress: 0,
        assignees: [
          "https://i.pravatar.cc/150?u=a042581f4e29026024d",
          "https://i.pravatar.cc/150?u=a042581f4e29026704d",
          "https://i.pravatar.cc/150?u=a04258114e29026302d",
        ],
        comments: 12,
        progressColor: "bg-linear-to-r from-cyan-400 to-blue-500",
      },
    ],
  },
];

function SortableTaskItem({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-0 w-[98%] mx-auto pointer-events-none"
      >
        <TaskCard {...task} />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-[98%] mx-auto cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <TaskCard {...task} />
    </div>
  );
}

const ColumnContainer = memo(function ColumnContainer({
  column,
}: {
  column: Column;
}) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const taskIds = useMemo(() => column.tasks.map((t) => t.id), [column.tasks]);

  return (
    <div ref={setNodeRef} className="w-50 flex flex-col h-full shrink-0">
      {/* Column Header */}
      <div className="flex items-center justify-between p-3 bg-app-card">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-app-text-muted">{column.title}</h2>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1 text-app-text-light hover:text-white transition-colors">
            <Plus size={12} />
          </button>
          <button className="p-1 text-app-text-light hover:text-white transition-colors">
            <MoreVertical size={12} />
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <SortableContext
        id={column.id}
        items={taskIds}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col items-center gap-2 overflow-y-auto flex-1 scrollbar-hide pb-10 pt-4 bg-app-surface rounded-b-lg border border-app-border-muted border-t-0">
          {column.tasks.map((task) => (
            <SortableTaskItem key={task.id} task={task} />
          ))}

          {/* Empty State Card */}
          {column.tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center mt-4 border border-app-border rounded-xl w-[98%] mx-auto bg-transparent border-dashed">
              <div className="mb-3 text-zinc-600">
                <Briefcase size={24} />
              </div>
              <p className="mb-4 text-[13px] text-zinc-500">No projects yet</p>
              <button className="flex items-center gap-1.5 text-[13px] text-blue-500 hover:text-blue-400">
                <Plus size={16} /> Add project
              </button>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
});

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

export default function ProjectPipeline({
  hideHeader = false,
  isEmpty = false,
}: {
  hideHeader?: boolean;
  isEmpty?: boolean;
}) {
  const [columns, setColumns] = useState<Column[]>(
    isEmpty ? INITIAL_DATA.map(col => ({ ...col, tasks: [] })) : INITIAL_DATA
  );
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [renderFullscreen, setRenderFullscreen] = useState(false);
  const { collapsed } = useSidebar();

  useEffect(() => {
    setColumns(isEmpty ? INITIAL_DATA.map(col => ({ ...col, tasks: [] })) : INITIAL_DATA);
  }, [isEmpty]);

  useEffect(() => {
    if (!isFullscreen) {
      const timeout = setTimeout(() => setRenderFullscreen(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isFullscreen]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function findColumn(id: string | undefined): string | undefined {
    if (!id) return undefined;
    if (columns.some((c) => c.id === id)) return id;
    return columns.find((col) => col.tasks.some((task) => task.id === id))?.id;
  }

  function handleDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!active.data.current || active.data.current.type !== "Task") return;

    // Use a functional update to ensure we're working with the latest state
    setColumns((prev) => {
      const activeColumnId = prev.find((col) =>
        col.tasks.some((t) => t.id === activeId),
      )?.id;
      // Check if overId is a column
      let overColumnId = prev.find((col) => col.id === overId)?.id;
      // If not, check if it's a task
      if (!overColumnId) {
        overColumnId = prev.find((col) =>
          col.tasks.some((t) => t.id === overId),
        )?.id;
      }

      if (!activeColumnId || !overColumnId || activeColumnId === overColumnId) {
        return prev;
      }

      const activeColumn = prev.find((col) => col.id === activeColumnId)!;
      const overColumn = prev.find((col) => col.id === overColumnId)!;

      const activeTask = activeColumn.tasks.find((t) => t.id === activeId);
      if (!activeTask) return prev;

      let overTaskIndex: number;
      if (prev.some((c) => c.id === overId)) {
        // Dropped on a column, push to end
        overTaskIndex = overColumn.tasks.length;
      } else {
        const overIndex = overColumn.tasks.findIndex(
          (task) => task.id === overId,
        );

        // Simple calculation: if overIndex valid, insert there.
        // We can use the geometry to decide before/after, but simpler is just index
        // The dnd-kit example uses rect intersection for finer control
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;
        overTaskIndex =
          overIndex >= 0 ? overIndex + modifier : overColumn.tasks.length;
      }

      return prev.map((col) => {
        if (col.id === activeColumnId) {
          return {
            ...col,
            tasks: col.tasks.filter((t) => t.id !== activeId),
          };
        }
        if (col.id === overColumnId) {
          const newTasks = [...col.tasks];
          newTasks.splice(overTaskIndex, 0, activeTask);
          return {
            ...col,
            tasks: newTasks,
          };
        }
        return col;
      });
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find columns in current state
    const activeColumnId = findColumn(activeId as string);
    const overColumnId = findColumn(overId as string);

    if (!activeColumnId || !overColumnId || activeColumnId !== overColumnId) {
      return;
    }

    const columnIndex = columns.findIndex((col) => col.id === activeColumnId);
    const activeIndex = columns[columnIndex].tasks.findIndex(
      (task) => task.id === activeId,
    );
    const overIndex = columns[columnIndex].tasks.findIndex(
      (task) => task.id === overId,
    );

    if (activeIndex !== overIndex) {
      setColumns((columns) => {
        const newColumns = [...columns];
        const column = newColumns[columnIndex];
        column.tasks = arrayMove(column.tasks, activeIndex, overIndex);
        return newColumns;
      });
    }
  }

  return (
    <DndContext
      id="project-pipeline-dnd"
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
    >
      <div
        className={`flex flex-col text-white overflow-hidden font-sans transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          renderFullscreen
            ? `fixed inset-y-0 right-0 z-50 p-8! left-0 bg-app-bg! ${
                collapsed ? "md:left-17" : "md:left-64"
              } shadow-2xl ring-1 ring-app-border ${
                isFullscreen ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`
            : "relative h-full w-full p-8 bg-app-bg opacity-100 scale-100"
        }`}
      >
        {/* Header */}
        {!hideHeader && (
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-normal text-app-text-light">
              Project Pipeline
            </h1>
            <button
              onClick={() => {
                const next = !isFullscreen;
                if (next) setRenderFullscreen(true);
                setIsFullscreen(next);
              }}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <div
                className={`transition-transform duration-300 ${
                  isFullscreen ? "-rotate-360" : "rotate-0"
                }`}
              >
                {isFullscreen ? (
                  <ArrowDownLeft size={18} />
                ) : (
                  <ArrowUpRight size={18} />
                )}
              </div>
            </button>
          </div>
        )}

        {/* Kanban Board - Scrollable Area */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide">
          <div className="flex gap-2 h-full pb-4 min-w-max">
            {columns.map((column) => (
              <ColumnContainer key={column.id} column={column} />
            ))}
          </div>
        </div>

        <DragOverlay dropAnimation={dropAnimation}>
          {activeTask ? (
            <div className="w-49 rotate-2 scale-105 shadow-2xl shadow-black/50 opacity-95 cursor-grabbing">
              <TaskCard {...activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
