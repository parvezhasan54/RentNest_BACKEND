export interface ICreateProperty {
  title: string;
  description: string;

  address: string;
  city: string;
  state: string;
  neighborhood: string;
  location?: string;

  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;

  images: string[];
  amenities: string[];

  available: boolean;
  availableFrom?: Date | string | null;

  rating?: number;
  reviewCount?: number;
  featured?: boolean;

  categoryId: string;
}