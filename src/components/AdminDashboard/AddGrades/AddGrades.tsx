import { IGroup } from '@custom-types/data/IGroup';
import { useLocale } from '@hooks/useLocale';
import { Button, Icon, MultiSelect, NumberInput } from '@ui/basics';
import { requestWithNotify } from '@utils/requestWithNotify';
import { FC, memo, useCallback, useState } from 'react';
import { Trash } from 'tabler-icons-react';

import styles from './addGrades.module.css';

const allowedLetters = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З'];
const initialLetters = allowedLetters.slice(0, 5);

const AddGrades: FC<{}> = () => {
  const { locale, lang } = useLocale();

  const [grades, setGrades] = useState<{ number: number; letters: string[] }[]>(
    []
  );

  const addGrade = useCallback(
    () =>
      setGrades((grades) => [
        ...grades,
        {
          number: grades.length > 0 ? grades[grades.length - 1].number + 1 : 1,
          letters: initialLetters,
        },
      ]),
    []
  );

  const onDelete = useCallback(
    (index: number) => () =>
      setGrades((grades) => {
        let newGrades = grades;
        newGrades.splice(index, 1);

        return [...newGrades];
      }),
    []
  );

  const setNumber = useCallback((index: number) => {
    return (number: string | number) => {
      setGrades((grades) => {
        let new_grades = grades;
        new_grades[index].number = +number;
        return [...new_grades];
      });
    };
  }, []);

  const setLetters = useCallback((index: number) => {
    return (letters: string[]) => {
      setGrades((grades) => {
        let new_grades = grades;
        new_grades[index].letters = letters;
        return [...new_grades];
      });
    };
  }, []);

  const handleSubmit = useCallback(() => {
    grades.forEach((grade) => {
      grade.letters.forEach((letter) => {
        if (grade.number > 0 && grade.number < 12)
          requestWithNotify<{ group: IGroup; members: string[] }, boolean>(
            'group/add',
            'POST',
            locale.notify.group.create,
            lang,
            (_: boolean) => '',
            {
              group: {
                spec: '',
                name: `${grade.number} ${letter}`,
                readonly: true,
              },
              members: [],
            }
          );
      });
    });
  }, [grades, lang, locale.notify.group.create]);

  return (
    <div className={styles.wrapper}>
      <div key={grades.length} className={styles.gradesWrapper}>
        {grades.map((grade, index) => (
          <div key={index} className={styles.gradeWrapper}>
            <NumberInput
              max={11}
              min={1}
              value={grade.number}
              onChange={setNumber(index)}
            />
            <MultiSelect
              data={allowedLetters}
              value={grade.letters}
              onChange={setLetters(index)}
            />
            <Icon onClick={onDelete(index)} size="xs">
              <Trash color="var(--negative)" />
            </Icon>
          </div>
        ))}
      </div>
      <Button
        hoverCardDropdownProps={{ style: { width: '100%' } }}
        size="lg"
        className={styles.addButton}
        color="var(--primary)"
        variant="light"
        onClick={addGrade}
      >
        +
      </Button>
      <div className={styles.submitButton}>
        <Button
          color="var(--primary)"
          onClick={handleSubmit}
          disabled={grades.length == 0}
        >
          {locale.create}
        </Button>
      </div>
    </div>
  );
};

export default memo(AddGrades);
