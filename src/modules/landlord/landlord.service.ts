import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { ICreateProperty } from "../property/property.interface";
import { IUpdateProperty } from "./landlord.interface";
import HttpsStatus from "http-status-codes";
const createPropertyDB = async (
  payload: ICreateProperty,
  landlordId: string
) => {
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  if (!landlordId) {
    throw new AppError(HttpsStatus.BAD_REQUEST, "Landlord is required");
  }

  const result = await prisma.property.create({
    data: {
      title: payload.title,
      description: payload.description,

      address: payload.address,
      city: payload.city,
      state: payload.state,
      neighborhood: payload.neighborhood,
      location:
        payload.location ??
        `${payload.address}, ${payload.neighborhood}, ${payload.city}, ${payload.state}`,

      price: payload.price,
      bedrooms: payload.bedrooms,
      bathrooms: payload.bathrooms,
      sqft: payload.sqft,

      amenities: payload.amenities,
      images: payload.images,

      available: payload.available,
      availableFrom: payload.availableFrom
        ? new Date(payload.availableFrom)
        : null,

      rating: payload.rating,
      reviewCount: payload.reviewCount,
      featured: payload.featured,

      landlordId,
      categoryId: payload.categoryId,
    },
  });

  return result;
};


const updatePropertyDB = async (propertyId: string, propertyData: IUpdateProperty, landlordId: string) => {
    const property = await prisma.property.findUnique({
        where: {
            id: propertyId
        }
    });
    if (!property) {
        throw new AppError(HttpsStatus.NOT_FOUND, "Property not found or unauthorized");
    }
    if (property.landlordId !== landlordId) {
        throw new AppError(
            HttpsStatus.NOT_FOUND,
            "unauthorized to update this property"
        );
    }
    if (!property) {
        throw new AppError(HttpsStatus.NOT_FOUND, "Property not found or unauthorized");
    }
    const result = await prisma.property.update({
        where: {
            id: propertyId,
        },
        data: {
            title: propertyData.title,
            description: propertyData.description,
            location: propertyData.location,
            price: propertyData.price,
            bedrooms: propertyData.bedrooms,
            bathrooms: propertyData.bathrooms,
            amenities: propertyData.amenities,
            images: propertyData.images,
            status: propertyData.status,
            categoryId: propertyData.categoryId
        }
    });

    return result;
};

const deletePropertyDB = async (propertyId: string, landlordId: string) => {
    const property = await prisma.property.findFirst({
        where: {
            id: propertyId,
            landlordId: landlordId
        }
    });
    if (!property) {
        throw new AppError(HttpsStatus.NOT_FOUND, "Property not found or unauthorized");
    }
    const result = await prisma.property.delete({
        where: {
            id: propertyId,
        }
    });

    return result;
};

const getAllRentalRequestsDB = async (landlordId: string) => {
    const result = await prisma.rentalRequest.findMany({
        where: {
            property: {
                landlordId
            }
        },
        include: {
            property: true,
            tenant: {
                omit: { password: true }
            }
        }

    });

    return result;

};
const updateRentalRequestDB = async (landlordId: string, rentalRequestId: string, payload: any) => {
    if (payload.status && !["APPROVED", "REJECTED"].includes(payload.status)) {
        throw new AppError(HttpsStatus.BAD_REQUEST, "Invalid status value. Allowed values are 'APPROVED' or 'REJECTED'.");
    }
    const result = await prisma.rentalRequest.findUnique({
        where: {
            id: rentalRequestId,
            property: {
                landlordId
            }
        }
    });
    if (!result) {
        throw new AppError(HttpsStatus.NOT_FOUND, "Rental request not found or unauthorized");
    };


    const updatedRequest = await prisma.rentalRequest.update({
        where: {
            id: rentalRequestId
        },
        data: {
            ...payload
        }
    });

    return updatedRequest;
};


export const landlordService = { createPropertyDB, updatePropertyDB, deletePropertyDB, getAllRentalRequestsDB, updateRentalRequestDB }