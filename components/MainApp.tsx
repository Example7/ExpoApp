import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { View, Text, ActivityIndicator } from "react-native";
import {
  Provider as PaperProvider,
  Button,
  Card,
  DefaultTheme,
  MD3DarkTheme,
  DataTable,
  TextInput,
  Portal,
  Dialog,
  IconButton,
} from "react-native-paper";
import { useCounterStore } from "../store/useCounterStore";
import { supabase } from "../lib/supabase";
import { formatDiagnostic } from "typescript";

export default function App() {
  const { count, increase, decrease, reset } = useCounterStore();
  const [isDark, setIsDark] = useState(true);

  const [page, setPage] = useState<number>(0);
  const [numberOfItemsPerPageList] = useState([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, products.length);

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  const [editVisible, setEditVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*");
    if (error) console.error("Błąd przy pobieraniu danych:", error);
    else setProducts(data || []);
    setLoading(false);
  };

  const addProduct = async () => {
    if (!name || !price) {
      alert("Uzupełnij nazwę i cenę!");
      return;
    }

    const { error } = await supabase
      .from("products")
      .insert([{ name: name, price: parseFloat(price) }]);

    if (error) {
      console.error("Błąd przy dodawaniu:", error);
      alert("Nie udało się dodać produktu!");
    } else {
      setName("");
      setPrice("");
      fetchProducts();
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Błąd przy usuwaniu:", error);
      alert("Nie udało się usunąć produktu!");
    } else {
      fetchProducts();
    }

    if (error) {
      console.error("Błąd: " + error.message);
    } else {
      fetchProducts();
      setEditVisible(false);
    }
  };

  const handleEdit = async () => {
    if (!editId) return;
    const { error } = await supabase
      .from("products")
      .update({ name: editName, price: editPrice })
      .eq("id", editId);
  };

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
    <ScrollView>
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
          <Card style={{ width: 320, padding: 16, marginBottom: 20 }}>
            <Card.Title title="Licznik Zustand" />
            <Card.Content>
              <Text
                style={{
                  fontSize: 28,
                  textAlign: "center",
                  marginVertical: 10,
                }}
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

          <View
            style={{
              paddingVertical: 20,
            }}
          >
            <Button mode="contained-tonal" onPress={() => setIsDark(!isDark)}>
              {isDark ? "Tryb jasny" : "Tryb ciemny"}
            </Button>
          </View>
          <Card style={{ flex: 1, margin: 8, padding: 16 }}>
            <Card.Title title="Dodaj produkt" />
            <Card.Content>
              <TextInput
                label="Nazwa produktu"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={{ marginBottom: 10 }}
              />
              <TextInput
                label="Cena"
                value={price}
                onChangeText={setPrice}
                mode="outlined"
                keyboardType="numeric"
                style={{ marginBottom: 10 }}
              />
              <Button mode="contained" onPress={addProduct}>
                Dodaj produkt
              </Button>
            </Card.Content>
          </Card>

          <Card style={{ flex: 1, margin: 8, padding: 16 }}>
            <Card.Title title="Produkty z Supabase" />
            <Card.Content>
              {loading ? (
                <ActivityIndicator />
              ) : products.length === 0 ? (
                <Text>Brak produktów w bazie.</Text>
              ) : (
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title>Nazwa</DataTable.Title>
                    <DataTable.Title numeric>Cena (zł)</DataTable.Title>
                    <DataTable.Title numeric>Edycja</DataTable.Title>
                    <DataTable.Title numeric>Usuwanie</DataTable.Title>
                  </DataTable.Header>

                  {products.slice(from, to).map((item) => (
                    <DataTable.Row key={item.id}>
                      <DataTable.Cell>{item.name}</DataTable.Cell>
                      <DataTable.Cell numeric>{item.price}</DataTable.Cell>
                      <DataTable.Cell numeric>
                        <IconButton
                          icon="pencil"
                          size={20}
                          onPress={() => {
                            setEditId(item.id);
                            setEditName(item.name);
                            setEditPrice(item.price.toString());
                            setEditVisible(true);
                          }}
                        ></IconButton>
                      </DataTable.Cell>
                      <DataTable.Cell numeric>
                        <IconButton
                          icon="delete"
                          iconColor="red"
                          size={20}
                          onPress={() => handleDelete(item.id)}
                        ></IconButton>
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))}

                  <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(products.length / itemsPerPage)}
                    onPageChange={(page) => setPage(page)}
                    label={`${from + 1}-${to} of ${products.length}`}
                    numberOfItemsPerPageList={numberOfItemsPerPageList}
                    numberOfItemsPerPage={itemsPerPage}
                    onItemsPerPageChange={onItemsPerPageChange}
                    showFastPaginationControls
                    selectPageDropdownLabel={"Rows per page"}
                  ></DataTable.Pagination>
                </DataTable>
              )}
            </Card.Content>
          </Card>

          <Portal>
            <Dialog
              visible={editVisible}
              onDismiss={() => setEditVisible(false)}
            >
              <Dialog.Title>Edytuj produkt</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  label="Nazwa"
                  value={editName}
                  onChangeText={setEditName}
                  mode="outlined"
                  style={{ marginBottom: 10 }}
                />
                <TextInput
                  label="Cena"
                  value={editPrice}
                  onChangeText={setEditPrice}
                  mode="outlined"
                  keyboardType="numeric"
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setEditVisible(false)}>Anuluj</Button>
                <Button
                  onPress={async () => {
                    const { error } = await supabase
                      .from("products")
                      .update({ name: editName, price: parseFloat(editPrice) })
                      .eq("id", editId);

                    if (error) {
                      console.error("Błąd przy edycji:", error);
                      alert("Nie udało się zaktualizować produktu!");
                    } else {
                      fetchProducts();
                      setEditVisible(false);
                    }
                  }}
                >
                  Zapisz
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>

          <Button
            style={{ marginVertical: 20 }}
            mode="contained-tonal"
            onPress={async () => {
              await supabase.auth.signOut();
            }}
          >
            Wyloguj się
          </Button>
        </View>
      </PaperProvider>
    </ScrollView>
  );
}
