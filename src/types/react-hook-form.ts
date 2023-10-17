import { Control, UseFormRegister, UseFormReset } from "react-hook-form";

export type TAmenitiesInputs = {
  parking: boolean;
  wifi: boolean;
  gym: boolean;
  pool: boolean;
  watchman: boolean;
  cctv: boolean;
  securityLights: boolean;
  water: boolean;
  borehole: boolean;
};

export type TFactInputs = {
  bedrooms: string;
  bathrooms: string;
  kitchen: string;
  price: string;
  policies: string[];
  amenities: TAmenitiesInputs;
};

export type TRegister = UseFormRegister<TFactInputs>;

export type TReset = UseFormReset<TFactInputs>;

export type TControl = Control<TFactInputs>;
