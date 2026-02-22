import { SafeAreaView, View, Text, Switch, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function CaptainHome() {
  const [online, setOnline] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0C111D', padding: 20 }}>
      <Text style={{ color: 'white', fontSize: 24, fontWeight: '800' }}>Captain Console</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, alignItems: 'center' }}>
        <Text style={{ color: 'white', fontSize: 16 }}>Go {online ? 'Offline' : 'Online'}</Text>
        <Switch value={online} onValueChange={setOnline} />
      </View>

      <View style={{ marginTop: 20, padding: 16, borderRadius: 12, backgroundColor: '#1D2939' }}>
        <Text style={{ color: 'white', fontWeight: '700' }}>Today's Earnings</Text>
        <Text style={{ color: '#FDB022', fontSize: 28, marginTop: 6 }}>₹1,480</Text>
        <Text style={{ color: '#98A2B3' }}>7 rides completed</Text>
      </View>

      <TouchableOpacity style={{ backgroundColor: '#1570EF', marginTop: 20, padding: 12, borderRadius: 12 }}>
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '700' }}>View Weekly Report</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
