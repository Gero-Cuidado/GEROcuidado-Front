import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";

export enum EDiasSemana {
  Segunda = 1,
  Terça,
  Quarta,
  Quinta,
  Sexta,
  Sábado,
  Domingo,
}

type Props = {
  dias?: number[]; 
  callbackFn: (days: number[]) => void; 
};

export default function WeekDays({ dias, callbackFn }: Props) {
  const [days, setDays] = useState<number[]>(dias || []);

 
  const daysValues = Object.values(EDiasSemana).filter((value) =>
    typeof value === "number"
  ) as number[];
  const daysName = Object.keys(EDiasSemana).filter(
    (key) => isNaN(Number(key))
  ) as string[];

  const handlePress = (dia: number) => {
    if (days.includes(dia)) {
      const novoArray = days.filter((elemento) => elemento !== dia);
      setDays(novoArray);
      callbackFn(novoArray);
    } else {
      const novoArray = [...days, dia];
      setDays(novoArray);
      callbackFn(novoArray);
    }
  };

  return (
    <View style={styles.weekDays}>
      {daysValues.map((day, index) => (
        <Pressable
          key={day}
          onPress={() => handlePress(day)}
          style={[styles.circle, days.includes(day) && styles.active]}
        >
          <Text
            style={[styles.textDay, days.includes(day) && styles.activeText]}
          >
            {daysName[index].charAt(0)}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
  },
  active: {
    backgroundColor: "#6200ee",
  },
  textDay: {
    fontSize: 16,
    color: "#000",
  },
  activeText: {
    color: "#fff",
  },
});
