export interface Snack {
  id?: number;
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  averageRating?: number;
  totalReviews?: number;
}

export interface SnackResponse {
  content: Snack[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface CreateSnackDto {
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  imageUrl?: string;
}

export interface UpdateSnackDto extends Partial<CreateSnackDto> {
  id: number;
}

export type SnackCategory = 'CHIPS' | 'CANDY' | 'CHOCOLATE' | 'NUTS' | 'BEVERAGES' | 'OTHER'; 