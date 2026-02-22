import { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { io } from 'socket.io-client';
import { bookRide, estimateFare, getNearbyDrivers, getRideHistory, sendOtp, setToken, updateProfile, verifyOtp } from '../src/services/api';

const SERVICE_TYPES = ['BIKE', 'AUTO', 'CAB'];
const PAYMENT_TYPES = ['CASH', 'UPI', 'WALLET'];
const API_URL = process.env.EXPO_PUBLIC_API_URL || '';

export default function RiderHome() {
  const [phone, setPhone] = useState('9999999999');
  const [otp, setOtp] = useState('123456');
  const [name, setName] = useState('Rider User');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('HOME');
  const [region, setRegion] = useState({ latitude: 12.9716, longitude: 77.5946, latitudeDelta: 0.03, longitudeDelta: 0.03 });
  const [dropAddress, setDropAddress] = useState('MG Road, Bengaluru');
  const [pickupAddress, setPickupAddress] = useState('Current Location');
  const [drivers, setDrivers] = useState([]);
  const [selectedService, setSelectedService] = useState('BIKE');
  const [paymentMode, setPaymentMode] = useState('CASH');
  const [fare, setFare] = useState(null);
  const [rideState, setRideState] = useState('IDLE');
  const [driver, setDriver] = useState(null);
  const [history, setHistory] = useState([]);

  const socket = useMemo(() => (API_URL ? io(API_URL.replace('/api', '')) : null), []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const current = await Location.getCurrentPositionAsync({});
        setRegion((old) => ({ ...old, latitude: current.coords.latitude, longitude: current.coords.longitude }));
      }
    })();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchDrivers();
    loadHistory();
  }, [isAuthenticated, selectedService]);

  useEffect(() => {
    if (!socket || !isAuthenticated) return;
    socket.emit('join:user', phone);
    socket.on('ride:status', (payload) => {
      if (payload?.status) setRideState(payload.status);
    });
    return () => socket.disconnect();
  }, [socket, isAuthenticated]);

  const fetchDrivers = async () => {
    try {
      const response = await getNearbyDrivers(region.latitude, region.longitude, selectedService);
      setDrivers(response.data);
    } catch {
      setDrivers([]);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await getRideHistory();
      setHistory(response.data || []);
    } catch {
      setHistory([]);
    }
  };

  const handleLogin = async () => {
    try {
      await sendOtp(phone, name);
      await verifyOtp(phone, otp);
      setIsAuthenticated(true);
    } catch (error) {
      Alert.alert('Login failed', error.message);
    }
  };

  const calculateRideEstimate = async () => {
    try {
      const response = await estimateFare({ serviceType: selectedService, distanceKm: 6, durationMin: 20, demandIndex: 1.1 });
      setFare(response.data);
    } catch (error) {
      Alert.alert('Estimate failed', error.message);
    }
  };

  const handleBookRide = async () => {
    setRideState('SEARCHING');
    try {
      await bookRide({
      serviceType: selectedService,
      pickup: { address: pickupAddress, lat: region.latitude, lng: region.longitude },
      dropoff: { address: dropAddress, lat: region.latitude + 0.02, lng: region.longitude + 0.02 },
      distanceKm: 6,
      durationMin: 20,
      paymentMode
    });
      const assignedDriver = drivers[0] || { name: 'Sanjay', vehicleNumber: 'KA01AB1234', rating: 4.9, phone: '9000000000', location: { lat: region.latitude + 0.008, lng: region.longitude + 0.008 } };
      setDriver(assignedDriver);
      setTimeout(() => setRideState('DRIVER_ARRIVING'), 1500);
      setTimeout(() => setRideState('RIDE_STARTED'), 4500);
      setTimeout(async () => {
        setRideState('RIDE_COMPLETED');
        await loadHistory();
      }, 9000);
    } catch (error) {
      setRideState('IDLE');
      Alert.alert('Booking failed', error.message);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setIsAuthenticated(false);
    setActiveTab('HOME');
    setRideState('IDLE');
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#111827' }}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: '700', marginBottom: 12 }}>Rider Login (OTP)</Text>
        <TextInput value={name} onChangeText={setName} placeholder='Name' placeholderTextColor='#aaa' style={inputStyle} />
        <TextInput value={phone} onChangeText={setPhone} placeholder='Phone' keyboardType='phone-pad' placeholderTextColor='#aaa' style={inputStyle} />
        <TextInput value={otp} onChangeText={setOtp} placeholder='OTP' keyboardType='number-pad' placeholderTextColor='#aaa' style={inputStyle} />
        <TouchableOpacity onPress={handleLogin} style={buttonStyle}><Text style={{ fontWeight: '700', textAlign: 'center' }}>Login</Text></TouchableOpacity>
        <Text style={{ color: '#9CA3AF', marginTop: 8 }}>Use OTP: 123456 for demo.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      {activeTab === 'HOME' && (
        <>
          <MapView style={{ flex: 1 }} region={region}>
            <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} title='You' />
            {drivers.map((d) => (
              <Marker key={d.id} coordinate={{ latitude: d.location.lat, longitude: d.location.lng }} title={d.name} pinColor='orange' />
            ))}
            {driver?.location && <Marker coordinate={{ latitude: driver.location.lat, longitude: driver.location.lng }} title='Driver' pinColor='green' />}
            {driver?.location && <Polyline coordinates={[{ latitude: driver.location.lat, longitude: driver.location.lng }, { latitude: region.latitude, longitude: region.longitude }, { latitude: region.latitude + 0.02, longitude: region.longitude + 0.02 }]} strokeColor='#22d3ee' strokeWidth={4} />}
          </MapView>
          <View style={{ padding: 14, backgroundColor: '#1e293b' }}>
            <TextInput value={pickupAddress} onChangeText={setPickupAddress} placeholder='Pickup' placeholderTextColor='#94a3b8' style={inputStyle} />
            <TextInput value={dropAddress} onChangeText={setDropAddress} placeholder='Where to?' placeholderTextColor='#94a3b8' style={inputStyle} />
            <View style={{ flexDirection: 'row', gap: 8, marginVertical: 8 }}>
              {SERVICE_TYPES.map((type) => <Chip key={type} text={type} active={selectedService === type} onPress={() => setSelectedService(type)} />)}
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
              {PAYMENT_TYPES.map((type) => <Chip key={type} text={type} active={paymentMode === type} onPress={() => setPaymentMode(type)} />)}
            </View>
            <TouchableOpacity onPress={calculateRideEstimate} style={buttonStyle}><Text style={{ textAlign: 'center', fontWeight: '700' }}>Get Fare Estimate</Text></TouchableOpacity>
            {fare && <Text style={{ color: 'white', marginTop: 8 }}>Fare: ₹{fare.total} • ETA: 20 min</Text>}
            <TouchableOpacity onPress={handleBookRide} style={{ ...buttonStyle, marginTop: 10, backgroundColor: '#22c55e' }}><Text style={{ textAlign: 'center', fontWeight: '700' }}>Book Ride</Text></TouchableOpacity>
            {rideState !== 'IDLE' && (
              <View style={{ marginTop: 8 }}>
                {rideState === 'SEARCHING' ? <ActivityIndicator color='white' /> : null}
                <Text style={{ color: 'white' }}>Status: {rideState}</Text>
                {driver && <Text style={{ color: '#cbd5e1' }}>Driver: {driver.name} • {driver.vehicleNumber} • ⭐{driver.rating} • {driver.phone}</Text>}
                {rideState === 'RIDE_COMPLETED' && fare && <Text style={{ color: '#86efac' }}>Payment Summary ({paymentMode}): ₹{fare.total}</Text>}
              </View>
            )}
          </View>
        </>
      )}

      {activeTab === 'HISTORY' && (
        <View style={{ flex: 1, padding: 16 }}>
          <Text style={{ color: 'white', fontSize: 20, marginBottom: 10 }}>Ride History</Text>
          <FlatList
            data={history}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={{ backgroundColor: '#1e293b', borderRadius: 12, padding: 12, marginBottom: 10 }}>
                <Text style={{ color: 'white' }}>{item.pickup?.address} ➜ {item.dropoff?.address}</Text>
                <Text style={{ color: '#cbd5e1' }}>{new Date(item.createdAt).toLocaleString()} • ₹{item.fare?.total}</Text>
              </View>
            )}
            ListEmptyComponent={<Text style={{ color: '#94a3b8' }}>No rides yet.</Text>}
          />
        </View>
      )}

      {activeTab === 'PROFILE' && (
        <View style={{ flex: 1, padding: 16 }}>
          <Text style={{ color: 'white', fontSize: 20, marginBottom: 12 }}>Profile</Text>
          <TextInput value={name} onChangeText={setName} placeholder='Name' placeholderTextColor='#aaa' style={inputStyle} />
          <TextInput value={phone} editable={false} style={{ ...inputStyle, opacity: 0.7 }} />
          <TouchableOpacity onPress={() => updateProfile({ name })} style={buttonStyle}><Text style={{ fontWeight: '700', textAlign: 'center' }}>Save Profile</Text></TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={{ ...buttonStyle, marginTop: 10, backgroundColor: '#ef4444' }}><Text style={{ fontWeight: '700', textAlign: 'center' }}>Logout</Text></TouchableOpacity>
        </View>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 12, backgroundColor: '#111827' }}>
        <TabBtn label='Home' active={activeTab === 'HOME'} onPress={() => setActiveTab('HOME')} />
        <TabBtn label='History' active={activeTab === 'HISTORY'} onPress={() => setActiveTab('HISTORY')} />
        <TabBtn label='Profile' active={activeTab === 'PROFILE'} onPress={() => setActiveTab('PROFILE')} />
      </View>
    </SafeAreaView>
  );
}

function Chip({ text, active, onPress }) {
  return <TouchableOpacity onPress={onPress} style={{ backgroundColor: active ? '#38bdf8' : '#334155', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 }}><Text style={{ color: 'white', fontWeight: '600' }}>{text}</Text></TouchableOpacity>;
}

function TabBtn({ label, active, onPress }) {
  return <TouchableOpacity onPress={onPress}><Text style={{ color: active ? '#38bdf8' : '#cbd5e1', fontWeight: '700' }}>{label}</Text></TouchableOpacity>;
}

const inputStyle = {
  backgroundColor: '#334155',
  color: 'white',
  borderRadius: 10,
  paddingHorizontal: 12,
  paddingVertical: 10,
  marginBottom: 8
};

const buttonStyle = {
  backgroundColor: '#fbbf24',
  padding: 12,
  borderRadius: 10
};
