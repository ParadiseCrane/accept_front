import { IContactCard } from '@custom-types/ui/IContactCard';
import { FC, memo } from 'react';
import Link from 'next/link';
import styles from './contactCard.module.css';

const ContactCard: FC<{ card: IContactCard }> = ({ card }) => {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.cardTitle}>{card.title}</div>
      <div className={styles.cardContent}>
        <div className={styles.cardDescription}>
          {card.description}
        </div>
        <div className={styles.values}>
          {card.contacts.map((contact, index) => (
            <div className={styles.valueWrapper} key={index}>
              {contact.icon}
              {contact.href ? (
                <Link href={contact.href} className={styles.link}>
                  {contact.text}
                </Link>
              ) : (
                <div className={styles.link}>{contact.text}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(ContactCard);
