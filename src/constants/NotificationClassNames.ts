import styles from "@styles/ui/notification.module.css";

export const defaultClassNames = {
  title: styles.title,
  icon: styles.icon,
  description: styles.description,
  root: styles.root,
};

export const defaultClassNamesInfoNotification = {
  title: styles.title,
  icon: styles.iconInfo,
  description: styles.description,
  root: `${styles.root}, ${styles.infoNotification}`,
};
