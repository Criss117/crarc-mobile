import { useMemo } from "react";
import { View } from "react-native";
import { Text } from "./text";

export function FieldError({
  children,
  errors,
  ...props
}: React.ComponentProps<typeof View> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors?.length) {
      return null;
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ];

    if (uniqueErrors?.length == 1) {
      return (
        <Text className="text-danger text-sm">{uniqueErrors[0]?.message}</Text>
      );
    }

    return (
      <View className="ml-4 flex list-disc flex-col gap-1 ">
        {uniqueErrors.map(
          (error, index) =>
            error?.message && (
              <Text key={index} className="text-danger">
                {error.message}
              </Text>
            ),
        )}
      </View>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  return (
    <View data-slot="field-error" {...props}>
      {content}
    </View>
  );
}
