import { api } from "./api";

export interface ActivityItem {
  id: string;
  message: string;
  type?: string;
  createdAt?: string;
}

export const activitiesApi = {
  async list(): Promise<ActivityItem[]> {
    const res = await api.get<ActivityItem[]>("/activities");
    return res.data;
  },
};
