export interface CreateReviewRequest {
  snackId: number;
  rating: number;
  comment: string;
  locationName: string;
  price: number;
  isPublic: boolean;
} 