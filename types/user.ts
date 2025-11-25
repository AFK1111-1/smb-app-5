export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar: string | null;
  status: string;
  updatedAt: string;
  createdAt: string;
  address?: string;
  city?: string;
  zipCode?: string;
  phoneNumber?: string;
}

export type KindeUserProfile = {
  id: string;
  givenName: string;
  familyName: string;
  email: string;
  picture: string;
};

export interface UserUpdateRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  zipCode: string;
}

export interface UserUpdateRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  zipCode: string;
}
