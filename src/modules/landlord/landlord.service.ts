import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { ICreateProperty } from "../property/property.interface";
import { IUpdateProperty } from "./landlord.interface";
import HttpsStatus from "http-status-codes";
import { PropertyStatus } from "../../../generated/prisma/enums";
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

// list only the properties owned by the current landlord.
const getMyPropertiesDB = async (landlordId: string) => {
  const result = await prisma.property.findMany({
    where: {
      landlordId,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

// NEW: get a single property, scoped to the current landlord.
const getPropertyDB = async (propertyId: string, landlordId: string) => {
  const result = await prisma.property.findFirst({
    where: {
      id: propertyId,
      landlordId,
    },
    include: {
      category: true,
    },
  });

  if (!result) {
    throw new AppError(HttpsStatus.NOT_FOUND, "Property not found or unauthorized");
  }

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


const updateRentalRequestDB = async (
  landlordId: string,
  rentalRequestId: string,
  payload: { status: "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED" }
) => {
  const allowedStatuses = [
    "APPROVED",
    "REJECTED",
    "ACTIVE",
    "COMPLETED",
  ];

  if (!payload.status || !allowedStatuses.includes(payload.status)) {
    throw new AppError(
      HttpsStatus.BAD_REQUEST,
      "Invalid rental request status."
    );
  }

  // Verify request belongs to this landlord
  const request = await prisma.rentalRequest.findFirst({
    where: {
      id: rentalRequestId,
      property: {
        landlordId,
      },
    },
    include: {
      property: true,
    },
  });

  if (!request) {
    throw new AppError(
      HttpsStatus.NOT_FOUND,
      "Rental request not found or unauthorized"
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    // Update rental request
    const updatedRequest = await tx.rentalRequest.update({
      where: {
        id: rentalRequestId,
      },
      data: {
        status: payload.status ,
      },
    });

    // If completed, make property unavailable
    if (payload.status === "COMPLETED") {
      await tx.property.update({
        where: {
          id: request.propertyId,
        },
        data: {
          available: false,
          status: PropertyStatus.UNAVAILABLE,
        },
      });
    }

    // If request becomes ACTIVE again, make property available
    if (payload.status === "ACTIVE") {
      await tx.property.update({
        where: {
          id: request.propertyId,
        },
        data: {
          available: true,
          status: PropertyStatus.AVAILABLE,
        },
      });
    }

    return updatedRequest;
  });

  return result;
};


export const landlordService = {
  createPropertyDB,
  getMyPropertiesDB,
  getPropertyDB,
  updatePropertyDB,
  deletePropertyDB,
  getAllRentalRequestsDB,
  updateRentalRequestDB,
};