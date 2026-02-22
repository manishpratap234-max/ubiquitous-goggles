import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, Switch, Text, TextInput, View } from "react-native";
import { mockCaptainRequest, mockDriver, rideOptions } from "./src/data/mock";
import { RideOption, RideStatus, RideType } from "./src/types";
import { RideOptionCard } from "./src/components/RideOptionCard";

type RootStackParamList = {
  Auth: undefined;
  RoleSelect: undefined;
  RiderHome: undefined;
  ConfirmRide: undefined;
  Searching: undefined;
  RideAssigned: undefined;
  RideProgress: undefined;
  CaptainLogin: undefined;
  CaptainHome: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [selectedRide, setSelectedRide] = useState<RideOption>(rideOptions[0]);
  const [pickup, setPickup] = useState("Indiranagar Metro Station");
  const [drop, setDrop] = useState("MG Road, Bengaluru");
  const [statusIndex, setStatusIndex] = useState(0);

  const statuses: RideStatus[] = ["Arriving", "On Trip", "Completed"];
  const currentStatus = statuses[statusIndex];

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Auth">
        <Stack.Screen name="Auth">
          {(props) => <AuthScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="RoleSelect">
          {(props) => <RoleSelectScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="RiderHome">
          {(props) => (
            <RiderHomeScreen
              {...props}
              pickup={pickup}
              drop={drop}
              selectedRide={selectedRide}
              onPickupChange={setPickup}
              onDropChange={setDrop}
              onRideSelect={(type) => setSelectedRide(rideOptions.find((o) => o.type === type) ?? rideOptions[0])}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="ConfirmRide">
          {(props) => <ConfirmRideScreen {...props} pickup={pickup} drop={drop} selectedRide={selectedRide} />}
        </Stack.Screen>
        <Stack.Screen name="Searching" component={SearchingScreen} />
        <Stack.Screen name="RideAssigned">
          {(props) => <RideAssignedScreen {...props} selectedRide={selectedRide} />}
        </Stack.Screen>
        <Stack.Screen name="RideProgress">
          {(props) => (
            <RideProgressScreen
              {...props}
              status={currentStatus}
              onAdvance={() => setStatusIndex((idx) => Math.min(idx + 1, statuses.length - 1))}
              onReset={() => setStatusIndex(0)}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="CaptainLogin" component={CaptainLoginScreen} />
        <Stack.Screen name="CaptainHome" component={CaptainHomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function AuthScreen({ navigation }: any) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const otpReady = otp.length === 6;

  return (
    <SafeAreaView className="flex-1 bg-white px-6 pt-16">
      <Text className="text-3xl font-bold text-gray-900">Welcome Rider 👋</Text>
      <Text className="mt-2 text-gray-500">Enter your phone number and 6-digit OTP to continue.</Text>
      <TextInput
        className="mt-8 rounded-xl border border-gray-300 px-4 py-3 text-base"
        keyboardType="phone-pad"
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        className="mt-4 rounded-xl border border-gray-300 px-4 py-3 text-base"
        keyboardType="number-pad"
        placeholder="6-digit OTP"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
      />
      <Pressable
        className={`mt-8 rounded-xl px-4 py-4 ${otpReady ? "bg-yellow-400" : "bg-gray-300"}`}
        disabled={!otpReady}
        onPress={() => navigation.navigate("RoleSelect")}
      >
        <Text className="text-center text-base font-semibold text-gray-900">Continue (Mock Verify)</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function RoleSelectScreen({ navigation }: any) {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-6 pt-20">
      <Text className="text-2xl font-bold text-gray-900">Choose your mode</Text>
      <Pressable className="mt-8 rounded-2xl bg-white p-6 shadow" onPress={() => navigation.navigate("RiderHome")}>
        <Text className="text-xl font-semibold">Rider App</Text>
        <Text className="mt-2 text-gray-500">Book a ride with bike, auto, or cab.</Text>
      </Pressable>
      <Pressable className="mt-4 rounded-2xl bg-white p-6 shadow" onPress={() => navigation.navigate("CaptainLogin")}>
        <Text className="text-xl font-semibold">Captain App</Text>
        <Text className="mt-2 text-gray-500">Handle ride requests and trip controls.</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function RiderHomeScreen({ navigation, pickup, drop, selectedRide, onPickupChange, onDropChange, onRideSelect }: any) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="h-1/2 items-center justify-center bg-blue-100">
        <Text className="text-base font-semibold text-blue-900">Mock Map Placeholder</Text>
      </View>
      <View className="-mt-6 flex-1 rounded-t-3xl bg-white px-5 pt-5">
        <TextInput className="rounded-xl border border-gray-200 px-4 py-3" value={pickup} onChangeText={onPickupChange} />
        <TextInput className="mt-3 rounded-xl border border-gray-200 px-4 py-3" value={drop} onChangeText={onDropChange} />
        <Text className="mb-2 mt-4 text-sm font-semibold text-gray-700">Choose ride</Text>
        {rideOptions.map((option) => (
          <RideOptionCard
            key={option.type}
            option={option}
            selected={selectedRide.type === option.type}
            onPress={() => onRideSelect(option.type as RideType)}
          />
        ))}
        <Pressable className="mt-auto rounded-xl bg-yellow-400 px-4 py-4" onPress={() => navigation.navigate("ConfirmRide")}>
          <Text className="text-center text-base font-bold text-gray-900">Review Ride</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function ConfirmRideScreen({ navigation, pickup, drop, selectedRide }: any) {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-6 pt-16">
      <Text className="text-2xl font-bold text-gray-900">Confirm Ride</Text>
      <View className="mt-6 rounded-2xl bg-white p-5 shadow">
        <Text className="text-gray-500">Pickup</Text>
        <Text className="text-base font-semibold text-gray-900">{pickup}</Text>
        <Text className="mt-3 text-gray-500">Drop</Text>
        <Text className="text-base font-semibold text-gray-900">{drop}</Text>
        <Text className="mt-3 text-gray-500">Ride</Text>
        <Text className="text-base font-semibold text-gray-900">{selectedRide.type}</Text>
        <Text className="mt-3 text-gray-500">Fare</Text>
        <Text className="text-xl font-bold text-gray-900">₹{selectedRide.fare}</Text>
      </View>
      <Pressable className="mt-8 rounded-xl bg-yellow-400 px-4 py-4" onPress={() => navigation.navigate("Searching")}>
        <Text className="text-center text-base font-bold text-gray-900">Confirm Booking</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function SearchingScreen({ navigation }: any) {
  useMemo(() => {
    const timer = setTimeout(() => navigation.replace("RideAssigned"), 1800);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white px-8">
      <ActivityIndicator size="large" color="#facc15" />
      <Text className="mt-4 text-lg font-semibold text-gray-900">Finding nearby drivers…</Text>
    </SafeAreaView>
  );
}

function RideAssignedScreen({ navigation, selectedRide }: any) {
  return (
    <SafeAreaView className="flex-1 bg-white px-6 pt-16">
      <Text className="text-2xl font-bold text-gray-900">Driver Assigned ✅</Text>
      <View className="mt-6 rounded-2xl bg-gray-50 p-5">
        <Text className="text-base font-semibold">{mockDriver.name}</Text>
        <Text className="mt-1 text-gray-600">Rating: {mockDriver.rating} ⭐</Text>
        <Text className="mt-1 text-gray-600">Vehicle: {mockDriver.vehicleNumber}</Text>
        <Text className="mt-1 text-gray-600">Ride: {selectedRide.type}</Text>
      </View>
      <View className="mt-4 flex-row gap-3">
        <Pressable className="flex-1 rounded-xl bg-gray-900 px-4 py-3">
          <Text className="text-center font-semibold text-white">Call</Text>
        </Pressable>
        <Pressable className="flex-1 rounded-xl bg-gray-200 px-4 py-3">
          <Text className="text-center font-semibold text-gray-900">Chat</Text>
        </Pressable>
      </View>
      <Pressable className="mt-6 rounded-xl bg-yellow-400 px-4 py-4" onPress={() => navigation.navigate("RideProgress")}>
        <Text className="text-center text-base font-bold text-gray-900">Track Ride</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function RideProgressScreen({ navigation, status, onAdvance, onReset }: any) {
  const done = status === "Completed";

  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-6 pt-20">
      <Text className="text-2xl font-bold text-gray-900">Ride Status</Text>
      <View className="mt-8 rounded-2xl bg-white p-6">
        <Text className="text-sm text-gray-500">Current status</Text>
        <Text className="mt-2 text-2xl font-extrabold text-gray-900">{status}</Text>
      </View>
      {!done ? (
        <Pressable className="mt-8 rounded-xl bg-yellow-400 px-4 py-4" onPress={onAdvance}>
          <Text className="text-center text-base font-bold text-gray-900">Move to Next Status</Text>
        </Pressable>
      ) : (
        <Pressable
          className="mt-8 rounded-xl bg-green-500 px-4 py-4"
          onPress={() => {
            onReset();
            navigation.navigate("RiderHome");
          }}
        >
          <Text className="text-center text-base font-bold text-white">Back to Home</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

function CaptainLoginScreen({ navigation }: any) {
  return (
    <SafeAreaView className="flex-1 bg-white px-6 pt-16">
      <Text className="text-2xl font-bold text-gray-900">Captain Login</Text>
      <TextInput className="mt-6 rounded-xl border border-gray-300 px-4 py-3" placeholder="Phone Number" keyboardType="phone-pad" />
      <TextInput className="mt-3 rounded-xl border border-gray-300 px-4 py-3" placeholder="OTP" keyboardType="number-pad" maxLength={6} />
      <Pressable className="mt-8 rounded-xl bg-yellow-400 px-4 py-4" onPress={() => navigation.navigate("CaptainHome")}>
        <Text className="text-center font-bold text-gray-900">Login (Mock)</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function CaptainHomeScreen() {
  const [online, setOnline] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [tripStarted, setTripStarted] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-6 pt-16">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-gray-900">Captain Dashboard</Text>
        <View className="items-center">
          <Switch value={online} onValueChange={setOnline} trackColor={{ true: "#facc15" }} />
          <Text className="text-xs text-gray-500">{online ? "Online" : "Offline"}</Text>
        </View>
      </View>

      <View className="mt-8 rounded-2xl bg-white p-5 shadow">
        <Text className="text-sm text-gray-500">Incoming Ride</Text>
        <Text className="mt-2 font-semibold text-gray-900">Pickup: {mockCaptainRequest.pickup}</Text>
        <Text className="mt-1 font-semibold text-gray-900">Drop: {mockCaptainRequest.drop}</Text>
        <Text className="mt-1 text-lg font-bold text-gray-900">Fare: ₹{mockCaptainRequest.fare}</Text>

        {!accepted ? (
          <View className="mt-4 flex-row gap-3">
            <Pressable className="flex-1 rounded-xl bg-yellow-400 px-4 py-3" onPress={() => setAccepted(true)}>
              <Text className="text-center font-bold text-gray-900">Accept</Text>
            </Pressable>
            <Pressable className="flex-1 rounded-xl bg-gray-200 px-4 py-3">
              <Text className="text-center font-bold text-gray-900">Reject</Text>
            </Pressable>
          </View>
        ) : (
          <View className="mt-4 gap-3">
            <Pressable
              className="rounded-xl bg-gray-900 px-4 py-3"
              onPress={() => !tripStarted && setTripStarted(true)}
              disabled={tripStarted}
            >
              <Text className="text-center font-bold text-white">{tripStarted ? "Trip Started" : "Start Trip"}</Text>
            </Pressable>
            <Pressable
              className="rounded-xl bg-green-600 px-4 py-3"
              onPress={() => {
                setTripStarted(false);
                setAccepted(false);
              }}
            >
              <Text className="text-center font-bold text-white">End Trip</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
