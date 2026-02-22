import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { RideOption } from "../types";

type Props = {
  option: RideOption;
  selected: boolean;
  onPress: () => void;
};

const iconByRideType = {
  Bike: "motorbike",
  Auto: "rickshaw",
  Cab: "car"
} as const;

export function RideOptionCard({ option, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={`mb-3 rounded-2xl border p-4 ${selected ? "border-yellow-400 bg-yellow-50" : "border-gray-200 bg-white"}`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <MaterialCommunityIcons name={iconByRideType[option.type]} size={24} color="#1f2937" />
          <View>
            <Text className="text-base font-semibold text-gray-900">{option.type}</Text>
            <Text className="text-xs text-gray-500">{option.description}</Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-sm text-gray-500">{option.eta}</Text>
          <Text className="text-lg font-bold text-gray-900">₹{option.fare}</Text>
        </View>
      </View>
    </Pressable>
  );
}
