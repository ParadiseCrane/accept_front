import { ICON_SIZES } from '@constants/Sizes';
import { IProjectCard } from '@custom-types/ui/IProjectCard';
import { useLocale } from '@hooks/useLocale';
import { useWidth } from '@hooks/useWidth';
import { Button } from '@ui/basics';

import { FC } from 'react';
import { ChevronRight } from 'tabler-icons-react';
import styles from './projectCard.module.css';

export const ProjectCard: FC<{
  left: boolean;
  card: IProjectCard;
}> = ({ left, card }) => {
  const { locale } = useLocale();
  const position = left ? styles.left : styles.right;
  const { width } = useWidth();

  return (
    <div className={`${styles.wrapper} ${position}`}>
      <div className={`${styles.card} ${position}`}>
        <div className={styles.content}>
          <div
            className={styles.image}
            style={{
              backgroundImage: `url(/${card.image})`,
            }}
          >
            <div className={styles.title}>{card.title(locale)}</div>
          </div>
          <div className={styles.description}>{card.description(locale)}</div>

          <Button
            className={styles.button}
            variant="outline"
            href={card.href}
            rightSection={
              <ChevronRight
                color="var(--primary)"
                size={ICON_SIZES['md'][width]}
              />
            }
          >
            {locale.projects.view}
          </Button>
        </div>
      </div>
    </div>
  );
};
