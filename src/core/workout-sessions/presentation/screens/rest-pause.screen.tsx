import { useRef, useEffect } from "react";
import {
  View,
  FlatList,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from "react-native";
import { useThemeColor } from "heroui-native";
import { Button } from "heroui-native/button";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  cancelAnimation,
  Easing,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { create } from "zustand";

import { MaterialIcons } from "@/core/shared/components/icons";
import { Text } from "@/core/shared/components/text";

// ─── Scroll picker constants ─────────────────────────────────────────────────

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 3;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const PICKER_WIDTH = 80;

// ─── Zustand store ───────────────────────────────────────────────────────────

interface TimerState {
  estado: "seleccionando" | "en_cuenta" | "pausada" | "completada";
  minutos: number;
  segundos: number;
  duracionTotalMs: number;
  tiempoRestanteMs: number;
  targetEndTime: number | null;
  intervalId: ReturnType<typeof setInterval> | null;
}

interface TimerActions {
  setTiempo: (m: number, s: number) => void;
  iniciar: () => void;
  pausar: () => void;
  reanudar: () => void;
  reiniciar: () => void;
  tick: () => void;
}

const useTimerStore = create<TimerState & TimerActions>((set, get) => ({
  estado: "seleccionando",
  minutos: 0,
  segundos: 0,
  duracionTotalMs: 0,
  tiempoRestanteMs: 0,
  targetEndTime: null,
  intervalId: null,

  setTiempo: (m: number, s: number) =>
    set({
      minutos: m,
      segundos: s,
      duracionTotalMs: m * 60_000 + s * 1_000,
    }),

  iniciar: () => {
    const { duracionTotalMs } = get();
    if (duracionTotalMs <= 0) return;

    const targetEndTime = Date.now() + duracionTotalMs;
    const id = setInterval(() => {
      get().tick();
    }, 100);

    set({
      estado: "en_cuenta",
      targetEndTime,
      tiempoRestanteMs: duracionTotalMs,
      intervalId: id,
    });
  },

  pausar: () => {
    const { intervalId } = get();
    if (intervalId) clearInterval(intervalId);
    set({ estado: "pausada", intervalId: null, targetEndTime: null });
  },

  reanudar: () => {
    const { tiempoRestanteMs } = get();
    if (tiempoRestanteMs <= 0) {
      set({ estado: "completada" });
      return;
    }

    const targetEndTime = Date.now() + tiempoRestanteMs;
    const id = setInterval(() => {
      get().tick();
    }, 100);

    set({
      estado: "en_cuenta",
      targetEndTime,
      intervalId: id,
    });
  },

  reiniciar: () => {
    const { intervalId, minutos, segundos } = get();
    if (intervalId) clearInterval(intervalId);
    // Solo resetea el estado del timer, preserva la selección del usuario
    set({
      estado: "seleccionando",
      duracionTotalMs: minutos * 60_000 + segundos * 1_000,
      tiempoRestanteMs: 0,
      targetEndTime: null,
      intervalId: null,
    });
  },

  tick: () => {
    const { targetEndTime } = get();
    if (!targetEndTime) return;

    const remaining = Math.max(0, targetEndTime - Date.now());
    set({ tiempoRestanteMs: remaining });

    if (remaining <= 0) {
      const { intervalId } = get();
      if (intervalId) clearInterval(intervalId);
      set({
        estado: "completada",
        intervalId: null,
        targetEndTime: null,
      });
    }
  },
}));

// ─── Circular progress constants ────────────────────────────────────────────

const RADIUS = 120;
const STROKE_WIDTH = 12;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const VIEWBOX = (RADIUS + STROKE_WIDTH) * 2;
const CENTER = VIEWBOX / 2;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTiempo(ms: number): string {
  const totalSegundos = Math.ceil(ms / 1000);
  const m = Math.floor(totalSegundos / 60);
  const s = totalSegundos % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatPreview(minutos: number, segundos: number): string {
  const parts: string[] = [];
  if (minutos > 0) parts.push(`${minutos}m`);
  if (segundos > 0) parts.push(`${segundos}s`);
  return parts.length > 0 ? parts.join(" ") : "0s";
}

// ─── NumberScrollPicker ──────────────────────────────────────────────────────

/** Cuántas veces se repite la lista 00-59 para simular scroll infinito. */
const PICKER_REPEATS = 5;

interface NumberScrollPickerProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  label: string;
}

function NumberScrollPicker({
  min,
  max,
  value,
  onChange,
  label,
}: NumberScrollPickerProps) {
  const totalItems = max - min + 1;

  // Repetimos la lista varias veces para que todos los valores (incluido 00 y 59)
  // puedan llegar al centro del selector. Igual que hace Apple.
  const items = Array.from(
    { length: totalItems * PICKER_REPEATS },
    (_, i) => min + (i % totalItems),
  );

  // Empezamos en la repetición del medio para tener margen arriba y abajo.
  const initialIndex =
    totalItems * Math.floor(PICKER_REPEATS / 2) + (value - min);

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const realValue = min + (index % totalItems);
    onChange(realValue);
  };

  return (
    <View className="items-center">
      <Text variants={{ size: "muted" }} className="mb-2">
        {label}
      </Text>
      <View
        style={{ height: PICKER_HEIGHT, width: PICKER_WIDTH }}
        className="relative overflow-hidden"
      >
        {/* Selection indicator bar */}
        <View
          className="absolute left-0 right-0 rounded-lg bg-accent/10 z-0"
          style={{
            height: ITEM_HEIGHT,
            top: ITEM_HEIGHT,
          }}
        />
        <FlatList
          data={items}
          keyExtractor={(_, index) => String(index)}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          snapToAlignment="start"
          decelerationRate="fast"
          initialScrollIndex={initialIndex}
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          onMomentumScrollEnd={onMomentumEnd}
          renderItem={({ item }) => (
            <View
              style={{ height: ITEM_HEIGHT }}
              className="items-center justify-center"
            >
              <Text className="tabular-nums font-mono text-2xl">
                {String(item).padStart(2, "0")}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

// ─── CircularProgressRing ────────────────────────────────────────────────────

interface CircularProgressRingProps {
  progress: SharedValue<number>;
  accent: string;
  muted: string;
}

function CircularProgressRing({
  progress,
  accent,
  muted,
}: CircularProgressRingProps) {
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  return (
    <Svg
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      width={VIEWBOX}
      height={VIEWBOX}
    >
      {/* Background track */}
      <Circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS}
        stroke={muted}
        strokeWidth={STROKE_WIDTH}
        fill="none"
        strokeDasharray={CIRCUMFERENCE}
      />
      {/* Animated progress ring */}
      <AnimatedCircle
        animatedProps={animatedProps}
        cx={CENTER}
        cy={CENTER}
        r={RADIUS}
        stroke={accent}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        fill="none"
        rotation="-90"
        origin={`${CENTER}, ${CENTER}`}
        strokeDasharray={CIRCUMFERENCE}
      />
    </Svg>
  );
}

// ─── RestPauseScreen ─────────────────────────────────────────────────────────

export function RestPauseScreen() {
  const [background, accent, muted] = useThemeColor([
    "background",
    "accent",
    "muted",
  ]);

  const {
    estado,
    minutos,
    segundos,
    duracionTotalMs,
    tiempoRestanteMs,
    setTiempo,
    iniciar,
    pausar,
    reanudar,
    reiniciar,
  } = useTimerStore();

  // Progress shared value — componente concern, no store.
  const progress = useSharedValue(1);

  // Track previous estado to detect transitions.
  const prevEstadoRef = useRef(estado);

  // ── Mount effect: restore progress on remount (navigation survival) ──
  useEffect(() => {
    if (estado === "en_cuenta" || estado === "pausada") {
      const currentProgress =
        duracionTotalMs > 0 ? tiempoRestanteMs / duracionTotalMs : 0;
      progress.value = currentProgress;

      if (estado === "en_cuenta" && currentProgress > 0) {
        progress.value = withTiming(0, {
          duration: tiempoRestanteMs,
          easing: Easing.linear,
        });
      }
    } else if (estado === "completada") {
      cancelAnimation(progress);
      progress.value = 0;
    } else {
      progress.value = 1;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Estado-change effect: detect completion → haptic + animation ──
  useEffect(() => {
    const prev = prevEstadoRef.current;
    prevEstadoRef.current = estado;

    if (estado === "completada" && prev !== "completada") {
      cancelAnimation(progress);
      progress.value = 0;
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success,
      ).catch(() => {});
    }
  }, [estado, progress]);

  // ── Unmount cleanup: animation only ───────────────────────────────
  // IMPORTANTE: NO limpiar el intervalo aquí. Pertenece al store de
  // Zustand y DEBE sobrevivir la navegación (push/pop del stack).
  useEffect(() => {
    return () => {
      cancelAnimation(progress);
    };
  }, [progress]);

  // ── Action wrappers (store + animation + haptics) ─────────────────

  const handleIniciar = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    iniciar();
    progress.value = withTiming(0, {
      duration: duracionTotalMs,
      easing: Easing.linear,
    });
  };

  const handlePausar = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    pausar();
    cancelAnimation(progress);
  };

  const handleReanudar = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    reanudar();
    if (tiempoRestanteMs > 0) {
      progress.value = withTiming(0, {
        duration: tiempoRestanteMs,
        easing: Easing.linear,
      });
    }
  };

  const handleReiniciar = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    reiniciar();
    cancelAnimation(progress);
    progress.value = 1;
  };

  const pickerDisabled = minutos === 0 && segundos === 0;

  // ── Render ────────────────────────────────────────────────────────
  return (
    <View
      style={{ backgroundColor: background }}
      className="flex-1 items-center justify-center px-6"
    >
      {estado === "seleccionando" ? (
        // ── Picker section ──────────────────────────────────────────
        <View className="w-full items-center gap-y-8">
          {/* Scroll pickers */}
          <View className="flex-row items-start justify-center gap-x-4">
            <NumberScrollPicker
              min={0}
              max={59}
              value={minutos}
              onChange={(m) => setTiempo(m, segundos)}
              label="Minutos"
            />
            <NumberScrollPicker
              min={0}
              max={59}
              value={segundos}
              onChange={(s) => setTiempo(minutos, s)}
              label="Segundos"
            />
          </View>

          {/* Preview */}
          <Text variants={{ size: "h3" }}>
            {formatPreview(minutos, segundos)}
          </Text>

          {/* Start button */}
          <Button
            variant="primary"
            onPress={handleIniciar}
            isDisabled={pickerDisabled}
            className="rounded-full w-16 h-16"
          >
            <MaterialIcons name="play-arrow" size={32} className="text-white" />
          </Button>
        </View>
      ) : (
        // ── Countdown section ───────────────────────────────────────
        <View className="w-full items-center gap-y-8">
          {/* Circular progress ring */}
          <View className="items-center justify-center">
            <CircularProgressRing
              progress={progress}
              accent={accent}
              muted={muted}
            />

            {/* Centered time display */}
            <View className="absolute items-center justify-center">
              <Text variants={{ size: "h1" }} className="tabular-nums">
                {formatTiempo(tiempoRestanteMs)}
              </Text>
            </View>
          </View>

          {/* State label */}
          {estado === "completada" ? (
            <Text variants={{ size: "h4" }}>Completado</Text>
          ) : null}

          {/* Controls — ternarios, nunca && */}
          {estado === "en_cuenta" ? (
            <Button
              variant="primary"
              onPress={handlePausar}
              className="rounded-full w-16 h-16"
            >
              <MaterialIcons name="pause" size={32} className="text-white" />
            </Button>
          ) : null}

          {estado === "pausada" ? (
            <View className="flex-row gap-x-6">
              <Button
                variant="primary"
                onPress={handleReanudar}
                className="rounded-full w-16 h-16"
              >
                <MaterialIcons name="play-arrow" size={32} className="text-white" />
              </Button>
              <Button
                variant="outline"
                onPress={handleReiniciar}
                className="rounded-full w-16 h-16"
              >
                <MaterialIcons name="replay" size={28} className="text-accent" />
              </Button>
            </View>
          ) : null}

          {estado === "completada" ? (
            <Button
              variant="outline"
              onPress={handleReiniciar}
              className="rounded-full w-16 h-16"
            >
              <MaterialIcons name="replay" size={28} className="text-accent" />
            </Button>
          ) : null}
        </View>
      )}
    </View>
  );
}
