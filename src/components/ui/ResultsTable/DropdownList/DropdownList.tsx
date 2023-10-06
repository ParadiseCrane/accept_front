import { FC, memo, useCallback, useState } from 'react';
import styles from './dropdownList.module.css';
import { IData, ILabel } from '../ResultsTable';
import { Menu } from '@mantine/core';
import { LoadingOverlay } from '@ui/basics';

const DropdownList: FC<{ cell: IData }> = ({ cell }) => {
  const [rest, setRest] = useState<ILabel[] | undefined>();

  const fetchRest = useCallback(() => {
    cell.rest ? cell.rest().then((res) => setRest(res)) : setRest([]);
  }, [cell]);

  return (
    <>
      {!!rest && rest.length == 0 ? (
        <div>{cell.best}</div>
      ) : (
        <Menu
          shadow="md"
          position="bottom-start"
          onOpen={fetchRest}
          zIndex={10}
        >
          <Menu.Target>
            <div className={styles.targetCell}>{cell.best}</div>
          </Menu.Target>
          <Menu.Dropdown>
            <div className={styles.restWrapper}>
              <LoadingOverlay
                visible={!!!rest}
                loaderProps={{ size: 'sm' }}
              />
              {rest !== undefined &&
                rest.map((item, index) => (
                  <Menu.Item key={index}>{item}</Menu.Item>
                ))}
            </div>
          </Menu.Dropdown>
        </Menu>
      )}
    </>
  );
};

export default memo(DropdownList);
