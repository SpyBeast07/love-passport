import { useMutation, useQuery } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Button, Image, ScrollView, Text, View } from "react-native";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const stamps = useQuery(api.stamps.listTemplates);
  const redeemed = useQuery(api.stamps.listRedeemed);
  const redeem = useMutation(api.stamps.redeemStamp);
  const seed = useMutation(api.stamps.seedStamps);

  const generateUploadUrl = useMutation(api.stamps.generateUploadUrl);

  // Store image per stamp ID
  const [images, setImages] = useState<Record<string, string>>({});

  const pickImage = async (stampId: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImages((prev) => ({
        ...prev,
        [stampId]: result.assets[0].uri,
      }));
    }
  };

  const uploadImage = async (uri: string) => {
    const uploadUrl = await generateUploadUrl();

    const response = await fetch(uri);
    const blob = await response.blob();

    const result = await fetch(uploadUrl, {
      method: "POST",
      body: blob,
      headers: { "Content-Type": blob.type },
    });

    const json = await result.json();
    return json.storageId;
  };


  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
      <Button title="Seed Database" onPress={() => seed()} />

      <Text style={{ fontSize: 18, marginTop: 20 }}>Available Stamps:</Text>

      {stamps?.map((stamp) => (
        <View key={stamp._id} style={{ marginTop: 15 }}>
          <Text>
            {stamp.icon} {stamp.title}
          </Text>

          <Button
            title="Pick Memory Photo"
            onPress={() => pickImage(stamp._id)}
          />

          {images[stamp._id] && (
            <Image
              source={{ uri: images[stamp._id] }}
              style={{ width: 80, height: 80, marginVertical: 5 }}
            />
          )}

          <Button
            title="Redeem"
            onPress={async () => {
              let storageId;

              if (images[stamp._id]) {
                storageId = await uploadImage(images[stamp._id]);
              }

              await redeem({
                stampId: stamp._id,
                storageId,
              });
            }}
          />
        </View>
      ))}

      <Text style={{ fontSize: 18, marginTop: 30 }}>My Passport:</Text>

      {redeemed?.map((r) => (
        <View key={r._id} style={{ marginTop: 10 }}>
          <Text>
            {r.icon} {r.title} — {r.country}
          </Text>
          <Text>
            Redeemed at: {new Date(r.redeemedAt).toLocaleString()}
          </Text>

          {r.imageUrl && (
            <Image
              source={{ uri: r.imageUrl }}
              style={{ width: 120, height: 120, marginTop: 5 }}
            />
          )}
        </View>
      ))}
    </ScrollView>
  );
}