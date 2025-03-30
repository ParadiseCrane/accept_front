import { cardContent } from '@constants/ContactCards';
import { useLocale } from '@hooks/useLocale';
import { FC, memo } from 'react';

import ContactCard from './ContactCard/ContactCard';
import styles from './contacts.module.css';

const Contacts: FC<{}> = () => {
  const { locale } = useLocale();

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{locale.feedback.contacts.title}</div>
      <div className={styles.cards}>
        {cardContent(locale).map((card, index) => (
          <ContactCard key={index} card={card} />
        ))}
      </div>
    </div>
  );
};

export default memo(Contacts);
