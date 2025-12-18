import { DefaultLayout } from "@layouts/DefaultLayout";
import { FC, ReactNode } from "react";
// TODO add title

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return <DefaultLayout>{children}</DefaultLayout>;
};

export default Layout;
