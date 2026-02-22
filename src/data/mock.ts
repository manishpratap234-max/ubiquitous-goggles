import { Driver, RideOption } from "../types";

export const rideOptions: RideOption[] = [
  { type: "Bike", eta: "2 min", fare: 89, description: "Quick and affordable" },
  { type: "Auto", eta: "4 min", fare: 129, description: "Comfort with space" },
  { type: "Cab", eta: "6 min", fare: 219, description: "Premium city ride" }
];

export const mockDriver: Driver = {
  name: "Ravi Kumar",
  rating: 4.8,
  vehicleNumber: "KA 05 MN 2142"
};

export const mockCaptainRequest = {
  pickup: "HSR Layout, Bengaluru",
  drop: "Koramangala 5th Block",
  fare: 176
};
