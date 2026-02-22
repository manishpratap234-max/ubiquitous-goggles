export type RideType = "Bike" | "Auto" | "Cab";

export type RideStatus = "Arriving" | "On Trip" | "Completed";

export type Driver = {
  name: string;
  rating: number;
  vehicleNumber: string;
};

export type RideOption = {
  type: RideType;
  eta: string;
  fare: number;
  description: string;
};
