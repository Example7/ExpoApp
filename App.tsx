import * as React from "react";
import { View, Text } from "react-native";
import {
  Provider as PaperProvider,
  Button,
  Card,
  DefaultTheme,
  MD3DarkTheme,
} from "react-native-paper";
import { useCounterStore } from "./store/useCounterStore";

export default function App() {
  const { count, increase, decrease, reset } = useCounterStore();

  const [isDark, setIsDark] = React.useState(false);

  const x = 1;

  const theme = isDark
    ? {
        ...MD3DarkTheme,
        colors: {
          ...MD3DarkTheme.colors,
          primary: "#4caf50",
          secondary: "#ffeb3b",
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: "#ffeb3b",
          secondary: "#4caf50",
        },
      };

  return (
    <PaperProvider theme={theme}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
          padding: 16,
        }}
      >
        <Card style={{ width: 300, padding: 16 }}>
          <Card.Title title="Licznik Zustand" />
          <Card.Content>
            <Text
              style={{ fontSize: 28, textAlign: "center", marginVertical: 10 }}
            >
              {count}
            </Text>
          </Card.Content>
          <Card.Actions
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 10,
            }}
          >
            <Button mode="contained" onPress={increase}>
              +
            </Button>
            <Button mode="contained-tonal" onPress={decrease}>
              -
            </Button>
            <Button mode="outlined" onPress={reset}>
              Reset
            </Button>
          </Card.Actions>
        </Card>
        <View style={{ marginTop: 20 }}>
          <Button mode="contained-tonal" onPress={() => setIsDark(!isDark)}>
            {isDark ? "Tryb jasny" : "Tryb ciemny"}
          </Button>
        </View>
      </View>
    </PaperProvider>
  );
}
