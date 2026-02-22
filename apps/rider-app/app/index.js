import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { estimateFare } from '../src/services/api';

export default function RiderHome() {
  const [region, setRegion] = useState({ latitude: 12.9716, longitude: 77.5946, latitudeDelta: 0.03, longitudeDelta: 0.03 });
  const [fare, setFare] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const current = await Location.getCurrentPositionAsync({});
        setRegion((old) => ({ ...old, latitude: current.coords.latitude, longitude: current.coords.longitude }));
      }
    })();
  }, []);

  const onEstimate = async () => {
    const res = await estimateFare({ serviceType: 'BIKE', distanceKm: 6, durationMin: 18, demandIndex: 1.2 });
    setFare(res.data);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#101828' }}>
      <MapView style={{ flex: 1 }} region={region}>
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} title="You" />
      </MapView>
      <View style={{ padding: 16, backgroundColor: '#1D2939' }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>Ride booking</Text>
        <Text style={{ color: '#98A2B3', marginVertical: 6 }}>Bike • Auto • Cab with live captain tracking.</Text>
        <TouchableOpacity onPress={onEstimate} style={{ backgroundColor: '#FDB022', padding: 12, borderRadius: 12 }}>
          <Text style={{ textAlign: 'center', fontWeight: '700' }}>Estimate Fare</Text>
        </TouchableOpacity>
        {fare && <Text style={{ color: 'white', marginTop: 8 }}>Estimated Fare: ₹{fare.total}</Text>}
      </View>
    </SafeAreaView>
  );
}
