import { ICourseAddEdit } from '@custom-types/data/ICourse';
import { IImagePreset } from '@custom-types/data/IImagePreset';
import { useRequest } from '@hooks/useRequest';
import { Box, Image, SimpleGrid } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { InputWrapper } from '@ui/basics';
import PresetSingleSelect from '@ui/selectors/PresetSingleSelect/PresetSingleSelect';
import { getCookie } from '@utils/cookies';
import { FC, memo, useEffect, useState } from 'react';
import { Plus } from 'tabler-icons-react';
import { ImageComponent } from './ImageComponent/ImageComponent';
import { sendRequest } from '@requests/request';
import { useLocale } from '@hooks/useLocale';

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
  form: UseFormReturnType<
    ICourseAddEdit,
    (values: ICourseAddEdit) => ICourseAddEdit
  >;
}> = ({ form }) => {
  const emptyImageList = ['', '', '', '', '', ''];
  const [presets, setPresets] = useState<IImagePreset[]>([]);
  const [currentPreset, setCurrentPreset] = useState<IImagePreset | null>(null);
  const [images, setImages] = useState<string[]>(emptyImageList);
  const { data: allPresets } = useRequest('images_preset', 'GET', undefined);

  useEffect(() => {
    if (allPresets) {
      setPresets(
        (allPresets as IImagePreset[]).filter((item) => item.kind === 'course')
      );
      setCurrentPreset((allPresets as IImagePreset[])[0]);
    }
  }, [allPresets]);

  useEffect(() => {
    if (currentPreset) {
      const kind = 'course';
      const name = currentPreset?.name;
      sendRequest<any, any>(`images_preset/${kind}/${name}`, 'GET').then(
        (res) => {
          const responseImages: string[] = res.response;
          let imagesLocal = [
            form.values.image,
            ...responseImages.filter((item) => item !== form.values.image),
            ...emptyImageList,
          ];
          if (imagesLocal.length > 6) {
            imagesLocal = imagesLocal.slice(0, 6);
          }
          setImages((prev) => imagesLocal);
        }
      );
    }
  }, [currentPreset]);

  const { locale } = useLocale();
  console.log('images state', images);
  console.log('currentPreset', currentPreset);

  return (
    <Box>
      <PresetSingleSelect
        label={'Выберите набор'}
        presets={presets}
        currentPreset={currentPreset}
        select={(item: IImagePreset) => {
          setCurrentPreset(item);
        }}
      />

      <>
        <InputWrapper label={locale.course.courseImage} />
        <SimpleGrid cols={3}>
          {images.map((item, index) => (
            <ImageComponent
              index={index}
              item={item}
              onClick={() => {
                if (item.length > 0) {
                  form.setFieldValue('image', item);
                }
              }}
              active={form.values.image === item}
              key={index}
            />
          ))}
        </SimpleGrid>
      </>
    </Box>
  );
};

export default memo(ImageSelector);
