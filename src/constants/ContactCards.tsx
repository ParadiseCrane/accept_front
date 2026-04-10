import { IContactCard } from "@custom-types/ui/IContactCard";
import { ILocale } from "@custom-types/ui/ILocale";
import {
  IconBrandTelegram,
  IconBrandVk,
  IconCurrencyRubel,
  IconMail,
} from "@tabler/icons-react";

const iconSize = 25;

export const cardContent: (_: ILocale) => IContactCard[] = (locale) => [
  {
    title: locale.contacts.mail.title,
    description: locale.contacts.mail.description,
    contacts: [
      {
        icon: <IconMail size={iconSize} />,
        text: "paradise.crane.accept@gmail.com",
        href: "mailto:paradise.crane.accept@gmail.com",
      },
    ],
  },
  {
    title: locale.contacts.socials.title,
    description: locale.contacts.socials.description,
    contacts: [
      {
        icon: <IconBrandVk size={iconSize} />,
        text: "VK",
        href: "https://vk.com/dsomni",
      },
      {
        icon: <IconBrandTelegram size={iconSize} />,
        text: "Telegram",
        href: "https://t.me/dsomni",
      },
      {
        icon: <IconBrandTelegram size={iconSize} />,
        text: "Telegram",
        href: "https://t.me/Melaveetha",
      },
    ],
  },
  {
    title: locale.contacts.support.title,
    description: locale.contacts.support.description,
    contacts: [
      {
        icon: <IconCurrencyRubel size={iconSize} />,
        text: "5536913884507415",
      },
      {
        icon: <IconCurrencyRubel size={iconSize} />,
        text: "2200700169032637",
      },
    ],
  },
];
