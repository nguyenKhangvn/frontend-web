interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  categoryName: string;
  manufacturerName: string;
  discountName: string;
  quantity: number;
  storeName: string;
  images: {
    id: string;
    productId: string;
    url: string;
    }[];
};


export interface ProductQueryParameters {
  pageIndex: number;
  pageSize: number;
  searchTerm?: string | null;
  categoryId?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  isActive?: boolean | null;
  sortBy?: string | null;
  sortOrder?: "asc" | "desc" | null;
}

export interface PaginationResponse<T> {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  items: T[];
}

export interface CreateAProduct {
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  categoryId: string;
  manufacturerId: string;
  discountId?: string;
  quantity: number;
  storeId: string;
  images?: {
    id: string;
    productId: string;
    url: string;
  }[];
}

export interface DetailAProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  categoryName: string;
  manufacturerName: string;
  discountName: string;
  images: {
    id: string;
    name: string;
    url: string;
  }[];
  quantity: number;
  storeName: string;
  createdAt: string;
  updatedAt: string;
  sold: number;
  rating: number;
  totalReviews: number;
}

export interface ProductDto {
    id: string;
    name: string;
    description?: string;
    price: number;
    discountPercent: number;
    thumbnailUrl?: string;
    images: {
      id: string;
      name: string;
      url: string;
    }[];
    categoryId?: string;
    categoryName?: string;
    manufacturerId?: string;
    manufacturerName?: string;
    isAvailable?: boolean;
    stock?: number;
    rating?: number;
    totalReviews?: number;
    createdAt?: string;
    updatedAt?: string;
    sold?: number;
}

export interface UpdateAProduct {
  quantity: number;
}

export default Product;
