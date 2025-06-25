import { FC, memo, useCallback, useEffect, useState } from 'react';
import { Center, Title, Box } from '@mantine/core';
import { TipTapEditor } from '@ui/basics/TipTapEditor/TipTapEditor';
import {
  IGroupOpenness,
  IUnit,
  IUnitDashboardMain,
} from '@custom-types/data/ICourse';
import { useLocale } from '@hooks/useLocale';
import { IconLock, IconLockOff, IconLockOpen } from '@tabler/icons-react';
import { Tip } from '@ui/basics';
import { sendRequest } from '@requests/request';
import { useSearchParams } from 'next/navigation';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';

const UnitMain: FC<{
  unitProps: IUnit | undefined;
}> = ({ unitProps }) => {
  const [unit, setUnit] = useState<IUnitDashboardMain | undefined>();
  const [isOpenForGroups, setIsOpenForGroups] = useState(false);
  const [groupSpec, setGroupSpec] = useState<string | undefined>(undefined);
  const { locale } = useLocale();
  const params = useSearchParams();

  const fetchData = useCallback(async () => {
    if (unitProps) {
      setUnit({
        title: unitProps.title,
        description: unitProps.description,
      });
    }
  }, [unitProps]);

  const sendGroupOpenness = useCallback(async () => {
    if (unitProps && groupSpec && groupSpec !== 'all') {
      const res = await sendRequest<{}, IGroupOpenness[]>(
        `course/toggle_group_openness/${unitProps.spec}/${groupSpec}`,
        'PUT'
      ).catch(() => {
        const id = newNotification({});
        errorNotification({
          id,
          title: locale.dashboard.course.groupOpennessRequestFail,
          autoClose: 5000,
        });
      });
      setIsOpenForGroups((prev) => !prev);
    }
  }, [groupSpec, locale, unitProps]);

  const getGroupOpenness = useCallback(async () => {
    if (params && unitProps) {
      setGroupSpec(params.get('group') ?? '');
      const groupOpennessListResponse = await sendRequest<{}, IGroupOpenness[]>(
        `course/course_openness_list/${unitProps.spec}/${params.get('group')}`,
        'GET'
      );
      if (!groupOpennessListResponse.error) {
        if (
          groupOpennessListResponse.response.find(
            (groupOpenness) =>
              groupOpenness.spec === unitProps.spec && groupOpenness.opened
          )
        ) {
          setIsOpenForGroups(true);
        }
      }
    }
  }, [params, unitProps]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    getGroupOpenness();
  }, [getGroupOpenness]);

  if (!unit) return null;

  const chooseGroup = !groupSpec || groupSpec === 'all';

  return (
    <>
      <Center mt={'md'} mb={'md'}>
        <Title order={1} ta={'center'} pr={'md'}>
          {unit.title}
        </Title>
        <Tip
          label={
            chooseGroup
              ? locale.dashboard.course.chooseGroup
              : isOpenForGroups
                ? locale.dashboard.course.unit.closeUnit
                : locale.dashboard.course.unit.openUnit
          }
          centerContent={true}
          onClick={chooseGroup ? undefined : sendGroupOpenness}
        >
          {chooseGroup ? (
            <IconLockOff color="var(--secondary)" />
          ) : isOpenForGroups ? (
            <IconLockOpen color="var(--secondary)" />
          ) : (
            <IconLock color="var(--secondary)" />
          )}
        </Tip>
      </Center>
      <Box ml={'xl'} mr={'xl'}>
        <TipTapEditor
          editorMode={false}
          content={unit.description}
          onUpdate={() => {}}
        />
      </Box>
    </>
  );
};

export default memo(UnitMain);
