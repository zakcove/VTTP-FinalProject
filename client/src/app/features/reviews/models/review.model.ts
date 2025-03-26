export interface Review {
    id: number;
    snackId: number;
    userId: number;
    rating: number;
    comment: string;
    imageUrl?: string;
    latitude?: number;
    longitude?: number;
    accuracy?: number;
    locationName?: string;
    isPublic: boolean;
    isModerated: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ReviewResponse {
    content: Review[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

export interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
} 