export interface Paginated<T> {
  total: number;
  results: T[];
}

export interface Image {
  id: number;
  name: string;
  local_file_name: string;
  private: boolean;
  required_roles: string[];
}
