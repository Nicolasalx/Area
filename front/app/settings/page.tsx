'use client'

import Text from "@/components/ui/Text";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const { t } = useTranslation();

  return <Text>{t("settings.wip")}</Text>;
}
