export type Note = {
  id: string;
  text: string;
  priority: number;
  completed: boolean;
  completedAt?: Date;
  imageUri?: string;
}; 