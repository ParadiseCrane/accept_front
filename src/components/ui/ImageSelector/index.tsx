import { ICourseAddEdit } from '@custom-types/data/ICourse';
import { IImagePreset } from '@custom-types/data/IImagePreset';
import { useRequest } from '@hooks/useRequest';
import {
  ActionIcon,
  Box,
  Combobox,
  Image,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { InputWrapper } from '@ui/basics';
import PresetSingleSelect from '@ui/selectors/PresetSingleSelect/PresetSingleSelect';
import { getCookie } from '@utils/cookies';
import { FC, memo, useEffect, useState } from 'react';
import { Plus } from 'tabler-icons-react';

// TODO заменить на реальные данные
const allImages: string[] = [
  '768a33f5-e38c-4ac5-a61d-822c6f68f5dd',
  '84f9ab2c-cc1d-4038-bc04-9d6c7bb09624',
  '66b55d00-257a-428a-a28c-a37ccc906f33',
  '051f748e-80de-467f-a01b-9530c656e9ab',
  '913529c7-72a7-4d9e-93d1-baca7cd73fff',
  '210baf14-fc29-4ebd-8c4a-95881e5e8057',
];

const ImageSelector: FC<{
  initialImage: string;
  form: UseFormReturnType<
    ICourseAddEdit,
    (values: ICourseAddEdit) => ICourseAddEdit
  >;
}> = ({ initialImage, form }) => {
  const [presets, setPresets] = useState<IImagePreset[]>([]);
  const [currentPreset, setCurrentPreset] = useState<IImagePreset | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const { data } = useRequest('images_preset', 'GET', undefined);
  useEffect(() => {
    if (data) {
      setPresets((data as any[]).filter((item) => item.kind === 'course'));
    }
  }, [data]);
  return (
    <Box>
      <InputWrapper label="Изображение" />
      <SimpleGrid cols={3}>
        {initialImage && (
          <Image alt="Current image" src={`/api/image/${initialImage}`} />
        )}
        {allImages.map((item, index) => (
          <Image
            alt={`Image ${index + 1}`}
            src={`/api/image/${item}`}
            key={item}
          />
        ))}
      </SimpleGrid>
      {presets && (
        <PresetSingleSelect
          label={'Выберите набор'}
          presets={presets}
          select={(item: IImagePreset) => setCurrentPreset(item)}
        />
      )}
    </Box>
  );
};

export default memo(ImageSelector);
