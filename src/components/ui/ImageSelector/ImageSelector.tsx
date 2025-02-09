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
          let imagesLocal =
            form.values.image.length > 0
              ? [
                  form.values.image,
                  ...responseImages.filter(
                    (item) => item !== form.values.image
                  ),
                  ...emptyImageList,
                ]
              : [
                  ...responseImages.filter(
                    (item) => item !== form.values.image
                  ),
                  ...emptyImageList,
                ];
          if (imagesLocal.length > 6) {
            imagesLocal = imagesLocal.slice(0, 6);
          }
          setImages(imagesLocal);
        }
      );
    }
  }, [currentPreset]);

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
      <SimpleGrid cols={3} pt={20}>
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
    </Box>
  );
};

export default memo(ImageSelector);
