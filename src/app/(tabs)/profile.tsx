import { Avatar } from "heroui-native";
import { Card } from "heroui-native/card";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { Separator } from "heroui-native/separator";
import { Skeleton } from "heroui-native/skeleton";
import { SkeletonGroup } from "heroui-native/skeleton-group";
import { ComponentProps, Suspense } from "react";
import { ScrollView, View } from "react-native";

import { useAppConfig } from "@/core/profile/application/hooks/use-app-config";
import { MaterialIcons } from "@/core/shared/components/icons";
import { Text } from "@/core/shared/components/text";

const APP_VERSION = "1.0.0";
const REST_TIME = "3:00";

function ProfileHeader() {
  return (
    <View className="items-center gap-y-2 pt-4">
      <Avatar size="lg">
        <Avatar.Fallback>CR</Avatar.Fallback>
        <Avatar.Image
          source={{
            uri: "https://picsum.photos/200",
          }}
        />
      </Avatar>

      <Text variants={{ size: "h5" }}>Usuario</Text>
      <Text variants={{ size: "muted" }} numberOfLines={1}>
        usuario@crarc.com
      </Text>
    </View>
  );
}

function ProfileStats({
  totalWorkouts,
  totalWorkoutSession,
}: {
  totalWorkouts: number;
  totalWorkoutSession: number;
}) {
  return (
    <View className="flex-row gap-x-3">
      <Card className="flex-1">
        <Card.Header>
          <View className="flex-row items-center gap-x-2">
            <MaterialIcons
              name="fitness-center"
              size={20}
              className="text-accent"
            />
            <Text variants={{ size: "muted" }}>Entrenamientos</Text>
          </View>
        </Card.Header>
        <Card.Body>
          <Text variants={{ size: "h3" }}>{totalWorkouts}</Text>
        </Card.Body>
      </Card>
      <Card className="flex-1">
        <Card.Header>
          <View className="flex-row items-center gap-x-2">
            <MaterialIcons name="list-alt" size={20} className="text-accent" />
            <Text variants={{ size: "muted" }}>Sesiones</Text>
          </View>
        </Card.Header>
        <Card.Body>
          <Text variants={{ size: "h3" }}>{totalWorkoutSession}</Text>
        </Card.Body>
      </Card>
    </View>
  );
}

function ProfileMenuRow({
  icon,
  label,
  value,
  onPress = () => {},
}: {
  icon: ComponentProps<typeof MaterialIcons>["name"];
  label: string;
  value?: string;
  onPress?: () => void;
}) {
  return (
    <PressableFeedback onPress={onPress}>
      <View className="flex-row items-center justify-between py-3">
        <View className="flex-row items-center gap-x-3">
          <MaterialIcons name={icon} size={20} className="text-accent" />
          <Text>{label}</Text>
        </View>
        <View className="flex-row items-center gap-x-2">
          {value ? <Text variants={{ size: "muted" }}>{value}</Text> : null}
          <MaterialIcons
            name="arrow-forward-ios"
            size={16}
            className="text-muted"
          />
        </View>
      </View>
    </PressableFeedback>
  );
}

function ProfileMenuSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
      </Card.Header>
      <Card.Body className="gap-y-0">{children}</Card.Body>
    </Card>
  );
}

function ProfileScreenSkeleton() {
  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="gap-y-6 px-4 py-4"
      showsVerticalScrollIndicator={false}
    >
      <View className="items-center gap-y-2 pt-4">
        <Skeleton className="size-16 rounded-full" />
        <SkeletonGroup className="gap-y-1 mt-2 items-center">
          <SkeletonGroup.Item className="h-5 w-32 rounded-md" />
          <SkeletonGroup.Item className="h-4 w-48 rounded-md" />
        </SkeletonGroup>
      </View>

      <View className="flex-row gap-x-3">
        <Card className="flex-1">
          <Card.Header>
            <Skeleton className="h-4 w-24 rounded-md" />
          </Card.Header>
          <Card.Body>
            <Skeleton className="h-8 w-16 rounded-md" />
          </Card.Body>
        </Card>
        <Card className="flex-1">
          <Card.Header>
            <Skeleton className="h-4 w-20 rounded-md" />
          </Card.Header>
          <Card.Body>
            <Skeleton className="h-8 w-16 rounded-md" />
          </Card.Body>
        </Card>
      </View>

      <Card>
        <Card.Header>
          <Skeleton className="h-5 w-20 rounded-md" />
        </Card.Header>
        <Card.Body className="gap-y-0">
          <View className="py-3">
            <Skeleton className="h-5 w-full rounded-md" />
          </View>
          <Separator />
          <View className="py-3">
            <Skeleton className="h-5 w-3/4 rounded-md" />
          </View>
          <Separator />
          <View className="py-3">
            <Skeleton className="h-5 w-2/3 rounded-md" />
          </View>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <Skeleton className="h-5 w-24 rounded-md" />
        </Card.Header>
        <Card.Body className="gap-y-0">
          <View className="py-3">
            <Skeleton className="h-5 w-full rounded-md" />
          </View>
          <Separator />
          <View className="py-3">
            <Skeleton className="h-5 w-3/4 rounded-md" />
          </View>
          <Separator />
          <View className="py-3">
            <Skeleton className="h-5 w-2/3 rounded-md" />
          </View>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <Skeleton className="h-5 w-16 rounded-md" />
        </Card.Header>
        <Card.Body className="gap-y-0">
          <View className="py-3">
            <Skeleton className="h-5 w-full rounded-md" />
          </View>
          <Separator />
          <View className="py-3">
            <Skeleton className="h-5 w-3/4 rounded-md" />
          </View>
          <Separator />
          <View className="py-3">
            <Skeleton className="h-5 w-2/3 rounded-md" />
          </View>
          <Separator />
          <View className="py-3">
            <Skeleton className="h-5 w-1/2 rounded-md" />
          </View>
        </Card.Body>
      </Card>
    </ScrollView>
  );
}

function ProfileScreen() {
  const { appConfig } = useAppConfig();
  const data = appConfig.data;

  const themeLabel = data.theme === "dark" ? "Oscuro" : "Claro";

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="gap-y-6 px-4 pt-4 pb-24"
      showsVerticalScrollIndicator={false}
    >
      <ProfileHeader />

      <ProfileStats
        totalWorkouts={data.totalWorkouts}
        totalWorkoutSession={data.totalWorkoutSession}
      />

      <ProfileMenuSection title="Cuenta">
        <ProfileMenuRow icon="edit" label="Editar Perfil" />
        <Separator />
        <ProfileMenuRow icon="lock" label="Cambiar Contraseña" />
        <Separator />
        <ProfileMenuRow icon="notifications" label="Notificaciones" />
      </ProfileMenuSection>

      <ProfileMenuSection title="Preferencias">
        <ProfileMenuRow
          icon="straighten"
          label="Unidades"
          value={data.defaultWeightUnit}
        />
        <Separator />
        <ProfileMenuRow
          icon="brightness-medium"
          label="Tema"
          value={themeLabel}
        />
        <Separator />
        <ProfileMenuRow
          icon="timer"
          label="Tiempo de descanso"
          value={REST_TIME}
        />
      </ProfileMenuSection>

      <ProfileMenuSection title="App">
        <ProfileMenuRow icon="help" label="Ayuda y soporte" />
        <Separator />
        <ProfileMenuRow icon="policy" label="Políticas de privacidad" />
        <Separator />
        <ProfileMenuRow icon="description" label="Términos" />
        <Separator />
        <ProfileMenuRow
          icon="smartphone"
          label="Versión de la app"
          value={APP_VERSION}
        />
      </ProfileMenuSection>
    </ScrollView>
  );
}

export default function Profile() {
  return (
    <Suspense fallback={<ProfileScreenSkeleton />}>
      <ProfileScreen />
    </Suspense>
  );
}
