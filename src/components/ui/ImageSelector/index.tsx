import { ActionIcon, Box, Image, SimpleGrid, Text, Title } from '@mantine/core';
import { InputWrapper } from '@ui/basics';
import { FC, memo } from 'react';
import { Plus } from 'tabler-icons-react';

const ImageSelector: FC<{}> = ({}) => {
  return (
    <Box>
      <InputWrapper label="Изображение" />
      <SimpleGrid cols={3}>
        <Image
          alt="Image 1"
          src={
            'https://wallpapers.com/images/high/abstract-desktop-hu0vz1pplzhtdbdn.webp'
          }
        />
        <Image
          alt="Image 2"
          src={
            'https://wallpapers.com/images/hd/colorful-curve-lines-abstract-guo9npv8qhilke0n.webp'
          }
        />
        <Image
          alt="Image 3"
          src={
            'https://wallpapers.com/images/hd/black-space-abstract-50q74mhqk30j0dax.webp'
          }
        />
        <Image
          alt="Image 4"
          src={
            'https://wallpapers.com/images/hd/geometric-polygon-abstract-myybkpq9l5i2xeo6.webp'
          }
        />
        <Image
          alt="Image 5"
          src={
            'https://wallpapers.com/images/high/cerebral-cortex-connected-to-rainbow-colors-kxmdiym6mljra3do.webp'
          }
        />
        <ActionIcon w={'100%'} h={'100%'} variant="outline" color="green">
          <Plus />
        </ActionIcon>
      </SimpleGrid>
    </Box>
  );
};

export default memo(ImageSelector);
