"use client";
import { IHeaderLink } from "@custom-types/ui/IHeaderLink";
import { useLocale } from "@hooks/useLocale";
import { Burger, Drawer } from "@mantine/core";
import { FC, useState } from "react";

import Logo from "../Logo/Logo";
import styles from "./SideBar.module.css";
import { useDisclosure } from "@mantine/hooks";
import SignIn from "../SignIn/SignIn";
import { Content } from "./Content";

export const Sidebar: FC = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div className={styles.sidebarWrapper}>
      <Burger size="md" opened={false} onClick={open} />
      <div className={styles.logoWrapper}>
        <Logo />
      </div>
      <Drawer
        position="left"
        opened={opened}
        onClose={close}
        size={"sm"}
        closeButtonProps={{ size: "xl" }}
      >
        <Content />
      </Drawer>
      <div className={styles.signInWrapper}>
        <SignIn />
      </div>
    </div>
  );
};
