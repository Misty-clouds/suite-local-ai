"use client";

import { useState, useRef, useEffect, useMemo, type CSSProperties } from "react";
import {
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Edit,
  Eye,
  Trash2,
  GripVertical,
} from "lucide-react";
import { FaRobot } from "react-icons/fa";
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
  type DraggableAttributes,
  type DraggableSyntheticListeners,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Column, Task, PROJECTS_DATA } from "../data/projects";
import DeleteModal from "./DeleteModal";
import { useRouter } from "next/navigation";
import Image from "next/image";

function ProjectRow({
  task,
  uniqueId,
  isSelected,
  toggleRow,
  getStatusColor,
  getPriorityBadge,
  dragHandleProps,
  isDragOverlay,
}: {
  task: Task;
  uniqueId: string;
  isSelected: boolean;
  toggleRow: (id: string) => void;
  getStatusColor: (status: string) => string;
  getPriorityBadge: (priority: string) => string;
  dragHandleProps?: {
    attributes: DraggableAttributes;
    listeners: DraggableSyntheticListeners;
  };
  isDragOverlay?: boolean;
}) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle outside clicks for dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      onClick={() => {
        if (isDragOverlay) return;
        router.push(`/projects/cloud-migration-suite`);
      }}
      className={`group grid grid-cols-[40px_1fr_60px_80px_100px_100px_80px_80px_50px_100px_50px] gap-4 border-b border-[#1A1A1A] py-3 text-sm items-center hover:bg-[#111] px-4 transition-colors cursor-pointer ${isSelected ? "bg-[#111]" : ""}`}
    >
      <div className="flex items-center justify-center">
        <button
          type="button"
          className="mr-2 text-zinc-600 hover:text-zinc-300 cursor-grab active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
          aria-label="Drag project row"
          {...(dragHandleProps ? dragHandleProps.attributes : {})}
          {...(dragHandleProps ? dragHandleProps.listeners : {})}
        >
          <GripVertical size={14} />
        </button>
        <input
          type="checkbox"
          className="
    appearance-none h-4 w-4 rounded border border-zinc-700 bg-zinc-800 
    checked:bg-blue-500 checked:border-blue-500 
    checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTYgMTYiIGZpbGw9IndoaXRlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMi4yMDcgNC43OTNsLTEuNDE0LTEuNDE0TDYgOC41ODYgMy4yMDcgNS43OTNMMS43OTMgNy4yMDdsNC4yMDcgNC4yMDd6Ii8+PC9zdmc+')]
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-zinc-900
  "
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            toggleRow(uniqueId);
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Project Title & Desc */}
      <div className="min-w-0 pr-4">
        <h3 className="truncate font-medium text-white text-sm">
          {task.title}
        </h3>
        <p className="truncate text-xs text-zinc-500 mt-0.5">
          {task.description}
        </p>
      </div>

      {/* Team */}
      <div className="flex -space-x-2">
        {task.assignees
          ?.map((src: string, i: number) => (
            <div
              key={i}
              className="h-6 w-6 rounded-full border border-[#0A0A0A] overflow-hidden relative bg-zinc-800"
            >
              <Image
                src={src}
                alt="User"
                className="h-full w-full object-cover"
                width={24}
                height={24}
              />
            </div>
          ))
          .slice(0, 3)}
        {(task.assignees?.length || 0) > 3 && (
          <div className="h-6 w-6 rounded-full border border-[#0A0A0A] bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400">
            +{task.assignees!.length - 3}
          </div>
        )}
      </div>

      {/* Tasks Count */}
      <div className="text-zinc-400 text-xs">32/40</div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className={`h-full rounded-full bg-[#A1E3D8]`}
            style={{ width: `${task.progress}%` }}
          ></div>
        </div>
        <span className="text-xs text-[#DEDEDE] w-8">{task.progress}%</span>
      </div>

      {/* Status */}
      <div
        className={`text-xs font-medium ${getStatusColor(task.status || "To do")}`}
      >
        {task.status || "To do"}
      </div>

      {/* Priority */}
      <div>
        <span
          className={`inline-block rounded px-2 py-1 text-[10px] font-medium ${getPriorityBadge(task.priority)}`}
        >
          {task.priority}
        </span>
      </div>

      {/* Budget */}
      <div className="text-[#666666] text-sm">$4,900</div>

      {/* Deadline */}
      <div className="text-[#DEDEDE] text-sm">Jan 4, 2025</div>

      {/* AI Insights */}
      <div className="flex items-center gap-1.5 text-zinc-400 text-sm truncate">
        <FaRobot size={14} className="text-[#DEDEDE]shrink-0" />
        <span className="truncate">Possible delay</span>
      </div>

      {/* Action */}
      <div className="flex justify-end relative">
        <button
          ref={buttonRef}
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="flex h-7 w-7 items-center justify-center rounded hover:bg-zinc-800 text-zinc-500"
        >
          <MoreHorizontal size={16} />
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 top-full mt-1 w-48 rounded-xl bg-[#1C1C1C] border border-white/10 p-1 shadow-2xl z-50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
              <Edit size={16} /> Edit
            </button>
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
              <Eye size={16} /> View details
            </button>
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
              <MoreHorizontal size={16} /> More
            </button>
            <div className="my-1 h-px bg-white/10" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteModalOpen(true);
                setIsMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
              <Trash2 size={16} /> Delete project
            </button>
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          // Handle delete logic here
        }}
        title="Are you sure you want to delete this project?"
      />
    </div>
  );
}

function SortableProjectRow({
  task,
  isSelected,
  toggleRow,
  getStatusColor,
  getPriorityBadge,
}: {
  task: Task;
  isSelected: boolean;
  toggleRow: (id: string) => void;
  getStatusColor: (status: string) => string;
  getPriorityBadge: (priority: string) => string;
}) {
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
      type: "Project",
      task,
    },
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} className="opacity-0 pointer-events-none">
        <ProjectRow
          task={task}
          uniqueId={task.id}
          isSelected={isSelected}
          toggleRow={toggleRow}
          getStatusColor={getStatusColor}
          getPriorityBadge={getPriorityBadge}
        />
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style}>
      <ProjectRow
        task={task}
        uniqueId={task.id}
        isSelected={isSelected}
        toggleRow={toggleRow}
        getStatusColor={getStatusColor}
        getPriorityBadge={getPriorityBadge}
        dragHandleProps={{ attributes, listeners }}
      />
    </div>
  );
}

function ProjectGroup({
  column,
  selectedRows,
  toggleRow,
  getStatusColor,
  getPriorityBadge,
}: {
  column: Column;
  selectedRows: string[];
  toggleRow: (id: string) => void;
  getStatusColor: (status: string) => string;
  getPriorityBadge: (priority: string) => string;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const taskIds = useMemo(() => column.tasks.map((t) => t.id), [column.tasks]);

  if (column.tasks.length === 0) return null;

  return (
    <div className="flex flex-col w-full mb-4">
      {/* Group Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 bg-[#161616]/80 border-y border-[#272727] cursor-pointer hover:bg-[#1A1A1A] transition-colors sticky top-0 z-10 backdrop-blur-sm"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <ChevronDown size={16} className="text-zinc-400" />
        ) : (
          <ChevronRight size={16} className="text-zinc-400" />
        )}
        <h3 className="text-sm font-medium text-white">{column.title}</h3>
        <span className="text-[10px] font-medium text-zinc-400 bg-[#272727] px-2 py-0.5 rounded-full border border-white/5">
          {column.tasks.length}
        </span>
      </div>

      {/* Group Rows */}
      {isExpanded && (
        <div ref={setNodeRef} className="flex flex-col w-full border-b border-[#1A1A1A]">
          <SortableContext
            id={column.id}
            items={taskIds}
            strategy={verticalListSortingStrategy}
          >
            {column.tasks.map((task) => (
              <SortableProjectRow
                key={task.id}
                task={task}
                isSelected={selectedRows.includes(task.id)}
                toggleRow={toggleRow}
                getStatusColor={getStatusColor}
                getPriorityBadge={getPriorityBadge}
              />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
}

export default function ProjectList() {
  const [columns, setColumns] = useState<Column[]>(PROJECTS_DATA);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // We only track task IDs for rows that actually render
  const allRowIds = useMemo(
    () => columns.flatMap((col) => col.tasks.map((t) => t.id)),
    [columns],
  );

  const toggleRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const toggleAll = () => {
    if (selectedRows.length === allRowIds.length && allRowIds.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(allRowIds);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "to-do":
        return "text-[#B0F5FF]";
      case "in progress":
        return "text-[#FCFF96]";
      case "on hold":
        return "text-[#A7A7A7]";
      case "cancelled":
        return "text-[#FF7676]";
      case "under review":
        return "text-[#FF9D00]";
      case "overdue":
        return "text-[#FFB0B0]";
      default:
        return "text-[#B0F5FF]";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Low":
        return "bg-[#354A3A] text-[#A6DDB0]";
      case "Medium":
        return "bg-[#595941] text-[#FCFF96]";
      case "High":
        return "bg-[#523A3A] text-[#FF7676]";
      default:
        return "bg-zinc-800 text-zinc-400";
    }
  };

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
    if (event.active.data.current?.type === "Project") {
      setActiveTask(event.active.data.current.task);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    if (!active.data.current || active.data.current.type !== "Project") return;

    setColumns((prev) => {
      const activeColumnId = prev.find((col) =>
        col.tasks.some((t) => t.id === activeId),
      )?.id;

      let overColumnId = prev.find((col) => col.id === overId)?.id;
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

      const movingTask = activeColumn.tasks.find((t) => t.id === activeId);
      if (!movingTask) return prev;

      let overTaskIndex: number;
      if (prev.some((c) => c.id === overId)) {
        overTaskIndex = overColumn.tasks.length;
      } else {
        const overIndex = overColumn.tasks.findIndex((t) => t.id === overId);

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
          newTasks.splice(overTaskIndex, 0, movingTask);
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

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumnId = findColumn(activeId);
    const overColumnId = findColumn(overId);

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
      setColumns((cols) => {
        const newColumns = [...cols];
        const col = newColumns[columnIndex];
        col.tasks = arrayMove(col.tasks, activeIndex, overIndex);
        return newColumns;
      });
    }
  }

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  return (
    <DndContext
      id="project-list-dnd"
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
      <div className="flex flex-col h-full w-full bg-[#0A0A0A] text-white p-4 sm:p-6 overflow-hidden">
        <div className="flex-1 overflow-x-hidden overflow-y-hidden min-h-0 flex flex-col scrollbar-hide">
          <div className="w-full flex flex-col flex-1 min-h-0 text-xs sm:text-sm">
            {/* Table Header */}
            <div className="grid grid-cols-[40px_1fr_60px_80px_100px_100px_80px_80px_50px_100px_50px] gap-4 border-b border-[#272727] pb-4 text-xs font-medium text-zinc-500 items-center px-4 shrink-0">
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  className="
    appearance-none h-4 w-4 rounded border border-zinc-700 bg-zinc-800 
    checked:bg-blue-500 checked:border-blue-500 
    checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTYgMTYiIGZpbGw9IndoaXRlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMi4yMDcgNC43OTNsLTEuNDE0LTEuNDE0TDYgOC41ODYgMy4yMDcgNS43OTNMMS43OTMgNy4yMDdsNC4yMDcgNC4yMDd6Ii8+PC9zdmc+')]
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-zinc-900
  "
                  checked={selectedRows.length === allRowIds.length && allRowIds.length > 0}
                  onChange={toggleAll}
                />
              </div>
              <div>Project</div>
              <div>Team</div>
              <div>Tasks</div>
              <div>Progress</div>
              <div>Status</div>
              <div>Priority</div>
              <div>Budget</div>
              <div>Deadline</div>
              <div>Insights (AI)</div>
              <div className="text-right">Action</div>
            </div>
            {/* Table Body */}
            <div className="flex-1 overflow-y-auto pb-20 mt-2 scrollbar-hide relative min-h-0">
              {columns.map((column) => (
                <ProjectGroup
                  key={column.id}
                  column={column}
                  selectedRows={selectedRows}
                  toggleRow={toggleRow}
                  getStatusColor={getStatusColor}
                  getPriorityBadge={getPriorityBadge}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Pagination Footer */}
        <div className="mt-4 sm:mt-auto flex flex-col sm:flex-row gap-4 sm:gap-0 items-center justify-between border-t border-[#272727] pt-4 px-2 sm:px-4 bg-[#0A0A0A] shrink-0">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span>Page</span>
            <div className="flex items-center gap-1 rounded border border-[#272727] bg-[#161616] px-2 py-1">
              <span>1</span>
              <ChevronDown size={14} />
            </div>
            <span>of 1</span>
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-1 rounded-lg border border-[#272727] bg-[#161616] px-3 py-1.5 text-sm text-zinc-400 hover:text-white transition-colors">
              Prev
            </button>
            <button className="flex items-center gap-1 rounded-lg border border-[#272727] bg-[#161616] px-3 py-1.5 text-sm text-zinc-400 hover:text-white transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeTask ? (
          <div className="rounded-lg border border-white/10 bg-[#161616] shadow-2xl shadow-black/50 opacity-95">
            <ProjectRow
              task={activeTask}
              uniqueId={activeTask.id}
              isSelected={selectedRows.includes(activeTask.id)}
              toggleRow={toggleRow}
              getStatusColor={getStatusColor}
              getPriorityBadge={getPriorityBadge}
              isDragOverlay
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
